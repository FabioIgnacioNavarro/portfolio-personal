import { PortfolioContent } from './content';

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
                '  contact       Datos de contacto y enlaces directos',
                '  open <app>    Abre una aplicación (about, projects, skills, contact)',
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
                '  contact       Contact info and direct links',
                '  open <app>    Launch an application window',
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
          .map((cat) => `${cat.category[lang]}:\n  ${cat.skills.map((s) => s.name).join(' · ')}`)
          .join('\n\n'),
      };

    case 'experience':
      return {
        text: content.experience
          .map(
            (e) => {
              const startStr = typeof e.startDate === 'object' ? e.startDate[lang] : e.startDate;
              const endStr = e.isCurrent
                ? (lang === 'es' ? 'Actualidad' : 'Present')
                : (typeof e.endDate === 'object' && e.endDate ? e.endDate[lang] : e.endDate);
              return `${e.role[lang]} @ ${e.company} (${startStr} — ${endStr})\n${e.description[lang]}`;
            },
          )
          .join('\n\n'),
      };

    case 'education':
      return {
        text: [
          lang === 'es' ? 'EDUCACIÓN:' : 'EDUCATION:',
          ...content.education.map(
            (edu) => {
              const startStr = typeof edu.startDate === 'object' ? edu.startDate[lang] : edu.startDate;
              return `  * ${edu.degree[lang]} — ${edu.institution} (${startStr})`;
            },
          ),
          lang === 'es' ? '\nCERTIFICACIONES:' : '\nCERTIFICATIONS:',
          ...content.certifications.map(
            (c) => `  * ${c.name[lang]} — ${c.issuer} (${c.issueDate})`,
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
      if (!target) {
        return {
          text:
            lang === 'es'
              ? 'Uso: open <about|projects|skills|experience|contact|terminal|<slug>>'
              : 'Usage: open <app>',
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
          '      @p~qp~~qMb      OS: Antigravity Web OS (Next.js 16)',
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
