import type { AppId } from '../../types';
import type { DesktopItem } from './DesktopIcon';

export function Taskbar({ items, openWindows, activeWindow, onStart, onRestore, onMinimize }: {
  items: DesktopItem[];
  openWindows: AppId[];
  activeWindow: AppId | null;
  onStart: () => void;
  onRestore: (id: AppId) => void;
  onMinimize: () => void;
}) {
  return <footer className="xp-taskbar">
    <button className="xp-start" type="button" aria-label="开始" onClick={onStart}>
      <img src={items.find((item) => item.id === 'prompt')?.icon} alt="" /><strong>开始</strong>
    </button>
    <div className="quick-launch"><button type="button" aria-label="显示桌面" onClick={onMinimize}>▣</button></div>
    <div className="taskbar-tasks">
      {openWindows.map((id) => {
        const item = items.find((entry) => entry.id === id);
        if (!item) return null;
        return <button className={activeWindow === id ? 'task-active' : ''} type="button" key={id} aria-label={`任务栏：${item.label}`} aria-pressed={activeWindow === id} onClick={() => onRestore(id)}>
          <img src={item.icon} alt="" />{item.label}
        </button>;
      })}
    </div>
    <div className="system-tray" aria-label="系统托盘"><span>音量</span><span>网络</span><time>09:42</time></div>
  </footer>;
}
