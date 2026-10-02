import type { AppId } from '../../types';
import type { DesktopItem } from './DesktopIcon';

export function StartMenu({ open, items, onOpen }: {
  open: boolean;
  items: DesktopItem[];
  onOpen: (id: AppId) => void;
}) {
  if (!open) return null;

  return <div className="xp-start-menu" role="menu" aria-label="开始菜单">
    <div className="start-user"><span className="user-avatar">音</span><strong>FCG Album Studio</strong></div>
    <div className="start-columns">
      <div>{items.map((item) => <button role="menuitem" type="button" key={item.id} onClick={() => onOpen(item.id)}>
        <img src={item.icon} alt="" />{item.label}
      </button>)}</div>
      <div className="start-right"><strong>所以我放弃了音乐</strong><span>专辑商店 · 本地模拟</span></div>
    </div>
    <div className="start-footer"><span>所有程序</span><span>关闭计算机</span></div>
  </div>;
}
