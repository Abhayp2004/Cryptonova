import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsApiKey = import.meta.env.VITE_RAPIDAPI_CRYPTONEWS_KEY;

if (!cryptoNewsApiKey) {
  throw new Error('Missing required environment variable: VITE_RAPIDAPI_CRYPTONEWS_KEY');
}

const cryptoNewsHeaders = {
  'x-rapidapi-key': cryptoNewsApiKey,
  'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com',
};

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
