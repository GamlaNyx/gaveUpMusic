export type AlbumId = 1 | 2 | 3 | 'M4';
export type AlbumKey = 'M1' | 'M2' | 'M3' | 'M4';
export type AppId = 'contract' | 'explorer' | 'album' | 'prompt';

export type Album = {
  address: string;
  id: AlbumId;
  name: string;
  artist: string;
  price: number;
  initialOwner: string;
  lyrics: string;
};

export type SimulatedTransaction = {
  address: string;
  transactionType: 'album-purchase' | 'unknown';
  albumAddress?: string;
};

export type ChallengeData = {
  contractAddress: string;
  deployerAddress: string;
  transactionAddresses: { a1: string; a2: string; a3: string };
  albums: Record<AlbumKey, Album>;
  tips: { tip1: string; tip2: string };
  benefitPassword: string;
  benefitAward: number;
  benefitMaxBalance: number;
  playerAddress: string;
  contractSource: string;
};

export type ChallengeState = {
  balance: number;
  albumOwners: Record<number | 'M4', string>;
};

export type ChallengeAction =
  | { type: 'benefit'; password: string }
  | { type: 'buy-album'; albumId: number };

export type ActionResult = {
  state: ChallengeState;
  ok: boolean;
  message: string;
  value?: string | number;
};

export type ExplorerResult =
  | { kind: 'contract'; address: string; deployerAddress: string }
  | { kind: 'account'; address: string; transactions: SimulatedTransaction[] }
  | { kind: 'transaction'; address: string; transactionType: 'album-purchase' | 'unknown'; albumAddress?: string }
  | { kind: 'not-found'; address: string };

export type AlbumViewResult =
  | { kind: 'album'; album: Album; showLyrics: boolean; lyrics?: string }
  | { kind: 'not-found'; address: string };
