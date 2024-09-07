import { apiClient } from "@/apis";
import { defineStore } from "pinia";

export const useSalesStore = defineStore("sales", {
  state: () => {
    return {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      sales: [],
    };
  },
  actions: {
    async fetchSales(page = 0, size = 10) {
      try {
        this.isLoading = true;
        const response = await apiClient.get("/sales/list", {
          params: {
            page,
            size,
          },
        });
        console.log(response);

        this.sales = response.data;
        this.isLoading = false;
        this.isSuccess = true;
        this.isError = false;
      } catch (err) {
        console.log(err);
        this.isSuccess = false;
        this.isError = true;
        this.error = err;
      }
    },
  },
});
