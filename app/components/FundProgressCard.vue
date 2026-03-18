<script setup lang="ts">
import type { CampaignPreview } from '~~/shared/types/fundraising'

const props = defineProps<{
  campaign: CampaignPreview
  compact?: boolean
}>()

const currencyFormatter = computed(() =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: props.campaign.currency,
    maximumFractionDigits: 0
  })
)

const progressLabel = computed(() => `${props.campaign.progressPercent.toFixed(1)}%`)
const overlayUrl = computed(() => `/overlay/${props.campaign.overlayToken}`)
</script>

<template>
  <article class="fund-card card" :class="{ 'fund-card--compact': compact }">
    <div class="fund-card__header">
      <div>
        <p class="fund-card__eyebrow">募資進度</p>
        <h2 class="fund-card__title">{{ campaign.name }}</h2>
      </div>

      <NuxtLink class="fund-card__link" :to="overlayUrl">
        開啟 overlay
      </NuxtLink>
    </div>

    <p v-if="!compact" class="fund-card__description">
      {{ campaign.headline }}
    </p>

    <div class="fund-card__amounts">
      <div>
        <strong>{{ currencyFormatter.format(campaign.currentAmount) }}</strong>
        <span>目前累積</span>
      </div>

      <div>
        <strong>{{ currencyFormatter.format(campaign.goalAmount) }}</strong>
        <span>目標金額</span>
      </div>

      <div>
        <strong>{{ progressLabel }}</strong>
        <span>達成比例</span>
      </div>
    </div>

    <ProgressMeter :value="campaign.progressPercent" />

    <div class="fund-card__sources">
      <span class="fund-card__source fund-card__source--youtube">
        YouTube {{ currencyFormatter.format(campaign.youtubeAmount) }}
      </span>
      <span class="fund-card__source fund-card__source--ecpay">
        綠界 {{ currencyFormatter.format(campaign.ecpayAmount) }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.fund-card {
  display: grid;
  gap: 20px;
  padding: 24px;
  border-radius: var(--radius-xl);
}

.fund-card--compact {
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(16, 23, 19, 0.86);
  color: white;
}

.fund-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.fund-card__eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.fund-card--compact .fund-card__eyebrow {
  color: rgba(255, 255, 255, 0.62);
}

.fund-card__title {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.05;
}

.fund-card__description {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.fund-card--compact .fund-card__description {
  color: rgba(255, 255, 255, 0.72);
}

.fund-card__link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.58);
  white-space: nowrap;
}

.fund-card--compact .fund-card__link {
  color: white;
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
}

.fund-card__amounts {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.fund-card__amounts strong {
  display: block;
  font-size: clamp(24px, 4vw, 34px);
}

.fund-card__amounts span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
}

.fund-card--compact .fund-card__amounts span {
  color: rgba(255, 255, 255, 0.7);
}

.fund-card__sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.fund-card__source {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.fund-card__source--youtube {
  background: rgba(255, 61, 61, 0.12);
  color: #c02d2d;
}

.fund-card__source--ecpay {
  background: rgba(27, 156, 103, 0.12);
  color: #0f7a4d;
}

.fund-card--compact .fund-card__source--youtube {
  color: #ffb3b3;
}

.fund-card--compact .fund-card__source--ecpay {
  color: #9df2c7;
}

@media (max-width: 720px) {
  .fund-card__amounts {
    grid-template-columns: 1fr;
  }
}
</style>
