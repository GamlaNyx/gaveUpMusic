import { describe, expect, it } from 'vitest';
import { challengeData } from '../src/data/challenge';
import { lookupAlbumAddress } from '../src/lib/albumLookup';
import { createInitialChallengeState } from '../src/lib/challengeState';

describe('lookupAlbumAddress', () => {
  it('hides M1 lyrics from a non-owner', () => {
    const result = lookupAlbumAddress(challengeData.albums.M1.address, createInitialChallengeState(challengeData), challengeData);
    expect(result).toMatchObject({ kind: 'album', showLyrics: false });
    if (result.kind === 'album') expect(result.lyrics).toBeUndefined();
  });

  it('shows M3 lyrics after ownership is assigned to the player', () => {
    const state = createInitialChallengeState(challengeData);
    const result = lookupAlbumAddress(challengeData.albums.M3.address, {
      ...state,
      albumOwners: { ...state.albumOwners, 3: challengeData.playerAddress },
    }, challengeData);
    expect(result).toMatchObject({ kind: 'album', showLyrics: true, lyrics: challengeData.albums.M3.lyrics });
  });

  it('always shows M4 title and lyrics publicly', () => {
    const result = lookupAlbumAddress(challengeData.albums.M4.address, createInitialChallengeState(challengeData), challengeData);
    expect(result).toMatchObject({ kind: 'album', showLyrics: true, album: { name: 'Chasing summer again' } });
    if (result.kind === 'album') expect(result.lyrics).toBe(challengeData.albums.M4.lyrics);
  });

  it('returns not-found for an unknown address', () => {
    expect(lookupAlbumAddress('0x0000000000000000000000000000000000000000', createInitialChallengeState(challengeData), challengeData).kind).toBe('not-found');
  });
});
