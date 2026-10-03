import { describe, expect, it } from 'vitest';
import { challengeData } from '../src/data/challenge';
import { applyChallengeAction, createInitialChallengeState, invokeContractFunction } from '../src/lib/challengeState';

describe('challenge contract state transitions', () => {
  it('credits 50 units for the correct benefit password', () => {
    const initial = createInitialChallengeState(challengeData);
    const result = applyChallengeAction(initial, { type: 'benefit', password: challengeData.benefitPassword }, challengeData);
    expect(result).toMatchObject({ ok: true, state: { balance: 50 } });
  });

  it('does not change state when the benefit password is wrong', () => {
    const initial = createInitialChallengeState(challengeData);
    const result = applyChallengeAction(initial, { type: 'benefit', password: 'wrong password' }, challengeData);
    expect(result.ok).toBe(false);
    expect(result.state).toEqual(initial);
  });

  it('permits two successful benefits to reach the 100-unit purchase price', () => {
    const initial = createInitialChallengeState(challengeData);
    const first = applyChallengeAction(initial, { type: 'benefit', password: challengeData.benefitPassword }, challengeData);
    const second = applyChallengeAction(first.state, { type: 'benefit', password: challengeData.benefitPassword }, challengeData);
    expect(second).toMatchObject({ ok: true, state: { balance: 100 } });
  });

  it('deducts the Flag album price and assigns its owner to the player', () => {
    const funded = { ...createInitialChallengeState(challengeData), balance: 100 };
    const result = applyChallengeAction(funded, { type: 'buy-album', albumId: 3 }, challengeData);
    expect(result).toMatchObject({ ok: true, state: { balance: 0 } });
    expect(result.state.albumOwners[3]).toBe(challengeData.playerAddress);
  });

  it('preserves state after insufficient funds or an unknown album ID', () => {
    const initial = createInitialChallengeState(challengeData);
    expect(applyChallengeAction(initial, { type: 'buy-album', albumId: 3 }, challengeData).state).toEqual(initial);
    expect(applyChallengeAction({ ...initial, balance: 100 }, { type: 'buy-album', albumId: 99 }, challengeData).ok).toBe(false);
  });

  it('returns a clear error for an unknown function identifier', () => {
    const initial = createInitialChallengeState(challengeData);
    const result = invokeContractFunction(initial, 'drainAllFunds', [], challengeData);
    expect(result).toMatchObject({ ok: false, state: initial });
    expect(result.message).toMatch(/unknown|未知|不存在/i);
  });

  it('uses the configured real-looking player and album addresses', () => {
    expect(challengeData.playerAddress).toBe('0xa0Ee7A142d267C1f36714E4a8F75612F20a79720');
    expect(challengeData.albums.M1.address).toBe('0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc');
    expect(challengeData.albums.M2.address).toBe('0x976EA74026E726554dB657fA54763abd0C3a0aa9');
    expect(challengeData.albums.M3.address).toBe('0x14dC79964da2C08b23698B3D3cc7Ca32193d9955');
    expect(challengeData.albums.M4.address).toBe('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f');
    expect(challengeData.contractSource).toMatch(/contract Album\s*\{/);
  });
});
