import type { ChallengeData, ExplorerResult, SimulatedTransaction } from '../types';
import { normalizeAddress } from './normalizeAddress';

export function lookupExplorerAddress(value: string, data: ChallengeData): ExplorerResult {
  const address = normalizeAddress(value);
  if (address === normalizeAddress(data.contractAddress)) {
    return { kind: 'contract', address: data.contractAddress, deployerAddress: data.deployerAddress };
  }
  if (address === normalizeAddress(data.deployerAddress)) {
    const transactions: SimulatedTransaction[] = [
      { address: data.transactionAddresses.a1, transactionType: 'unknown' },
      { address: data.transactionAddresses.a2, transactionType: 'album-purchase', albumAddress: data.albums.M4.address },
      { address: data.transactionAddresses.a3, transactionType: 'unknown' },
    ];
    return { kind: 'account', address: data.deployerAddress, transactions };
  }

  const tx = Object.entries(data.transactionAddresses).find(([, txAddress]) => normalizeAddress(txAddress) === address);
  if (tx) {
    const isAlbumPurchase = tx[0] === 'a2';
    return isAlbumPurchase
      ? { kind: 'transaction', address: tx[1], transactionType: 'album-purchase', albumAddress: data.albums.M4.address }
      : { kind: 'transaction', address: tx[1], transactionType: 'unknown' };
  }
  return { kind: 'not-found', address };
}
