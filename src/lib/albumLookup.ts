import type { AlbumViewResult, ChallengeData, ChallengeState } from '../types';
import { normalizeAddress } from './normalizeAddress';

export function lookupAlbumAddress(addressValue: string, state: ChallengeState, data: ChallengeData): AlbumViewResult {
  const address = normalizeAddress(addressValue);
  const entry = Object.values(data.albums).find((album) => normalizeAddress(album.address) === address);
  if (!entry) return { kind: 'not-found', address };

  const isPublicAlbum = entry.id === 'M4';
  const showLyrics = isPublicAlbum || state.albumOwners[entry.id] === data.playerAddress;
  return {
    kind: 'album',
    album: entry,
    showLyrics,
    ...(showLyrics ? { lyrics: entry.lyrics } : {}),
  };
}
