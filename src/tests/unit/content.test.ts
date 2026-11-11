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
    expect(content.profile.links.github).toContain('github.com');
    expect(content.profile.links.linkedin).toContain('linkedin.com');

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

    // Validaciones de habilidades
    expect(content.skills.length).toBeGreaterThan(0);
    content.skills.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.category.es).toBeDefined();
      expect(cat.category.en).toBeDefined();
      expect(cat.skills.length).toBeGreaterThan(0);
    });

    // Validaciones de idiomas
    expect(content.languages.length).toBeGreaterThan(0);
    content.languages.forEach((lang) => {
      expect(lang.id).toBeDefined();
      expect(lang.language.es).toBeDefined();
      expect(lang.proficiency.es).toBeDefined();
    });

    // Validaciones de proyectos
    expect(content.projects.length).toBeGreaterThan(0);
    content.projects.forEach((proj) => {
      expect(proj.id).toBeDefined();
      expect(proj.title.es).toBeDefined();
      expect(proj.title.en).toBeDefined();
      expect(proj.caseStudy.es).toContain('### 1. Problema');
      expect(proj.caseStudy.en).toContain('### 1. Problem');
    });
  });
});
