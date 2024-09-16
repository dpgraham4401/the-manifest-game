import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
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
  test('sets the first node in the array to visible and the rest to hidden', async () => {
    server.use(
      http.get('/default.json', () => {
        delay();
        return HttpResponse.json({
          nodes: [
            { id: '1', type: 'default', label: 'foo', data: { children: [] } },
            { id: '2', type: 'default', label: 'bar', data: { children: [] } },
            { id: '3', type: 'BoolNode', label: 'bool', data: { yesId: '3', noId: '5' } },
          ],
        });
      })
    );
    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByText('data id: 1 - visible')).toBeInTheDocument();
    expect(screen.queryByText('data id: 2 - hidden')).toBeInTheDocument();
    expect(screen.queryByText('data id: 3 - hidden')).toBeInTheDocument();
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
  test('takes boolean node yes and no ID elements and adds them to the children array', async () => {
    server.use(
      http.get('/default.json', () =>
        HttpResponse.json({
          nodes: [
            { id: '1', type: 'BoolNode', label: 'bool', data: { yesId: '2', noId: '3' } },
            { id: '2', label: 'default', data: {} },
            { id: '3', label: 'default', data: {} },
          ],
        })
      )
    );
    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.queryByText('node 1 child 2')).toBeInTheDocument();
    expect(screen.queryByText('node 1 child 3')).toBeInTheDocument();
  });
});
