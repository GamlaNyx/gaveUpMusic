import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('XP desktop shell', () => {
  it('opens and closes application windows from desktop shortcuts', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('region', { name: 'Windows XP 桌面' })).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.dblClick(screen.getByRole('button', { name: '合约查看器' }));
    const dialog = screen.getByRole('dialog', { name: '合约查看器' });
    expect(dialog).toBeTruthy();
    await user.click(within(dialog).getByRole('button', { name: '关闭窗口' }));
    expect(screen.queryByRole('dialog', { name: '合约查看器' })).toBeNull();
  });

  it('opens applications from the start menu and restores them from the taskbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '开始' }));
    const menu = screen.getByRole('menu', { name: '开始菜单' });
    await user.click(within(menu).getByRole('menuitem', { name: '区块链浏览器' }));
    expect(screen.getByRole('dialog', { name: '区块链浏览器' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '最小化' }));
    expect(screen.queryByRole('dialog', { name: '区块链浏览器' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '任务栏：区块链浏览器' }));
    expect(screen.getByRole('dialog', { name: '区块链浏览器' })).toBeTruthy();
  });
});
