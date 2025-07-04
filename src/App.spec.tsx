import '@testing-library/jest-dom';
import App from '@/App';
import { useUrl } from '@/hooks';
import { useTreeStore } from '@/store';
import { notFirstTimeMock, renderWithProviders } from '@/test-utils';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const TestComponent = () => {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
};

const handlers = [
  http.get('/default.json', () => {
    return HttpResponse.json({
      nodes: [
        {
          id: '1',
          type: 'default',
          data: {
            label: 'I like turtles',
            children: ['2'],
          },
        },
      ],
    });
  }),
];

const server = setupServer(...handlers);

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
beforeAll(() => server.listen());
afterAll(() => {
  server.close();
  server.resetHandlers();
});

describe('App', () => {
  notFirstTimeMock();
  vi.mock('@/hooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/hooks')>()),
    useUrl: vi.fn().mockReturnValue({ pathParam: 'test', setTreeParam: vi.fn() }),
  }));

  test('shows a spinner while waiting for config', () => {
    server.use(
      http.get('/default.json', async () => {
        await delay(100);
        return HttpResponse.json({
          nodes: [
            {
              id: '1',
              type: 'default',
              data: {
                label: 'I like turtles',
                children: ['2'],
              },
            },
          ],
        });
      })
    );
    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders a title if provided', async () => {
    const title = 'Zee bananas';
    vi.stubEnv('VITE_APP_TITLE', title);
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test('defaults title to "The Manifest Game"', async () => {
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(screen.getByText('The Manifest Game')).toBeInTheDocument();
  });

  test('minimap is visible by default', async () => {
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(screen.getByTestId(/minimap/i)).toBeInTheDocument();
  });

  test('Throws an error if there is an error fetching the config', async () => {
    server.use(http.get('/default.json', () => HttpResponse.error()));
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  test('the help content is closed onClicking the close button', async () => {
    const user = userEvent.setup();
    useTreeStore.setState({ helpIsOpen: true });
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(screen.getByTestId('offcanvas')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(screen.getByTestId('offcanvas')).not.toBeVisible();
  });

  test('application sets the tree query parameter if not set', async () => {
    const setTreeParam = vi.fn();
    // @ts-expect-error - only mocking necessary hook returned objects
    vi.mocked(useUrl).mockReturnValue({ pathParam: 'test', setTreeParam });
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    expect(setTreeParam).toHaveBeenCalledWith('0');
  });
});
