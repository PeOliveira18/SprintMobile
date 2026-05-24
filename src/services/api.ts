import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.nhtsa.gov',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Name': 'FordVinShareMobile',
  },
});
