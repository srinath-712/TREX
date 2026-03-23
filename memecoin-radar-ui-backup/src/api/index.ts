import axios from 'axios';
import { CoinsListResponse, TrendResponse, HistoryResponse } from '../types';

const BASE = '/api';

export const fetchCoins = () =>
  axios.get<CoinsListResponse>(`${BASE}/coins`).then(r => r.data);

export const fetchTrend = (coin: string) =>
  axios.get<TrendResponse>(`${BASE}/trend`, { params: { coin } }).then(r => r.data);

export const fetchHistory = (coin: string) =>
  axios.get<HistoryResponse>(`${BASE}/history`, { params: { coin } }).then(r => r.data);
