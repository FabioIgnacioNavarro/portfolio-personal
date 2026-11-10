import { describe, it, expect } from 'vitest';
import {
  LocalizedTextSchema,
  ProfileSchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  CertificationSchema,
  SkillCategorySchema,
  LanguageSchema,
} from '@/lib/schemas';

describe('Zod Content Schemas', () => {
  it('validates LocalizedText with es and en', () => {
    const valid = { es: 'Hola', en: 'Hello' };
    expect(LocalizedTextSchema.parse(valid)).toEqual(valid);

    expect(() => LocalizedTextSchema.parse({ es: '', en: 'Hello' })).toThrow();
    expect(() => LocalizedTextSchema.parse({ es: 'Hola' })).toThrow();
  });

  it('validates a valid Profile', () => {
    const validProfile = {
      name: 'Fabio Ignacio Navarro',
      role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
      headline: { es: 'Titular profesional', en: 'Professional headline' },
      summary: { es: 'Resumen en español', en: 'Summary in english' },
      location: { es: 'Argentina', en: 'Argentina' },
      links: {
        github: 'https://github.com/FabioIgnacioNavarro',
        linkedin: 'https://linkedin.com/in/fabio-ignacio-navarro-245288290',
        email: 'fabio@example.com',
        cvUrl: {
          es: '/cv-fabio-navarro-es.pdf',
          en: '/cv-fabio-navarro-en.pdf',
        },
      },
    };

    expect(ProfileSchema.parse(validProfile)).toBeDefined();
  });

  it('rejects an invalid email in Profile', () => {
    const invalidProfile = {
      name: 'Fabio',
      role: { es: 'Dev', en: 'Dev' },
      headline: { es: 'H', en: 'H' },
      summary: { es: 'S', en: 'S' },
      location: { es: 'A', en: 'A' },
      links: {
        github: 'https://github.com/FabioIgnacioNavarro',
        linkedin: 'https://linkedin.com',
        email: 'not-an-email',
        cvUrl: { es: 'cv.pdf', en: 'cv.pdf' },
      },
    };
    expect(() => ProfileSchema.parse(invalidProfile)).toThrow();
  });

  it('validates a valid Experience', () => {
    const validExperience = {
      id: 'ministerio-educacion',
      company: 'Ministerio de Educación',
      role: { es: 'Desarrollador Django', en: 'Django Developer' },
      startDate: 'TODO',
      endDate: null,
      isCurrent: true,
      description: { es: 'Desarrollo backend', en: 'Backend development' },
      achievements: [{ es: 'Mantenimiento de módulos', en: 'Modules maintenance' }],
      technologies: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    };
    expect(ExperienceSchema.parse(validExperience)).toBeDefined();
  });

  it('validates a valid Project with case study', () => {
    const validProject = {
      id: 'comercial-management',
      title: { es: 'Sistema de gestión', en: 'Management system' },
      summary: { es: 'Resumen', en: 'Summary' },
      role: { es: 'Full Stack Developer', en: 'Full Stack Developer' },
      status: 'in-progress' as const,
      technologies: ['Node.js', 'TypeScript', 'React', 'React Native'],
      links: {
        repo: '',
        demo: '',
      },
      screenshots: [],
      featured: true,
      caseStudy: {
        es: '# Problema\n\nTexto...',
        en: '# Problem\n\nText...',
      },
    };
    expect(ProjectSchema.parse(validProject)).toBeDefined();
  });

  it('validates Education, Certification, Skills, and Languages', () => {
    const validEdu = {
      id: 'utn-tup',
      institution: 'UTN FRRe',
      degree: { es: 'Tecnicatura', en: 'Associate Degree' },
      status: 'in-progress' as const,
      startDate: '2022',
      endDate: null,
    };
    expect(EducationSchema.parse(validEdu)).toBeDefined();

    const validCert = {
      id: 'django-cert',
      name: { es: 'Desarrollo Web Django', en: 'Django Web Development' },
      issuer: 'Informatorio Nivel 2',
      issueDate: '2024',
    };
    expect(CertificationSchema.parse(validCert)).toBeDefined();

    const validSkillCat = {
      id: 'backend',
      category: { es: 'Backend', en: 'Backend' },
      skills: [{ name: 'Python' }, { name: 'Django' }],
    };
    expect(SkillCategorySchema.parse(validSkillCat)).toBeDefined();

    const validLang = {
      id: 'es',
      language: { es: 'Español', en: 'Spanish' },
      proficiency: { es: 'Nativo', en: 'Native' },
    };
    expect(LanguageSchema.parse(validLang)).toBeDefined();
  });
});
