import { useState } from 'react';
import type { ActionResult, ChallengeAction, ChallengeData } from '../../types';
import { normalizeAddress } from '../../lib/normalizeAddress';

export function ContractViewer({ data, state, onAction, onViewAlbumsAddress }: {
  data: ChallengeData;
  state: { balance: number };
  onAction: (action: ChallengeAction) => ActionResult;
  onViewAlbumsAddress: (albumId: number) => string | null;
}) {
  const [contractInput, setContractInput] = useState('');
  const [recognized, setRecognized] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');
  const [password, setPassword] = useState('');
  const [buyAlbumId, setBuyAlbumId] = useState('');
  const [viewAlbumId, setViewAlbumId] = useState('');
  const [outputs, setOutputs] = useState<string[]>([]);

  const searchContract = () => {
    const valid = normalizeAddress(contractInput) === normalizeAddress(data.contractAddress);
    setRecognized(valid);
    setAddressMessage(valid ? '合约已识别。' : '不存在的合约地址。');
    setOutputs([]);
  };
  const call = (action: ChallengeAction) => {
    const result = onAction(action);
    setOutputs((previous) => [...previous, result.message]);
  };
  const showTip = (tip: string) => setOutputs((previous) => [...previous, tip]);
  const queryAlbumAddress = () => {
    const address = onViewAlbumsAddress(Number(viewAlbumId));
    setOutputs((previous) => [...previous, address ?? '不存在这个专辑 ID。']);
  };

  return <div className="module-layout contract-viewer">
    <div className="module-intro">
      <span className="kicker">SOLIDITY / LOCAL SIMULATION</span>
      <h2>AlbumStore 合约</h2>
      <p>这是本地模拟合约。选择要查看的合约地址，再按函数提示进行交互。</p>
    </div>
    <form className="address-form" onSubmit={(event) => { event.preventDefault(); searchContract(); }}>
      <label htmlFor="contract-address">合约地址</label>
      <div className="address-form-row"><input id="contract-address" value={contractInput} onChange={(event) => setContractInput(event.target.value)} placeholder="输入合约地址" /><button className="xp-button" type="submit">查询合约</button></div>
      {addressMessage && <p className={recognized ? 'inline-success' : 'inline-error'} role="status">{addressMessage}</p>}
    </form>
    {recognized && <>
      <div className="contract-status"><span>模拟账户余额</span><strong>模拟余额：{state.balance}</strong></div>
      <section className="contract-source-panel" aria-label="合约源代码">
        <div className="panel-title"><span>AlbumStore.sol</span><span>Solidity</span></div>
        <pre><code>{data.contractSource}</code></pre>
      </section>
      <div className="contract-functions">
        <section className="function-card">
          <div className="function-heading"><code>viewTip1()</code><span>查看部署者提示</span></div>
          <button className="xp-button" type="button" onClick={() => showTip(data.tips.tip1)}>查看 tip1</button>
        </section>
        <section className="function-card">
          <div className="function-heading"><code>viewTip2()</code><span>查看最近动态提示</span></div>
          <button className="xp-button" type="button" onClick={() => showTip(data.tips.tip2)}>查看 tip2</button>
        </section>
        <section className="function-card">
          <div className="function-heading"><code>benefit(password)</code><span>调用福利函数</span></div>
          <label htmlFor="benefit-password">benefit 密码</label>
          <div className="address-form-row"><input id="benefit-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="输入密码" /><button className="xp-button" type="button" onClick={() => call({ type: 'benefit', password })}>调用 benefit</button></div>
        </section>
        <section className="function-card">
          <div className="function-heading"><code>buyAlbum(id)</code><span>购买一张专辑</span></div>
          <label htmlFor="buy-album-id">buyAlbum 专辑 ID</label>
          <div className="address-form-row"><input id="buy-album-id" inputMode="numeric" value={buyAlbumId} onChange={(event) => setBuyAlbumId(event.target.value)} /><button className="xp-button" type="button" onClick={() => call({ type: 'buy-album', albumId: Number(buyAlbumId) })}>购买专辑</button></div>
        </section>
        <section className="function-card">
          <div className="function-heading"><code>viewAlbumsAddress(id)</code><span>查询专辑合约地址</span></div>
          <label htmlFor="view-album-id">专辑 ID</label>
          <div className="address-form-row"><input id="view-album-id" inputMode="numeric" value={viewAlbumId} onChange={(event) => setViewAlbumId(event.target.value)} /><button className="xp-button" type="button" onClick={queryAlbumAddress}>查询专辑地址</button></div>
        </section>
      </div>
      {outputs.length > 0 && <section className="contract-output" aria-label="函数返回结果" aria-live="polite">
        <div className="panel-title"><span>控制台输出</span><button className="text-button" type="button" onClick={() => setOutputs([])}>清空</button></div>
        {outputs.map((output, index) => <p key={`${index}-${output}`}><code>&gt;</code> {output}</p>)}
      </section>}
    </>}
  </div>;
}
