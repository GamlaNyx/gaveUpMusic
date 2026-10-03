import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { challengeData } from '../src/data/challenge';

async function openApp(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.dblClick(screen.getByRole('button', { name: label }));
  return screen.getByRole('dialog', { name: label });
}

describe('album-store challenge flow', () => {
  it('follows the simulated chain and reveals the purchased Flag album lyrics', async () => {
    const user = userEvent.setup();
    render(<App />);

    let contract = await openApp(user, '合约查看器');
    await user.type(within(contract).getByLabelText('合约地址'), challengeData.contractAddress);
    await user.click(within(contract).getByRole('button', { name: '查询合约' }));
    expect(within(contract).getByLabelText('合约源代码').querySelector('.token-keyword')).toBeTruthy();
    expect(within(contract).getByLabelText('合约源代码').textContent).toMatch(/contract Album/);
    await user.click(within(contract).getByRole('button', { name: '查看 tip1' }));
    await user.click(within(contract).getByRole('button', { name: '查看 tip2' }));
    expect(within(contract).getByText(/用专辑名作为 password/)).toBeTruthy();
    expect(within(contract).getByText(/最近好像花大价钱/)).toBeTruthy();

    let explorer = await openApp(user, '区块链浏览器');
    let search = within(explorer).getByLabelText('搜索地址');
    await user.clear(search);
    await user.type(search, challengeData.contractAddress);
    await user.click(within(explorer).getByRole('button', { name: '查询' }));
    await user.click(within(explorer).getByRole('button', { name: '查询部署者' }));
    await user.click(within(explorer).getByRole('button', { name: '查看交易 A2' }));
    await user.click(within(explorer).getByRole('button', { name: '在专辑查看器打开' }));

    const album = screen.getByRole('dialog', { name: '专辑查看器' });
    expect(within(album).getByText('Chasing summer again')).toBeTruthy();
    expect(within(album).getByText(/One song brings the summer back/)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '任务栏：合约查看器' }));
    contract = screen.getByRole('dialog', { name: '合约查看器' });
    const password = within(contract).getByLabelText('benefit 密码');
    await user.clear(password);
    await user.type(password, 'Chasing summer again');
    await user.click(within(contract).getByRole('button', { name: '调用 benefit' }));
    await user.click(within(contract).getByRole('button', { name: '调用 benefit' }));
    expect(within(contract).getByText('余额：100')).toBeTruthy();

    await user.click(within(contract).getByRole('button', { name: '关闭窗口' }));
    contract = await openApp(user, '合约查看器');
    await user.type(within(contract).getByLabelText('合约地址'), challengeData.contractAddress);
    await user.click(within(contract).getByRole('button', { name: '查询合约' }));
    expect(within(contract).getByText('余额：100')).toBeTruthy();

    await user.type(within(contract).getByLabelText('buyAlbum 专辑 ID'), '3');
    await user.click(within(contract).getByRole('button', { name: '购买专辑' }));
    expect(within(contract).getByText(/Flag 已购买/)).toBeTruthy();

    const albumAddress = challengeData.albums.M3.address;
    await user.dblClick(screen.getByRole('button', { name: '专辑查看器' }));
    const openAlbum = screen.getByRole('dialog', { name: '专辑查看器' });
    const albumSearch = within(openAlbum).getByLabelText('搜索地址');
    await user.clear(albumSearch);
    await user.type(albumSearch, albumAddress);
    await user.click(within(openAlbum).getByRole('button', { name: '查询专辑' }));
    expect(within(openAlbum).getByText('DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}')).toBeTruthy();
  });

  it('renders the prompt as real lines and exposes the configured contract address', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.dblClick(screen.getByRole('button', { name: '题目提示.txt' }));
    const prompt = screen.getByRole('dialog', { name: '题目提示.txt - 记事本' });
    expect(within(prompt).getByText(/题目合约地址：0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/)).toBeTruthy();
    expect(within(prompt).getByText(/查看合约、浏览交易记录，再打开专辑看看。/)).toBeTruthy();
    expect(within(prompt).getByText(/所以我放弃了音乐：唱片商店留下了几条线索。/)).toBeTruthy();
  });

  it('does not grant balance or expose owner-only lyrics after failed calls', async () => {
    const user = userEvent.setup();
    render(<App />);
    const contract = await openApp(user, '合约查看器');
    await user.type(within(contract).getByLabelText('合约地址'), challengeData.contractAddress);
    await user.click(within(contract).getByRole('button', { name: '查询合约' }));
    await user.type(within(contract).getByLabelText('benefit 密码'), 'wrong password');
    await user.click(within(contract).getByRole('button', { name: '调用 benefit' }));
    expect(within(contract).getByText('余额：0')).toBeTruthy();

    await user.dblClick(screen.getByRole('button', { name: '专辑查看器' }));
    const album = screen.getByRole('dialog', { name: '专辑查看器' });
    await user.type(within(album).getByLabelText('搜索地址'), challengeData.albums.M3.address);
    await user.click(within(album).getByRole('button', { name: '查询专辑' }));
    expect(within(album).queryByText('DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}')).toBeNull();
    expect(within(album).getByText(/歌词仅对专辑所有者开放/)).toBeTruthy();
  });
});
