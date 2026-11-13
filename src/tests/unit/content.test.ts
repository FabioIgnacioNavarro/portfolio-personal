import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { loadPortfolioContent } from '@/lib/content';

describe('Real Content Validation', () => {
  it('loads and validates all real content files from content/ directory', () => {
    const content = loadPortfolioContent();

    // Validaciones de perfil
    expect(content.profile).toBeDefined();
    expect(content.profile.name).toBe('Fabio Ignacio Navarro');
    expect(content.profile.role.es).toBeDefined();
    expect(content.profile.role.en).toBeDefined();
    expect(content.profile.role.es).not.toContain('Junior');
    expect(content.profile.role.en).not.toContain('Junior');
    expect(content.profile.summary.es).not.toContain('sector público');
    expect(content.profile.summary.en).not.toContain('public sector');
    expect(content.profile.links.github).toContain('github.com');
    expect(content.profile.links.portfolioRepo).toContain('github.com');
    expect(content.profile.links.linkedin).toContain('linkedin.com');

    // Verificar que los archivos locales de CV referenciados existan en public/
    for (const cvPath of [content.profile.links.cvUrl.es, content.profile.links.cvUrl.en]) {
      if (cvPath.startsWith('/')) {
        const publicFile = path.join(process.cwd(), 'public', cvPath.slice(1));
        expect(fs.existsSync(publicFile)).toBe(true);
        expect(fs.statSync(publicFile).size).toBeGreaterThan(0);
      }
    }

    // Validaciones de experiencia
    expect(content.experience.length).toBeGreaterThan(0);
    content.experience.forEach((exp) => {
      expect(exp.id).toBeDefined();
      expect(exp.company).toBeDefined();
      expect(exp.role.es).toBeDefined();
      expect(exp.role.en).toBeDefined();
      expect(exp.description.es).toBeDefined();
      expect(exp.description.en).toBeDefined();
      expect(exp.technologies.length).toBeGreaterThan(0);
    });

    // Validaciones de educación
    expect(content.education.length).toBeGreaterThan(0);
    content.education.forEach((edu) => {
      expect(edu.id).toBeDefined();
      expect(edu.institution).toBeDefined();
      expect(edu.degree.es).toBeDefined();
      expect(edu.degree.en).toBeDefined();
    });

    // Validaciones de certificaciones
    expect(content.certifications.length).toBeGreaterThan(0);
    content.certifications.forEach((cert) => {
      expect(cert.id).toBeDefined();
      expect(cert.name.es).toBeDefined();
      expect(cert.name.en).toBeDefined();
      expect(cert.issuer).toBeDefined();
    });
    const b2Cert = content.certifications.find((c) => c.id === 'english-b2-cert');
    expect(b2Cert?.status).toBe('in-progress');
    expect(b2Cert?.credentialUrl).toBe('');
    const informatorioCert = content.certifications.find((c) => c.id === 'informatorio-django');
    expect(informatorioCert?.credentialUrl).toBe(
      'https://drive.google.com/file/d/1g0upewkTFriiEQWD02LJR_cb01RyVqjv/view',
    );

    // Validaciones de habilidades
    expect(content.skills.length).toBeGreaterThan(0);
    content.skills.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.category.es).toBeDefined();
      expect(cat.category.en).toBeDefined();
      expect(cat.skills.length).toBeGreaterThan(0);
    });
    expect(content.skills.some((cat) => cat.id === 'ai-agents')).toBe(true);

    // Validaciones de idiomas
    expect(content.languages.length).toBeGreaterThan(0);
    content.languages.forEach((lang) => {
      expect(lang.id).toBeDefined();
      expect(lang.language.es).toBeDefined();
      expect(lang.proficiency.es).toBeDefined();
    });
    const englishLang = content.languages.find((l) => l.id === 'en');
    expect(englishLang?.proficiency.es).toContain('Certificación en curso');
    expect(englishLang?.proficiency.en).toContain('Certification in progress');

    // Validaciones de proyectos
    expect(content.projects.length).toBeGreaterThan(0);
    content.projects.forEach((proj) => {
      expect(proj.id).toBeDefined();
      expect(proj.title.es).toBeDefined();
      expect(proj.title.en).toBeDefined();
      expect(proj.caseStudy.es).toContain('### 1. Problema');
      expect(proj.caseStudy.en).toContain('### 1. Problem');
    });
    const travelProj = content.projects.find((p) => p.id === 'realtime-travel-platform');
    expect(travelProj?.status).toBe('in-progress');
  });
});
