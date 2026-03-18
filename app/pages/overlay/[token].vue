<script setup lang="ts">
const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const { data, error } = await useOverlayCampaign(token)

const campaign = computed(() => data.value?.campaign)
const compact = computed(() => route.query.compact === '1')
const transparent = computed(() => route.query.transparent === '1')

useHead(() => ({
  title: campaign.value ? `${campaign.value.name} Overlay` : 'Overlay Preview',
  bodyAttrs: {
    class: transparent.value ? 'overlay-body--transparent' : ''
  }
}))
</script>

<template>
  <main class="overlay-page" :class="{ 'overlay-page--transparent': transparent }">
    <div v-if="campaign" class="overlay-page__card">
      <FundProgressCard :campaign="campaign" :compact="compact || transparent" />
    </div>

    <div v-else-if="error" class="overlay-page__error">
      找不到這個 overlay token。
    </div>
  </main>
</template>

<style scoped>
.overlay-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}

.overlay-page--transparent {
  background: transparent;
}

.overlay-page__card {
  width: min(100%, 960px);
}

.overlay-page__error {
  padding: 20px 24px;
  border-radius: 20px;
  background: rgba(20, 24, 22, 0.88);
  color: white;
}
</style>
