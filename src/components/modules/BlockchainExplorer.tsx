import { useState } from 'react';
import type { ChallengeData, ExplorerResult } from '../../types';
import { lookupExplorerAddress } from '../../lib/explorerLookup';

export function BlockchainExplorer({ data, onOpenAlbum }: { data: ChallengeData; onOpenAlbum: (address: string) => void }) {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<ExplorerResult | null>(null);
  const search = (value = address) => {
    setAddress(value);
    setResult(lookupExplorerAddress(value, data));
  };

  return <div className="module-layout explorer-module">
    <div className="module-intro">
      <span className="kicker">LOCAL CHAIN EXPLORER</span>
      <h2>区块链浏览器</h2>
      <p>搜索合约、账户或交易地址。此页面展示固定的本地模拟记录，不会连接真实网络。</p>
    </div>
    <form className="explorer-search" onSubmit={(event) => { event.preventDefault(); search(); }}>
      <label htmlFor="explorer-address">搜索地址</label>
      <div className="address-form-row"><input id="explorer-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="输入合约 / 地址 / 交易哈希" /><button className="xp-button" type="submit">查询</button></div>
    </form>
    {result && <section className="explorer-result" aria-live="polite">
      {result.kind === 'not-found' && <div className="result-empty"><strong>未识别的地址</strong><span>请确认地址后再搜索。</span></div>}
      {result.kind === 'contract' && <>
        <div className="result-heading"><span>合约</span><strong>AlbumStore</strong></div>
        <div className="result-field"><span>合约地址</span><code>{result.address}</code></div>
        <div className="result-field"><span>部署者</span><code>{result.deployerAddress}</code></div>
        <button className="xp-button" type="button" onClick={() => search(result.deployerAddress)}>查询部署者</button>
      </>}
      {result.kind === 'account' && <>
        <div className="result-heading"><span>账户</span><strong>最近的交易</strong></div>
        <div className="transaction-list">{result.transactions.map((transaction, index) => <article className="transaction-row" key={transaction.address}>
          <div><span>交易 {index + 1} / A{index + 1}</span><code>{transaction.address}</code><small>{transaction.transactionType === 'album-purchase' ? '专辑购买记录' : '未知交易'}</small></div>
          <button className="xp-button" type="button" onClick={() => search(transaction.address)}>查看交易 A{index + 1}</button>
        </article>)}</div>
      </>}
      {result.kind === 'transaction' && <>
        <div className="result-heading"><span>交易记录</span><strong>{result.transactionType === 'album-purchase' ? '专辑购买' : '未知交易'}</strong></div>
        <div className="result-field"><span>交易地址</span><code>{result.address}</code></div>
        {result.albumAddress && <div className="result-field"><span>专辑合约</span><code>{result.albumAddress}</code><button className="xp-button" type="button" onClick={() => onOpenAlbum(result.albumAddress!)}>在专辑查看器打开</button></div>}
        {!result.albumAddress && <p className="result-muted">没有可查看的专辑合约。</p>}
      </>}
    </section>}
  </div>;
}
