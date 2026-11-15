'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface RichMathProps {
  text: string;
  className?: string;
}

type Part =
  | { type: 'text'; value: string }
  | { type: 'math'; html: string; display: boolean };

// $$ ... $$  |  \[ ... \]  |  \( ... \)
const MATH_RE = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;

function renderMath(expr: string, display: boolean): string | null {
  try {
    return katex.renderToString(expr, {
      displayMode: display,
      throwOnError: true,
      strict: 'ignore',
      trust: false,
    });
  } catch {
    return null;
  }
}

function parse(text: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  MATH_RE.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = MATH_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });

    const isDollar = m[1] !== undefined;
    const expr = (m[1] ?? m[2] ?? m[3] ?? '').trim();
    // $$…$$ is display math; \[…\] / \(…\) stay inline (used inside answer options)
    const display = isDollar;
    const html = renderMath(expr, display);

    if (html) {
      parts.push({ type: 'math', html, display });
    } else {
      // Fallback: never show a red parse error — show the raw expression instead
      parts.push({ type: 'text', value: expr });
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

/**
 * Renders plain text that may contain LaTeX ($$…$$, \[…\], \(…\)) using KaTeX.
 */
export default function RichMath({ text, className = '' }: RichMathProps) {
  const parts = useMemo(() => parse(text || ''), [text]);

  return (
    <div className={className}>
      {parts.map((p, i) =>
        p.type === 'text' ? (
          <span key={i}>{p.value}</span>
        ) : p.display ? (
          <div
            key={i}
            className="my-2 overflow-x-auto overflow-y-hidden py-1 text-slate-900"
            dangerouslySetInnerHTML={{ __html: p.html }}
          />
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: p.html }} />
        )
      )}
    </div>
  );
}
