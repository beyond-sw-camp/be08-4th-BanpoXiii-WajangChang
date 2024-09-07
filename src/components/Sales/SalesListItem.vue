<template>
  <b-col lg="4" sm="12">
    <b-card>
      <b-card-title>
        {{ sale.saleName }}
      </b-card-title>
      <b-card-body>
        <b-card-text>지역: {{ sale.saleLocation }}</b-card-text>
        <b-card-text>면적: {{ sale.area }}</b-card-text>
        <b-card-text>매매가: {{ sale.salePrice }}</b-card-text>
      </b-card-body>
    </b-card>
  </b-col>
</template>

<script>
export default {
  props: {
    sale: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
