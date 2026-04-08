import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsApiKey =
  import.meta.env.VITE_RAPIDAPI_CRYPTONEWS_KEY ||
  import.meta.env.VITE_RAPIDAPI_KEY_CRYPTONEWS ||
  import.meta.env.VITE_RAPIDAPI_KEY;

const cryptoNewsHeaders = {
  'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com',
};

if (cryptoNewsApiKey) {
  cryptoNewsHeaders['x-rapidapi-key'] = cryptoNewsApiKey;
} else {
  console.warn(
    'Missing RapidAPI key for crypto news. Set VITE_RAPIDAPI_CRYPTONEWS_KEY, VITE_RAPIDAPI_KEY_CRYPTONEWS, or VITE_RAPIDAPI_KEY.',
  );
}

const baseUrl = 'https://cryptocurrency-news2.p.rapidapi.com';

const createRequest = (url) => ({
  url,
  headers: cryptoNewsHeaders,
});

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: () => createRequest('/v1/cryptodaily'), // No dynamic query params supported
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
