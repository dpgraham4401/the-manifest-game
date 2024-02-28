import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { ErrorMsg } from 'components/Error/ErrorMsg';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  vi.stubEnv('VITE_ISSUE_URL', 'https://example.com/issues/new');
});
beforeEach(() => {
  vi.unstubAllEnvs();
});
afterEach(() => {
  cleanup();
});

describe('ErrorMsg', () => {
  it('renders', () => {
    render(<ErrorMsg />);
    expect(screen.getByText(/An Error occurred/i)).toBeInTheDocument();
  });
  it('provides a configurable link to file a ticket', () => {
    const issueUrl = 'https://example.com/issues/new';
    vi.stubEnv('VITE_ISSUE_URL', issueUrl);
    render(<ErrorMsg />);
    const issueLink = screen.getByRole('link', { name: 'file a ticket' });
    expect(issueLink).toBeInTheDocument();
    expect(issueLink).toHaveAccessibleName('file a ticket');
    expect(issueLink).toHaveAttribute('href', issueUrl);
  });
  it('Does not render a link if environment variable is not defined', () => {
    render(<ErrorMsg />);
    const issueLink = screen.queryByRole('link', { name: 'file a ticket' });
    expect(issueLink).not.toBeInTheDocument();
  });
  it('renders an error message if one if passed', () => {
    const message = 'alright meow, license and registration';
    render(<ErrorMsg message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
