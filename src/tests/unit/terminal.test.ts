import { describe, it, expect } from 'vitest';
import { executeTerminalCommand } from '@/lib/terminalCommands';
import { loadPortfolioContent } from '@/lib/content';

describe('Terminal Command Interpreter', () => {
  const content = loadPortfolioContent();

  it('handles help command in Spanish and English', () => {
    const resEs = executeTerminalCommand('help', content, 'es');
    expect(resEs.text).toContain('Comandos disponibles');

    const resEn = executeTerminalCommand('help', content, 'en');
    expect(resEn.text).toContain('Available terminal commands');
  });

  it('handles about command', () => {
    const res = executeTerminalCommand('about', content, 'es');
    expect(res.text).toContain('Fabio Ignacio Navarro');
  });

  it('handles projects command', () => {
    const res = executeTerminalCommand('projects', content, 'es');
    expect(res.text).toContain('comercial-management');
    expect(res.text).toContain('realtime-travel-platform');
  });

  it('handles open command with action', () => {
    const res = executeTerminalCommand('open projects', content, 'es');
    expect(res.action?.type).toBe('open-window');
    expect(res.action?.payload).toBe('projects');
  });

  it('rejects removed theme command in dark-only mode', () => {
    const res = executeTerminalCommand('theme light', content, 'es');
    expect(res.isError).toBe(true);
    expect(res.action).toBeUndefined();
  });

  it('reports updated Next.js runtime in neofetch command', () => {
    const res = executeTerminalCommand('neofetch', content, 'es');
    expect(res.text).toContain('Next.js 16');
  });

  it('handles lang command', () => {
    const res = executeTerminalCommand('lang en', content, 'es');
    expect(res.action?.type).toBe('set-lang');
    expect(res.action?.payload).toBe('en');
  });

  it('renders localized skills and education/certification statuses in both languages', () => {
    const skillsEs = executeTerminalCommand('skills', content, 'es');
    expect(skillsEs.text).toContain('Manejo de LLMs y Agentes de IA');

    const skillsEn = executeTerminalCommand('skills', content, 'en');
    expect(skillsEn.text).toContain('LLM & AI Agent Management');

    const eduEs = executeTerminalCommand('education', content, 'es');
    expect(eduEs.text).toContain('(En progreso)');

    const eduEn = executeTerminalCommand('education', content, 'en');
    expect(eduEn.text).toContain('(In progress)');

    const expEs = executeTerminalCommand('experience', content, 'es');
    expect(expEs.text).toContain('Traducción y localización de juegos');
    expect(expEs.text).toContain('Proyectos Independientes');

    const expEn = executeTerminalCommand('experience', content, 'en');
    expect(expEn.text).toContain('Game Translation & Localization');
    expect(expEn.text).toContain('Independent Projects');
  });

  it('returns error for invalid command', () => {
    const res = executeTerminalCommand('nonexistent_command', content, 'es');
    expect(res.isError).toBe(true);
    expect(res.text).toContain('no reconocido');
  });
});
