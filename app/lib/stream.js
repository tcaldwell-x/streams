import fetch from 'node-fetch';

export const getStreams = async () => {
  const url = 'http://localhost:3001/streams';

  const response = await fetch(`${url}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch streams');
  }

  const json = await response.json();
  return json;
};