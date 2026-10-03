import type { ReactNode } from 'react';

const tokenPattern = /(\/\/.*$|"[^"\n]*"|'[^'\n]*'|\b(?:pragma|solidity|contract|mapping|public|uint256|string|constructor|function|view|returns|internal|memory|payable|return|address)\b|\b\d+\b)/gm;

function highlightLine(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  tokenPattern.lastIndex = 0;
  while ((match = tokenPattern.exec(line))) {
    if (match.index > cursor) parts.push(line.slice(cursor, match.index));
    const token = match[0];
    const className = token.startsWith('//')
      ? 'token-comment'
      : token.startsWith('"') || token.startsWith("'")
        ? 'token-string'
        : /^\d+$/.test(token)
          ? 'token-number'
          : 'token-keyword';
    parts.push(<span className={className} key={`${match.index}-${token}`}>{token}</span>);
    cursor = match.index + token.length;
  }
  if (cursor < line.length) parts.push(line.slice(cursor));
  return parts;
}

export function SolidityCode({ source }: { source: string }) {
  return <pre className="solidity-code"><code>{source.split('\n').map((line, index) => <span className="solidity-line" key={index}>{highlightLine(line)}{index < source.split('\n').length - 1 ? '\n' : ''}</span>)}</code></pre>;
}
