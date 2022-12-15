const fetchPostHelper = async <T>(
  apiEndpoint: string,
  body: string
): Promise<T | undefined> => {
  const resMetadata = await fetch(`/api/${apiEndpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: body,
  });

  const {
    data,
    error,
  }: {
    data: T;
    error: string | null;
  } = await resMetadata.json();

  if (error) {
    return undefined;
  }

  return data;
};

export default fetchPostHelper;
