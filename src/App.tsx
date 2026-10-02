import { useState } from 'react';
import { Desktop, desktopItems } from './components/desktop/Desktop';
import { WindowFrame } from './components/desktop/WindowFrame';
import { PromptFile } from './components/modules/PromptFile';
import { challengeData } from './data/challenge';
import { createInitialChallengeState } from './lib/challengeState';
import type { AppId, ChallengeState } from './types';

const appTitles: Record<AppId, string> = {
  contract: '合约查看器',
  explorer: '区块链浏览器',
  album: '专辑查看器',
  prompt: '题目提示.txt - 记事本',
};

function PlaceholderModule({ appId, state }: { appId: AppId; state: ChallengeState }) {
  if (appId === 'prompt') return <PromptFile />;
  return <div className="module-placeholder">
    <h2>{appTitles[appId]}</h2>
    <p>本地模拟环境已就绪，尚未连接真实区块链。</p>
    <div className="simulation-status"><span>模拟余额</span><strong>{state.balance}</strong></div>
  </div>;
}

export default function App() {
  const [activeWindow, setActiveWindow] = useState<AppId | null>(null);
  const [openWindows, setOpenWindows] = useState<AppId[]>([]);
  const [maximized, setMaximized] = useState(false);
  const [challengeState] = useState(() => createInitialChallengeState(challengeData));

  const openWindow = (id: AppId) => {
    setOpenWindows((current) => current.includes(id) ? current : [...current, id]);
    setActiveWindow(id);
    setMaximized(false);
  };
  const restoreWindow = (id: AppId) => {
    setActiveWindow(id);
    setMaximized(false);
  };
  const minimizeWindow = () => setActiveWindow(null);
  const closeWindow = (id: AppId) => {
    setOpenWindows((current) => current.filter((windowId) => windowId !== id));
    setActiveWindow((current) => current === id ? null : current);
    setMaximized(false);
  };

  return <div className="app-root">
    <Desktop openWindow={openWindow} openWindows={openWindows} activeWindow={activeWindow} onRestore={restoreWindow} onMinimize={minimizeWindow} />
    {activeWindow && <WindowFrame
      title={appTitles[activeWindow]}
      icon={desktopItems.find((item) => item.id === activeWindow)?.icon ?? ''}
      onClose={() => closeWindow(activeWindow)}
      onMinimize={minimizeWindow}
      onToggleMaximize={() => setMaximized((value) => !value)}
      maximized={maximized}
    >
      <PlaceholderModule appId={activeWindow} state={challengeState} />
    </WindowFrame>}
  </div>;
}
