import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const addresses = {
  contract: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  flagAlbum: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
};

async function openDesktopApp(page: Page, label: string) {
  if (await page.locator('.window-layer.is-active').count()) {
    await page.getByRole('button', { name: '开始' }).click();
    await page.getByRole('menuitem', { name: label }).click();
  } else {
    await page.getByRole('button', { name: label }).dblclick();
  }
  return page.getByRole('dialog', { name: label });
}

test('players follow explorer records, purchase the Flag album, and reveal lyrics', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Windows XP 桌面' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('desktop-home.png') });

  let contract = await openDesktopApp(page, '合约查看器');
  await contract.getByLabel('合约地址').fill(addresses.contract);
  await contract.getByRole('button', { name: '查询合约' }).click();
  await contract.getByRole('button', { name: '查看 tip1' }).click();
  await contract.getByRole('button', { name: '查看 tip2' }).click();
  await expect(contract.getByText(/用专辑名作为 password/)).toBeVisible();
  await expect(contract.getByText(/最近好像花大价钱/)).toBeVisible();

  const explorer = await openDesktopApp(page, '区块链浏览器');
  const search = explorer.getByLabel('搜索地址');
  await search.fill(addresses.contract);
  await explorer.getByRole('button', { name: '查询', exact: true }).click();
  await explorer.getByRole('button', { name: '查询部署者' }).click();
  await explorer.getByRole('button', { name: '查看交易 A2' }).click();
  await expect(explorer.getByRole('button', { name: '在专辑查看器打开' })).toHaveCount(0);
  await page.getByRole('button', { name: '开始' }).click();
  await page.getByRole('menuitem', { name: '专辑查看器' }).click();
  const album = page.getByRole('dialog', { name: '专辑查看器' });
  await album.getByLabel('搜索地址').fill('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f');
  await album.getByRole('button', { name: '查询专辑' }).click();
  await expect(album.getByRole('heading', { name: 'Chasing summer again' })).toBeVisible();
  await expect(album.getByText(/One song brings the summer back/)).toBeVisible();

  await page.getByRole('button', { name: '任务栏：合约查看器' }).click();
  contract = page.getByRole('dialog', { name: '合约查看器' });
  const password = contract.getByLabel('benefit 密码');
  await password.fill('Chasing summer again');
  await contract.getByRole('button', { name: '调用 benefit' }).click();
  await contract.getByRole('button', { name: '调用 benefit' }).click();
  await expect(contract.getByText('余额：100')).toBeVisible();
  await contract.getByLabel('buyAlbum 专辑 ID').fill('3');
  await contract.getByRole('button', { name: '购买专辑' }).click();
  await expect(contract.getByText(/Flag 已购买/)).toBeVisible();

  await page.getByRole('button', { name: '任务栏：专辑查看器' }).click();
  const flagAlbum = page.getByRole('dialog', { name: '专辑查看器' });
  await flagAlbum.getByLabel('搜索地址').fill(addresses.flagAlbum);
  await flagAlbum.getByRole('button', { name: '查询专辑' }).click();
  await expect(flagAlbum.getByText('DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('application windows fit and scroll on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Windows XP 桌面' })).toBeVisible();

  for (const label of ['合约查看器', '区块链浏览器', '专辑查看器']) {
    const dialog = await openDesktopApp(page, label);
    const bounds = await dialog.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await dialog.getByRole('button', { name: '关闭窗口' }).click();
  }

  await page.getByRole('button', { name: '合约查看器' }).dblclick();
  const contract = page.getByRole('dialog', { name: '合约查看器' });
  await contract.getByLabel('合约地址').fill(addresses.contract);
  await contract.getByRole('button', { name: '查询合约' }).click();
  await page.screenshot({ path: test.info().outputPath('mobile-contract-window.png') });
  const scrollable = await contract.getByLabel('合约源代码').locator('pre').evaluate((element) => {
    const style = getComputedStyle(element);
    return style.overflowY === 'auto' && element.scrollHeight > element.clientHeight;
  });
  expect(scrollable).toBe(true);
  const closeButton = contract.getByRole('button', { name: '关闭窗口' });
  await closeButton.focus();
  await expect(closeButton).toBeFocused();
});

test('keyboard users can open desktop shortcuts and load local art assets', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const contractShortcut = page.getByRole('button', { name: '合约查看器' });
  await contractShortcut.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: '合约查看器' })).toBeVisible();

  for (const resource of [
    '/imgs/壁纸.jpeg',
    '/imgs/图标/Internet Explorer.png',
    '/imgs/记忆配对/blender.png',
  ]) {
    const response = await request.get(resource);
    expect(response.status()).toBe(200);
  }
});
