import fetch from 'node-fetch';

export const getRules = async () => {
  const url = 'https://api.twitter.com/2/tweets/search/stream/rules';

  const response = await fetch(`${url}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch rules');
  }

  const json = await response.json();
  return json.data ? json.data : [];
};

export const addRule = async (ruleValue, ruleTag) => {
  const url = 'https://api.twitter.com/2/tweets/search/stream/rules';

  const requestBody = {
    add: [
      { value: ruleValue, tag: ruleTag }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Failed to add rule: ${response.statusText}`);
  }

  const json = await response.json();
  return json;
};

export const deleteRule = async (ruleIds) => {
    const url = 'https://api.twitter.com/2/tweets/search/stream/rules';
  
    const requestBody = {
      delete: {
        ids: ruleIds
      }
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete rule: ${response.statusText}`);
    }
  
    const json = await response.json();
    return json;
  };