import api from '@/services/Api.js';

export default {
  async getAccountData(year, month) {
    return await api().get(`v1/cost/get-all-data?month=${month}&&year=${year}`);
  },
  async getDateAccountData(date) {
    return await api().get(`v1/cost/get-by-date?date=${date}`);
  },
};
