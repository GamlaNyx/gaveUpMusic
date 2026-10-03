import { useEffect, useState } from 'react';
import type { AlbumViewResult, ChallengeData, ChallengeState } from '../../types';
import { lookupAlbumAddress } from '../../lib/albumLookup';

export function AlbumViewer({ data, state, address, onAddressChange }: {
  data: ChallengeData;
  state: ChallengeState;
  address: string;
  onAddressChange: (address: string) => void;
}) {
  const [input, setInput] = useState(address);
  const [searchedAddress, setSearchedAddress] = useState(address);
  useEffect(() => {
    if (address) {
      setInput(address);
      setSearchedAddress(address);
    }
  }, [address]);

  const result: AlbumViewResult | null = searchedAddress
    ? lookupAlbumAddress(searchedAddress, state, data)
    : null;
  const search = () => {
    setSearchedAddress(input);
    onAddressChange(input);
  };

  return <div className="module-layout album-viewer">
    <div className="module-intro">
      <span className="kicker">ALBUM CONTRACT READER</span>
      <h2>专辑查看器</h2>
      <p>输入专辑合约地址，查看公开信息以及当前账户有权限阅读的歌词。</p>
    </div>
    <form className="album-search" onSubmit={(event) => { event.preventDefault(); search(); }}>
      <label htmlFor="album-address">搜索地址</label>
      <div className="address-form-row"><input id="album-address" value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入专辑合约地址" /><button className="xp-button" type="submit">查询专辑</button></div>
    </form>
    {result?.kind === 'not-found' && <div className="result-empty" role="status"><strong>不存在的合约地址</strong><span>请从浏览器记录或合约函数结果中查找专辑地址。</span></div>}
    {result?.kind === 'album' && <article className="album-record">
      <div className="album-cover"><img src={result.album.cover} alt={`${result.album.name} 专辑封面`} /><span>ALBUM</span><small>Q3 LOCAL STORE</small></div>
      <div className="album-details">
        <span className="album-id">ALBUM #{result.album.id}</span>
        <h3>{result.album.name}</h3>
        <dl>
          <div><dt>艺术家</dt><dd>{result.album.artist}</dd></div>
          <div><dt>专辑 ID</dt><dd>{result.album.id}</dd></div>
          <div><dt>价格</dt><dd>{result.album.price} 余额</dd></div>
          <div><dt>Owner</dt><dd>{state.albumOwners[result.album.id] === data.playerAddress ? '玩家账户' : '部署者账户'}</dd></div>
        </dl>
        <section className="album-lyrics">
          <div className="panel-title"><span>歌词</span><span>{result.showLyrics ? '可读取' : 'Owner 限定'}</span></div>
          {result.showLyrics
            ? <pre>{result.lyrics}</pre>
            : <p className="lyrics-locked">歌词仅对专辑所有者开放。购买后再次打开此专辑即可查看。</p>}
        </section>
      </div>
    </article>}
  </div>;
}
