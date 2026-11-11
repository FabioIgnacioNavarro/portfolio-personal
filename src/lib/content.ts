import fs from 'fs';
import path from 'path';
import { ZodError } from 'zod';
import {
  ProfileSchema,
  Profile,
  ExperienceListSchema,
  Experience,
  ProjectSchema,
  Project,
  EducationListSchema,
  Education,
  CertificationListSchema,
  Certification,
  SkillCategoryListSchema,
  SkillCategory,
  LanguageListSchema,
  Language,
} from './schemas';

export interface PortfolioContent {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  skills: SkillCategory[];
  languages: Language[];
}

function formatZodError(error: ZodError, filePath: string, entryId?: string): string {
  const issues = error.issues
    .map(
      (issue) =>
        `  - Field: '${issue.path.join('.')}' -> Message: ${issue.message} (code: ${issue.code})`,
    )
    .join('\n');

  return (
    `\n========================================\n` +
    `[CONTENT VALIDATION ERROR]\n` +
    `File: ${filePath}\n` +
    (entryId ? `Entry: '${entryId}'\n` : '') +
    `Issues:\n${issues}\n` +
    `========================================\n`
  );
}

function parseAndValidate<T>(
  filePath: string,
  schema: { parse: (val: unknown) => T },
  entryId?: string,
): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON syntax in ${filePath}: ${(err as Error).message}`);
  }

  try {
    return schema.parse(json);
  } catch (err) {
    if (err instanceof ZodError) {
      const formatted = formatZodError(err, filePath, entryId);
      console.error(formatted);
      throw new Error(formatted);
    }
    throw err;
  }
}

export function loadPortfolioContent(customContentDir?: string): PortfolioContent {
  const contentDir = customContentDir || path.join(process.cwd(), 'content');

  // 1. Perfil
  const profilePath = path.join(contentDir, 'profile.json');
  const profile = parseAndValidate(profilePath, ProfileSchema);

  // 2. Experiencia laboral
  const experiencePath = path.join(contentDir, 'experience.json');
  const experience = parseAndValidate(experiencePath, ExperienceListSchema);

  // 3. Educación
  const educationPath = path.join(contentDir, 'education.json');
  const education = parseAndValidate(educationPath, EducationListSchema);

  // 4. Certificaciones
  const certificationsPath = path.join(contentDir, 'certifications.json');
  const certifications = parseAndValidate(certificationsPath, CertificationListSchema);

  // 5. Habilidades técnicas
  const skillsPath = path.join(contentDir, 'skills.json');
  const skills = parseAndValidate(skillsPath, SkillCategoryListSchema);

  // 6. Idiomas
  const languagesPath = path.join(contentDir, 'languages.json');
  const languages = parseAndValidate(languagesPath, LanguageListSchema);

  // 7. Proyectos
  const projectsDir = path.join(contentDir, 'projects');
  const projects: Project[] = [];

  if (fs.existsSync(projectsDir)) {
    const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectFolder = path.join(projectsDir, entry.name);
        const metadataPath = path.join(projectFolder, 'project.json');
        const caseStudyEsPath = path.join(projectFolder, 'case-study.es.md');
        const caseStudyEnPath = path.join(projectFolder, 'case-study.en.md');

        if (!fs.existsSync(metadataPath)) {
          console.warn(`[Content Warning] Skipping folder ${entry.name}: missing project.json`);
          continue;
        }

        const rawJson = fs.readFileSync(metadataPath, 'utf-8');
        let parsedJson: Record<string, unknown>;
        try {
          parsedJson = JSON.parse(rawJson);
        } catch (err) {
          throw new Error(`Invalid JSON syntax in ${metadataPath}: ${(err as Error).message}`);
        }

        const caseStudyEs = fs.existsSync(caseStudyEsPath)
          ? fs.readFileSync(caseStudyEsPath, 'utf-8')
          : '';
        const caseStudyEn = fs.existsSync(caseStudyEnPath)
          ? fs.readFileSync(caseStudyEnPath, 'utf-8')
          : '';

        const fullProjectData = {
          ...parsedJson,
          caseStudy: {
            es: caseStudyEs,
            en: caseStudyEn,
          },
        };

        try {
          const validated = ProjectSchema.parse(fullProjectData);
          projects.push(validated);
        } catch (err) {
          if (err instanceof ZodError) {
            const formatted = formatZodError(err, metadataPath, entry.name);
            console.error(formatted);
            throw new Error(formatted);
          }
          throw err;
        }
      }
    }
  }

  return {
    profile,
    experience,
    projects,
    education,
    certifications,
    skills,
    languages,
  };
}
