import { API_URI } from './constants';

export default async function easyFetch(path, data = {}, method = 'POST') {
  try {
    const response = await fetch(API_URI + path, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method,
      body: method !== 'GET' ? JSON.stringify(data) : null,
    });
    const fetchedData = await response.json();
    return fetchedData;
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}
