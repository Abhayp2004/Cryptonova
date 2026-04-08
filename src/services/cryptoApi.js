import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const coinRankingApiKey = import.meta.env.VITE_RAPIDAPI_COINRANKING_KEY || '';

if (!coinRankingApiKey) {
  console.warn('Missing VITE_RAPIDAPI_COINRANKING_KEY. Coin data requests may fail.');
}

const cryptoApiHeaders = {
  ...(coinRankingApiKey ? { 'X-RapidAPI-Key': coinRankingApiKey } : {}),
  'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
};

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
