import type { ReactNode } from 'react';

export function WindowFrame({ title, icon, onClose, onMinimize, onToggleMaximize, maximized, children }: {
  title: string;
  icon: string;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  maximized: boolean;
  children: ReactNode;
}) {
  return <div className="window-layer" onMouseDown={(event) => event.target === event.currentTarget && onMinimize()}>
    <section className={`window ${maximized ? 'window-maximized' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="window-bar">
        <div className="window-title"><img src={icon} alt="" /><strong>{title}</strong></div>
        <div className="window-controls">
          <button type="button" aria-label="最小化" title="最小化" onClick={onMinimize}>_</button>
          <button type="button" aria-label={maximized ? '还原' : '最大化'} title={maximized ? '还原' : '最大化'} onClick={onToggleMaximize}>{maximized ? '❐' : '□'}</button>
          <button type="button" className="close-button" aria-label="关闭窗口" title="关闭" onClick={onClose}>×</button>
        </div>
      </header>
      <div className="window-content">{children}</div>
    </section>
  </div>;
}
