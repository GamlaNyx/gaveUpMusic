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
});
