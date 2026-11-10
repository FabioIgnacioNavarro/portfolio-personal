import { describe, it, expect } from 'vitest';
import { loadPortfolioContent } from '@/lib/content';

describe('Real Content Validation', () => {
  it('loads and validates all real content files from content/ directory', () => {
    const content = loadPortfolioContent();

    // Profile checks
    expect(content.profile).toBeDefined();
    expect(content.profile.name).toBe('Fabio Ignacio Navarro');
    expect(content.profile.role.es).toBeDefined();
    expect(content.profile.role.en).toBeDefined();
    expect(content.profile.links.github).toContain('github.com');
    expect(content.profile.links.linkedin).toContain('linkedin.com');

    // Experience checks
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

    // Education checks
    expect(content.education.length).toBeGreaterThan(0);
    content.education.forEach((edu) => {
      expect(edu.id).toBeDefined();
      expect(edu.institution).toBeDefined();
      expect(edu.degree.es).toBeDefined();
      expect(edu.degree.en).toBeDefined();
    });

    // Certifications checks
    expect(content.certifications.length).toBeGreaterThan(0);
    content.certifications.forEach((cert) => {
      expect(cert.id).toBeDefined();
      expect(cert.name.es).toBeDefined();
      expect(cert.name.en).toBeDefined();
      expect(cert.issuer).toBeDefined();
    });

    // Skills checks
    expect(content.skills.length).toBeGreaterThan(0);
    content.skills.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.category.es).toBeDefined();
      expect(cat.category.en).toBeDefined();
      expect(cat.skills.length).toBeGreaterThan(0);
    });

    // Languages checks
    expect(content.languages.length).toBeGreaterThan(0);
    content.languages.forEach((lang) => {
      expect(lang.id).toBeDefined();
      expect(lang.language.es).toBeDefined();
      expect(lang.proficiency.es).toBeDefined();
    });

    // Projects checks
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
