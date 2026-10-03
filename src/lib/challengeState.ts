import type { ActionResult, AlbumKey, ChallengeAction, ChallengeData, ChallengeState } from '../types';

export function createInitialChallengeState(data: ChallengeData): ChallengeState {
  const albumOwners = Object.fromEntries(
    Object.values(data.albums).map((album) => [album.id, album.initialOwner]),
  ) as ChallengeState['albumOwners'];
  return { balance: 0, albumOwners };
}

function failed(state: ChallengeState, message: string): ActionResult {
  return { state, ok: false, message };
}

export function applyChallengeAction(state: ChallengeState, action: ChallengeAction, data: ChallengeData): ActionResult {
  if (action.type === 'benefit') {
    if (action.password !== data.benefitPassword) return failed(state, '密码不正确。');
    if (state.balance > data.benefitMaxBalance) return failed(state, '当前余额已超过福利领取上限。');
    return {
      state: { ...state, balance: state.balance + data.benefitAward },
      ok: true,
      message: `福利到账 ${data.benefitAward} 模拟余额。`,
      value: state.balance + data.benefitAward,
    };
  }

  const albumEntry = (Object.keys(data.albums) as AlbumKey[])
    .map((key) => data.albums[key])
    .find((album) => album.id === action.albumId);
  if (!albumEntry) return failed(state, '不存在这个专辑 ID。');
  if (state.balance < albumEntry.price) return failed(state, '模拟余额不足，无法购买这张专辑。');
  return {
    state: {
      balance: state.balance - albumEntry.price,
      albumOwners: { ...state.albumOwners, [albumEntry.id]: data.playerAddress },
    },
    ok: true,
    message: `${albumEntry.name} 已购买，owner 已更新为玩家。`,
    value: albumEntry.address,
  };
}

export function invokeContractFunction(state: ChallengeState, functionId: string, args: unknown[], data: ChallengeData): ActionResult {
  switch (functionId) {
    case 'viewTip1':
      return { state, ok: true, message: data.tips.tip1, value: data.tips.tip1 };
    case 'viewTip2':
      return { state, ok: true, message: data.tips.tip2, value: data.tips.tip2 };
    case 'benefit':
      return applyChallengeAction(state, { type: 'benefit', password: String(args[0] ?? '') }, data);
    case 'buyAlbum':
      return applyChallengeAction(state, { type: 'buy-album', albumId: Number(args[0]) }, data);
    case 'viewAlbumsAddress': {
      const id = Number(args[0]);
      const album = Object.values(data.albums).find((entry) => entry.id === id);
      return album
        ? { state, ok: true, message: album.address, value: album.address }
        : failed(state, '不存在这个专辑 ID。');
    }
    default:
      return failed(state, `未知函数 ID：${functionId}`);
  }
}
