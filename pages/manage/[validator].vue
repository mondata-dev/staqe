<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const address = route.params.validator;
</script>

<template>
  <MangeValidatorPage :initial-validator-address="address" />
</template>
