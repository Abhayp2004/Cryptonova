import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const coinRankingApiKey =
  import.meta.env.VITE_RAPIDAPI_COINRANKING_KEY ||
  import.meta.env.VITE_RAPIDAPI_KEY_COINRANKING ||
  import.meta.env.VITE_RAPIDAPI_KEY;

const cryptoApiHeaders = {
  'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
};

if (coinRankingApiKey) {
  cryptoApiHeaders['X-RapidAPI-Key'] = coinRankingApiKey;
} else {
  console.warn(
    'Missing RapidAPI key for coin ranking data. Set VITE_RAPIDAPI_COINRANKING_KEY, VITE_RAPIDAPI_KEY_COINRANKING, or VITE_RAPIDAPI_KEY.',
  );
}

const baseUrl = 'https://coinranking1.p.rapidapi.com/';

const createRequest = (url) => ({
  url,
  headers: cryptoApiHeaders,
});

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins?limit=${count}`),
    }),
    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`),
    }),
    getCryptoHistory: builder.query({
      query: ({ coinId, timePeriod }) => createRequest(`/coin/${coinId}/history/${timePeriod}`),
    }),
  }),
});

export const { useGetCryptosQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = cryptoApi;
