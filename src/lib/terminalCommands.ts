import { PortfolioContent } from './content';
import { resolveLocalizedText } from './schemas/common';

export const VALID_TERMINAL_WINDOW_TARGETS = [
  'about',
  'projects',
  'experience',
  'skills',
  'education',
  'languages',
  'contact',
  'terminal',
  'trash',
] as const;

export interface CommandOutput {
  text?: string;
  isError?: boolean;
  action?: {
    type: 'open-window' | 'set-lang' | 'set-mode' | 'clear';
    payload?: string;
  };
}

export function executeTerminalCommand(
  input: string,
  content: PortfolioContent,
  lang: 'es' | 'en',
): CommandOutput {
  const trimmed = input.trim();
  if (!trimmed) return {};

  const parts = trimmed.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      return {
        text:
          lang === 'es'
            ? [
                'Comandos disponibles en la terminal:',
                '  help          Muestra esta lista de comandos',
                '  about         Información profesional de Fabio',
                '  projects      Lista los proyectos destacados',
                '  skills        Habilidades técnicas y stack',
                '  experience    Experiencia laboral y roles',
                '  education     Formación académica y certificaciones',
                '  languages     Idiomas y nivel de competencia',
                '  contact       Datos de contacto y enlaces directos',
                '  open <app>    Abre una app o proyecto (ej: open projects)',
                '  lang <l>      Cambia el idioma (es | en)',
                '  mode simple   Regresa al Modo Simple',
                '  neofetch      Información del sistema y desarrollador',
                '  clear         Limpia la pantalla',
              ].join('\n')
            : [
                'Available terminal commands:',
                '  help          Display this list of commands',
                '  about         Professional bio and background',
                '  projects      List featured software projects',
                '  skills        Technical skills and stack',
                '  experience    Work history and engineering roles',
                '  education     Academic background and certifications',
                '  languages     Languages and proficiency levels',
                '  contact       Contact info and direct links',
                '  open <app>    Launch an app or project (e.g. open projects)',
                '  lang <l>      Switch language (es | en)',
                '  mode simple   Switch to Simple Mode',
                '  neofetch      Developer system specs',
                '  clear         Clear the terminal screen',
              ].join('\n'),
      };

    case 'about':
      return {
        text: `${content.profile.name} — ${content.profile.role[lang]}\n${content.profile.headline[lang]}\n\n${content.profile.summary[lang]}\n${
          lang === 'es' ? 'Ubicación' : 'Location'
        }: ${content.profile.location[lang]}`,
      };

    case 'projects':
      return {
        text: content.projects
          .map(
            (p, idx) =>
              `[${idx + 1}] ${p.title[lang]} (${p.status})\n    Stack: ${p.technologies.join(', ')}\n    Slug: ${p.id} (${
                lang === 'es'
                  ? `Usa 'open ${p.id}' para ver caso`
                  : `Use 'open ${p.id}' to view case study`
              })`,
          )
          .join('\n\n'),
      };

    case 'skills':
      return {
        text: content.skills
          .map(
            (cat) =>
              `${cat.category[lang]}:\n  ${cat.skills.map((s) => resolveLocalizedText(s.name, lang)).join(' · ')}`,
          )
          .join('\n\n'),
      };

    case 'experience':
      return {
        text: content.experience
          .map((e) => {
            const startStr = resolveLocalizedText(e.startDate, lang);
            const endStr = e.isCurrent
              ? lang === 'es'
                ? 'Actualidad'
                : 'Present'
              : resolveLocalizedText(e.endDate, lang);
            return `${e.role[lang]} @ ${resolveLocalizedText(e.company, lang)} (${startStr} — ${endStr})\n${e.description[lang]}`;
          })
          .join('\n\n'),
      };

    case 'education':
      return {
        text: [
          lang === 'es' ? 'EDUCACIÓN:' : 'EDUCATION:',
          ...content.education.map((edu) => {
            const startStr = resolveLocalizedText(edu.startDate, lang);
            return `  * ${edu.degree[lang]} — ${edu.institution} (${startStr})`;
          }),
          lang === 'es' ? '\nCERTIFICACIONES:' : '\nCERTIFICATIONS:',
          ...content.certifications.map(
            (c) => `  * ${c.name[lang]} — ${c.issuer} (${resolveLocalizedText(c.issueDate, lang)})`,
          ),
        ].join('\n'),
      };

    case 'languages':
      return {
        text: [
          lang === 'es' ? 'IDIOMAS:' : 'LANGUAGES:',
          ...content.languages.map(
            (item) => `  * ${item.language[lang]} — ${item.proficiency[lang]}`,
          ),
        ].join('\n'),
      };

    case 'contact':
      return {
        text: [
          `Email:    ${content.profile.links.email}`,
          `GitHub:   ${content.profile.links.github}`,
          `LinkedIn: ${content.profile.links.linkedin}`,
        ].join('\n'),
      };

    case 'open': {
      const target = args[0]?.toLowerCase();
      const projectSlugs = content.projects.map((p) => p.id);
      const validTargets = [...VALID_TERMINAL_WINDOW_TARGETS, ...projectSlugs];

      if (!target) {
        return {
          text:
            lang === 'es'
              ? `Uso: open <${VALID_TERMINAL_WINDOW_TARGETS.join('|')}|<slug>>`
              : `Usage: open <${VALID_TERMINAL_WINDOW_TARGETS.join('|')}|<slug>>`,
          isError: true,
        };
      }

      if (!validTargets.includes(target)) {
        return {
          text:
            lang === 'es'
              ? `Destino no encontrado: '${target}'. Válidos: ${validTargets.join(', ')}`
              : `Unknown target: '${target}'. Valid targets: ${validTargets.join(', ')}`,
          isError: true,
        };
      }

      return {
        text: lang === 'es' ? `Abriendo ventana '${target}'...` : `Opening window '${target}'...`,
        action: { type: 'open-window', payload: target },
      };
    }

    case 'lang': {
      const targetLang = args[0]?.toLowerCase();
      if (targetLang === 'es' || targetLang === 'en') {
        return {
          text: `Idioma cambiado a ${targetLang.toUpperCase()}.`,
          action: { type: 'set-lang', payload: targetLang },
        };
      }
      return {
        text: 'Usage: lang es | lang en',
        isError: true,
      };
    }

    case 'mode': {
      const targetMode = args[0]?.toLowerCase();
      if (targetMode === 'simple' || targetMode === 'desktop') {
        return {
          text: `Switching to ${targetMode} mode...`,
          action: { type: 'set-mode', payload: targetMode },
        };
      }
      return {
        text: 'Usage: mode simple | mode desktop',
        isError: true,
      };
    }

    case 'clear':
    case 'cls':
      return { action: { type: 'clear' } };

    case 'whoami':
    case 'neofetch':
      return {
        text: [
          '        _nnnn_        fabio@portfolio',
          '       dGGGGMMb       ---------------',
          '      @p~qp~~qMb      OS: Fabio Portfolio OS (Next.js 16)',
          '      M|@||@) M|      Host: Argentina (Chaco)',
          '      @,----.JM|      Kernel: TypeScript 5.9 + Zod',
          '     (\\__/~~\\__/)     Shell: Portfolio Terminal v2.0',
          '      |  )  (  |      Stack: Python, Django, TypeScript, React, Docker',
          '      / /\\  /\\ \\      Uptime: Ready for new engineering roles',
        ].join('\n'),
      };

    default:
      return {
        text:
          lang === 'es'
            ? `Comando no reconocido: '${command}'. Escribe 'help' para ver la lista.`
            : `Unknown command: '${command}'. Type 'help' for available commands.`,
        isError: true,
      };
  }
}
