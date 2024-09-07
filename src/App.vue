<template>
  <div class="vh-100">
    <main-nav-header />
    <router-view />
  </div>
</template>

<script>
import { MainNavHeader } from "@/components/index";

export default {
  components: {
    MainNavHeader,
  },
};
</script>

<style lang="scss" scoped></style>
