import { useState } from 'react';
import type { AppId } from '../../types';
import { assetUrl } from '../../lib/assets';
import { DesktopIcon, type DesktopItem } from './DesktopIcon';
import { StartMenu } from './StartMenu';
import { Taskbar } from './Taskbar';

const iconRoot = assetUrl('imgs/图标');
export const desktopItems: DesktopItem[] = [
  { id: 'contract', label: '合约查看器', icon: `${iconRoot}/解密终端.png` },
  { id: 'explorer', label: '区块链浏览器', icon: `${iconRoot}/Internet Explorer.png` },
  { id: 'album', label: '专辑查看器', icon: `${iconRoot}/游戏中心.png` },
  { id: 'prompt', label: '题目提示.txt', icon: `${iconRoot}/题目提示.png` },
];

export function Desktop({ openWindow, openWindows, activeWindow, onRestore, onMinimize }: {
  openWindow: (id: AppId) => void;
  openWindows: AppId[];
  activeWindow: AppId | null;
  onRestore: (id: AppId) => void;
  onMinimize: () => void;
}) {
  const [startOpen, setStartOpen] = useState(false);
  const [selected, setSelected] = useState<AppId | null>(null);
  const showWindow = (id: AppId) => {
    setStartOpen(false);
    openWindow(id);
  };

  return <main className="xp-desktop" style={{ backgroundImage: `url("${assetUrl('imgs/壁纸.jpeg')}")` }} onContextMenu={(event) => event.preventDefault()}>
    <section className="xp-desktop-icons" aria-label="Windows XP 桌面">
      {desktopItems.map((item) => <DesktopIcon key={item.id} item={item} selected={selected === item.id} onSelect={() => setSelected(item.id)} onOpen={showWindow} />)}
    </section>
    <div className="xp-desktop-note"><strong>所以我放弃了音乐</strong><span>模拟唱片商店 · 无链上交易</span></div>
    <StartMenu open={startOpen} items={desktopItems} onOpen={showWindow} />
    <Taskbar items={desktopItems} openWindows={openWindows} activeWindow={activeWindow} onStart={() => setStartOpen((value) => !value)} onRestore={onRestore} onMinimize={onMinimize} />
  </main>;
}
