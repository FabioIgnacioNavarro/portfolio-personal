'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PortfolioContent } from '@/lib/content';
import { useViewPreferences } from '@/context/ViewPreferencesContext';
import { useWindowManager, WindowId } from '@/context/WindowManagerContext';
import { executeTerminalCommand } from '@/lib/terminalCommands';

interface HistoryItem {
  id: string;
  command: string;
  output?: string;
  isError?: boolean;
}

export function TerminalApp({ content }: { content: PortfolioContent }) {
  const { lang, setLang, setTheme, setMode } = useViewPreferences();
  const { openWindow } = useWindowManager();

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome',
      command: '',
      output:
        lang === 'es'
          ? 'Fabio Navarro Portfolio Terminal v2.0\nEscribe "help" para ver la lista de comandos disponibles.'
          : 'Fabio Navarro Portfolio Terminal v2.0\nType "help" for a list of available commands.',
    },
  ]);
  const [commandIndex, setCommandIndex] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setCommandList((prev) => [...prev, cmd]);
    setCommandIndex(-1);

    const result = executeTerminalCommand(cmd, content, lang);

    if (result.action) {
      if (result.action.type === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }
      if (result.action.type === 'set-theme' && result.action.payload) {
        setTheme(result.action.payload as 'light' | 'dark');
      }
      if (result.action.type === 'set-lang' && result.action.payload) {
        setLang(result.action.payload as 'es' | 'en');
      }
      if (result.action.type === 'set-mode' && result.action.payload) {
        setMode(result.action.payload as 'simple' | 'desktop');
      }
      if (result.action.type === 'open-window' && result.action.payload) {
        const target = result.action.payload;
        // Check if target is a project slug
        const isProject = content.projects.some((p) => p.id === target);
        if (isProject) {
          openWindow('project-detail', { projectSlug: target });
        } else {
          openWindow(target as WindowId);
        }
      }
    }

    setHistory((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        command: cmd,
        output: result.text,
        isError: result.isError,
      },
    ]);

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIndex =
        commandIndex === -1 ? commandList.length - 1 : Math.max(0, commandIndex - 1);
      setCommandIndex(nextIndex);
      setInput(commandList[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex === -1) return;
      const nextIndex = commandIndex + 1;
      if (nextIndex >= commandList.length) {
        setCommandIndex(-1);
        setInput('');
      } else {
        setCommandIndex(nextIndex);
        setInput(commandList[nextIndex]);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full flex flex-col font-mono text-xs sm:text-sm text-slate-100 bg-slate-950 p-3 sm:p-4 rounded-lg select-text overflow-y-auto"
    >
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="text-blue-400 font-bold">fabio@portfolio:~$</span>
                <span className="text-slate-100">{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre
                className={`whitespace-pre-wrap leading-relaxed ${
                  item.isError ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {item.output}
              </pre>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3 pt-2">
        <span className="text-blue-400 font-bold shrink-0">fabio@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-slate-100 outline-none border-none p-0 focus:ring-0 font-mono text-xs sm:text-sm"
          aria-label="Entrada de comandos de la terminal"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
