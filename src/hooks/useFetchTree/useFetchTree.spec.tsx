import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { useFetchTree } from './useFetchTree';

const handlers = [
  http.get('/default.json', () => {
    return HttpResponse.json({
      nodes: [
        {
          id: '1',
          type: 'default',
          label: 'foo',
          data: { children: [] },
        },
      ],
    });
  }),
];

const server = setupServer(...handlers);

afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

const TestComponent = () => {
  const { config, error, isLoading } = useFetchTree('/default.json');
  return (
    <>
      {isLoading && <p>loading...</p>}
      {error && <p>error</p>}
      {config && <p>data</p>}
      <ul>
        {config
          ? Object.values(config).map((item) => (
              <li key={item.id}>
                {`data id: ${item.id} - ${item.hidden ? 'hidden' : 'visible'}`}
                {/*List the children on the node*/}
                <ul>
                  {item.data.children &&
                    item.data.children.map((child, index) => (
                      <li key={index}>{`node ${item.id} child ${child}`}</li>
                    ))}
                </ul>
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

describe('useFetchTree', () => {
  test('initially isLoading, error, and data are undefined', () => {
    render(<TestComponent />);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/data/i)).not.toBeInTheDocument();
  });

  test('parses the config into a DecisionTree', async () => {
    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByText(/data id: 1/i)).toBeInTheDocument();
  });

  test('sets an error if the config fails to parse', async () => {
    server.use(
      http.get('/default.json', () => {
        return HttpResponse.json({ foo: 'bar' });
      })
    );
    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByText('error')).toBeInTheDocument();
  });
});
