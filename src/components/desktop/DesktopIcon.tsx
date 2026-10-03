import type { AppId } from '../../types';

export type DesktopItem = {
  id: AppId;
  label: string;
  icon: string;
};

export function DesktopIcon({ item, selected, onSelect, onOpen }: {
  item: DesktopItem;
  selected: boolean;
  onSelect: () => void;
  onOpen: (id: AppId) => void;
}) {
  return <button
    className={`xp-icon ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onSelect}
    onDoubleClick={() => onOpen(item.id)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen(item.id);
      }
    }}
    title={`双击打开 ${item.label}`}
  >
    <span className="xp-icon-image"><img src={item.icon} alt="" /></span>
    <span className="xp-icon-label">{item.label}</span>
  </button>;
}
