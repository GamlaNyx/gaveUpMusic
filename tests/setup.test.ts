import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import App from '../src/App';

it('has an application entry for the XP desktop', () => {
  render(createElement(App));
  expect(screen.getByRole('region', { name: 'Windows XP 桌面' })).toBeTruthy();
});
