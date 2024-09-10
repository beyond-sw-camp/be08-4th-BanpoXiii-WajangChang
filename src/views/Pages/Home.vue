<template>
  <main class="p-4">
    <header class="mb-4">
      <h3>거래 내역 수정 테스트중입니다!!</h3>
    </header>

    <b-container class="">
      <b-row gutter-y="3">
        <sales-list-item
          v-for="sale in sales"
          :key="sale.salName"
          :sale="sale"
        />
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { useSalesStore } from "@/stores/salesStore";
import { SalesListItem } from "@/components/index";
export default {
  components: {
    SalesListItem,
  },
  setup() {
    const store = useSalesStore();

    return {
      store,
      fetchSales: store.fetchSales,
    };
  },
  mounted() {
    this.fetchSales();
  },
  computed: {
    sales() {
      return this.store.sales;
    },
    isLoading() {
      return this.store.isLoading;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
