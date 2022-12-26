import fetchPostHelper from '../../components/utils/fetchPostHelper';

describe('fetchPostHelper', () => {
  it('should return data if the response does not contain an error', async () => {
    // mock the fetch function to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { foo: 'bar' }, error: null }),
      })
    ) as jest.Mock;

    const result = await fetchPostHelper<{ foo: string }>('endpoint', 'body');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should return undefined if the response contains an error', async () => {
    // mock the fetch function to return a failed response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: {}, error: 'some error' }),
      })
    ) as jest.Mock;

    const result = await fetchPostHelper<{ foo: string }>('endpoint', 'body');
    expect(result).toBeUndefined();
  });
});
