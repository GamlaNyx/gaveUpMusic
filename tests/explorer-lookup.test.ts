import { describe, expect, it } from 'vitest';
import { challengeData } from '../src/data/challenge';
import { lookupExplorerAddress } from '../src/lib/explorerLookup';

describe('lookupExplorerAddress', () => {
  it('resolves the challenge contract to its deployer', () => {
    expect(challengeData.contractAddress).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(challengeData.deployerAddress).toBe('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    expect(lookupExplorerAddress(challengeData.contractAddress, challengeData)).toEqual({
      kind: 'contract',
      address: challengeData.contractAddress,
      deployerAddress: challengeData.deployerAddress,
    });
  });

  it('accepts a valid address with surrounding whitespace', () => {
    expect(lookupExplorerAddress(`  ${challengeData.contractAddress}  `, challengeData).kind).toBe('contract');
  });

  it('resolves the deployer to three recent transactions in order', () => {
    const result = lookupExplorerAddress(challengeData.deployerAddress, challengeData);
    expect(result.kind).toBe('account');
    if (result.kind !== 'account') return;
    expect(result.transactions.map((transaction) => transaction.address)).toEqual([
      challengeData.transactionAddresses.a1,
      challengeData.transactionAddresses.a2,
      challengeData.transactionAddresses.a3,
    ]);
  });

  it('resolves only A2 to the public M4 album transaction', () => {
    const result = lookupExplorerAddress(challengeData.transactionAddresses.a2.toUpperCase(), challengeData);
    expect(result).toMatchObject({
      kind: 'transaction',
      transactionType: 'album-purchase',
      albumAddress: challengeData.albums.M4.address,
    });
    expect(lookupExplorerAddress(challengeData.transactionAddresses.a1, challengeData)).toMatchObject({ kind: 'transaction', transactionType: 'unknown' });
    expect(lookupExplorerAddress(challengeData.transactionAddresses.a3, challengeData)).toMatchObject({ kind: 'transaction', transactionType: 'unknown' });
  });

  it('returns not-found for unknown and blank addresses', () => {
    expect(lookupExplorerAddress('0x0000000000000000000000000000000000000000', challengeData).kind).toBe('not-found');
    expect(lookupExplorerAddress('   ', challengeData).kind).toBe('not-found');
  });
});
