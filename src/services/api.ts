import { create } from 'axios';

export const api = create({
  baseURL: 'https://api.nhtsa.gov',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Name': 'FordVinShareMobile',
  },
});
