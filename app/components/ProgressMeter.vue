<script setup lang="ts">
const props = defineProps<{
  value: number
}>()

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))
</script>

<template>
  <div class="meter">
    <div class="meter__fill" :style="{ width: `${clampedValue}%` }" />
  </div>
</template>

<style scoped>
.meter {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 18px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(35, 55, 43, 0.08), rgba(35, 55, 43, 0.16));
}

.meter__fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background:
    linear-gradient(90deg, #2a9d8f 0%, #e9c46a 52%, #e76f51 100%);
  box-shadow: 0 0 30px rgba(231, 111, 81, 0.28);
}
</style>
