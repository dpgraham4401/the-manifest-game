import { describe, expect, it } from 'vitest';
import { JsonTree, parseJsonTree } from './parse';

describe('parseJsonTree', () => {
  const createTestTree = (): JsonTree => ({
    name: 'Test Tree',
    nodes: [
      // @ts-expect-error - ok for test dummy data
      { id: '1', type: 'BoolNode', data: { yesId: '2', noId: '3' } },
      // @ts-expect-error - ok for test dummy data
      { id: '2', type: 'default', data: { info: 'Info 2' } },
      // @ts-expect-error - ok for test dummy data
      { id: '3', type: 'default', data: { info: 'Info 3' } },
    ],
  });

  it('parses a valid JsonTree with BooleanNodeData and DefaultNodeData', () => {
    const jsonTree = createTestTree();
    const result = parseJsonTree(jsonTree);
    expect(result).toEqual({
      '1': {
        id: '1',
        data: { yesId: '2', noId: '3', children: ['2', '3'] },
        type: 'BoolNode',
        hidden: false,
      },
      '2': { id: '2', data: { info: 'Info 2' }, type: 'default', hidden: true },
      '3': { id: '3', data: { info: 'Info 3' }, type: 'default', hidden: true },
    });
  });

  it('throws an error when nodes are undefined', () => {
    const jsonTree: JsonTree = { name: 'Test Tree' };
    expect(() => parseJsonTree(jsonTree)).toThrow('Error construction decision tree');
  });

  it('throws an error when nodes are empty', () => {
    const jsonTree: JsonTree = { name: 'Test Tree', nodes: [] };
    expect(() => parseJsonTree(jsonTree)).toThrow('Error construction decision tree');
  });

  it('takes boolean node yes and no ID elements and adds them to the children array', () => {
    const jsonTree = createTestTree();
    const result = parseJsonTree(jsonTree);
    expect(result['1'].data.children).toEqual(['2', '3']);
  });

  it('sets the first node in the array to visible and the rest to hidden', () => {
    const jsonTree = createTestTree();
    const result = parseJsonTree(jsonTree);
    expect(result['1'].hidden).toBe(false);
    expect(result['2'].hidden).toBe(true);
    expect(result['3'].hidden).toBe(true);
  });
});
