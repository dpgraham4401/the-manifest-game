import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { Help } from 'components/Help/Help';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import useTreeStore from 'store';
import { notFirstTimeMock } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const handlers = [
  http.get('/help/:helpId.json', async (info) => {
    const helpId = info.params.helpId;
    await delay(500);

    return HttpResponse.json({
      type: 'text',
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      content: `Help Text ${helpId}`,
    });
  }),
  http.get('/help/:helpId.html', (info) => {
    const helpId = info.params.helpId;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return HttpResponse.text(`<p>Help html ${helpId}</p>`);
  }),
];

const TestComponent = ({ helpContent = 'root.json' }: { helpContent?: string }) => {
  useTreeStore.setState({ helpIsOpen: true, contentFilename: helpContent });
  return <Help />;
};

const server = setupServer(...handlers);

afterEach(() => {
  cleanup();
  server.resetHandlers(...handlers);
});
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Help', () => {
  notFirstTimeMock();
  test('renders error message when help content ID is undefined', () => {
    render(<Help />);
    expect(screen.getByText(/problem/i)).toBeInTheDocument();
  });
  test('renders loader while fetching content', () => {
    render(<TestComponent />);
    expect(screen.getByTestId(/helpSpinner/i)).toBeInTheDocument();
  });
  test('renders help content after fetch', async () => {
    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByTestId(/helpSpinner/i)).not.toBeInTheDocument());
    expect(screen.getByText(/Help Text root/i)).toBeInTheDocument();
  });
  test('renders html', async () => {
    const helpContentId = 'root.html';
    render(<TestComponent helpContent={helpContentId} />);
    await waitFor(() => expect(screen.queryByTestId(/helpSpinner/i)).not.toBeInTheDocument());
    expect(screen.getByText(/help html root/i)).toBeInTheDocument();
  });
});
