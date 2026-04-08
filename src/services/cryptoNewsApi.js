import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoNewsHeaders = {
  'x-rapidapi-key': 'a0b17b0793mshed3064bbfadf271p1ae705jsn5eb8a35f39be',
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
