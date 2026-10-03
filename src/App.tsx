import { useState } from 'react';
import { Desktop, desktopItems } from './components/desktop/Desktop';
import { WindowFrame } from './components/desktop/WindowFrame';
import { AlbumViewer } from './components/modules/AlbumViewer';
import { BlockchainExplorer } from './components/modules/BlockchainExplorer';
import { ContractViewer } from './components/modules/ContractViewer';
import { PromptFile } from './components/modules/PromptFile';
import { challengeData } from './data/challenge';
import { applyChallengeAction, createInitialChallengeState } from './lib/challengeState';
import type { AppId, ChallengeState } from './types';

const appTitles: Record<AppId, string> = {
  contract: '合约查看器',
  explorer: '区块链浏览器',
  album: '专辑查看器',
  prompt: '题目提示.txt - 记事本',
};

export default function App() {
  const [activeWindow, setActiveWindow] = useState<AppId | null>(null);
  const [openWindows, setOpenWindows] = useState<AppId[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<AppId | null>(null);
  const [challengeState, setChallengeState] = useState<ChallengeState>(() => createInitialChallengeState(challengeData));
  const [albumAddress, setAlbumAddress] = useState('');

  const openWindow = (id: AppId) => {
    setOpenWindows((current) => current.includes(id) ? current : [...current, id]);
    setActiveWindow(id);
  };
  const restoreWindow = (id: AppId) => setActiveWindow(id);
  const minimizeWindow = () => setActiveWindow(null);
  const closeWindow = (id: AppId) => {
    const remaining = openWindows.filter((windowId) => windowId !== id);
    setOpenWindows(remaining);
    if (activeWindow === id) setActiveWindow(remaining.at(-1) ?? null);
    setMaximizedWindow((current) => current === id ? null : current);
  };
  const callContractFunction = (action: Parameters<typeof applyChallengeAction>[1]) => {
    const result = applyChallengeAction(challengeState, action, challengeData);
    if (result.ok) setChallengeState(result.state);
    return result;
  };
  const viewAlbumAddress = (albumId: number) => Object.values(challengeData.albums).find((album) => album.id === albumId)?.address ?? null;

  return <div className="app-root">
    <Desktop openWindow={openWindow} openWindows={openWindows} activeWindow={activeWindow} onRestore={restoreWindow} onMinimize={minimizeWindow} />
    {openWindows.map((id) => <WindowFrame
      key={id}
      title={appTitles[id]}
      icon={desktopItems.find((item) => item.id === id)?.icon ?? ''}
      active={activeWindow === id}
      onClose={() => closeWindow(id)}
      onMinimize={minimizeWindow}
      onToggleMaximize={() => setMaximizedWindow((current) => current === id ? null : id)}
      maximized={maximizedWindow === id}
    >
      {id === 'prompt' && <PromptFile />}
      {id === 'contract' && <ContractViewer data={challengeData} state={challengeState} onAction={callContractFunction} onViewAlbumsAddress={viewAlbumAddress} />}
      {id === 'explorer' && <BlockchainExplorer data={challengeData} />}
      {id === 'album' && <AlbumViewer data={challengeData} state={challengeState} address={albumAddress} onAddressChange={setAlbumAddress} />}
    </WindowFrame>)}
  </div>;
}
