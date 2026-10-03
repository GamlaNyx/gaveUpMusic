import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('has GitHub Pages configuration for the gaveUpMusic repository', () => {
  const root = process.cwd();
  const viteConfig = readFileSync(resolve(root, 'vite.config.ts'), 'utf8');
  const workflow = readFileSync(resolve(root, '.github/workflows/deploy-pages.yml'), 'utf8');
  expect(viteConfig).toMatch(/base:\s*process\.env\.GITHUB_ACTIONS\s*\?\s*['"]\/gaveUpMusic\/['"]\s*:\s*['"]\/['"]/);
  expect(workflow).toMatch(/actions\/deploy-pages@v4/);
  expect(workflow).toMatch(/path:\s*\.\/dist/);
});
