<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { NSkeleton, NCard, NForm, NFormItem, NInput, NButton, NAlert, NPopconfirm, NSelect } from 'naive-ui';
import { deleteUser } from '../api/user';
import { unwrap } from '../api/client';
import { useAuth } from '../composables/useAuth';
import { addCard, getCards } from '../api/cards';
import type { CardResponse, SubscriptionResponse } from '../api/types';
import { getStripe } from '../composables/useStripe';
import { createSubscription, cancelSubscription, changePaymentMethod, getSubscription } from '../api/subscription';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

const router = useRouter();
const message = useMessage();
const { logout } = useAuth();

// Danger zone state
const dangerPassword = ref('');
const deleting = ref(false);

async function onDeleteAccount() {
  if (deleting.value) return;
  deleting.value = true;
  try {
    await unwrap(deleteUser({ password: dangerPassword.value || undefined }));
    message.success('Аккаунт удален');
    // Ensure local session cleanup and redirect to login
    await logout();
    router.replace('/login');
  } catch (err: any) {
    const msg = err?.message || 'Не удалось удалить аккаунт';
    message.error(msg);
  } finally {
    deleting.value = false;
  }
}

// Cards state
const addingCard = ref(false);
const cards = ref<CardResponse[]>([]);
const loadingCards = ref(true);

// Stripe Elements
const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardEl = ref<StripeCardElement | null>(null);
const cardMountRef = ref<HTMLDivElement | null>(null);
const stripeReady = ref(false);

// Debounced loading for cards (200ms)
let loadCardsTimer: number | undefined;
function loadCardsDebounced(delay = 200) {
  if (loadCardsTimer) window.clearTimeout(loadCardsTimer);
  loadCardsTimer = window.setTimeout(() => {
    loadCards();
  }, delay);
}

// Click handler wrapper to satisfy Naive UI's (e: MouseEvent) => void signature
const onRefreshCards = () => {
  loadCardsDebounced();
};

async function initStripe() {
  try {
    stripe.value = await getStripe();
    if (!stripe.value) {
      throw new Error('Stripe не загрузился');
    }
    elements.value = stripe.value.elements();
    cardEl.value = elements.value.create('card', { hidePostalCode: true, disableLink: true  });
    if (cardMountRef.value) {
      cardEl.value.mount(cardMountRef.value);
      stripeReady.value = true;
    }
  } catch (err: any) {
    const msg = err?.message || 'Stripe не инициализировался';
    message.error(msg);
  }
}

onUnmounted(() => {
  try {
    cardEl.value?.destroy();
  } catch {}
  if (loadCardsTimer) window.clearTimeout(loadCardsTimer);
});

async function loadCards() {
  loadingCards.value = true;
  try {
    cards.value = await unwrap(getCards());
    if (!selectedCardId.value && cards.value.length > 0) {
      selectedCardId.value = cards.value[0]?.id ?? null;
    }
  } catch (err: any) {
    const msg = err?.message || 'Не удалось загрузить карты';
    message.error(msg);
  } finally {
    loadingCards.value = false;
  }
}

// Subscription state
const subscription = ref<SubscriptionResponse | null>(null);
const loadingSubscription = ref(true);
const selectedCardId = ref<number | string | null>(null);
const creatingSub = ref(false);
const cancelingSub = ref(false);
const changingMethod = ref(false);

const cardOptions = computed(() =>
  cards.value.map((c) => ({
    label: `${c.brand} •••• ${c.last4} (${c.expMonth}/${c.expYear})`,
    value: c.id,
  }))
);

async function loadSubscription() {
  loadingSubscription.value = true;
  try {
    subscription.value = await unwrap(getSubscription());
  } catch (err: any) {
    // No active subscription
    subscription.value = null;
  } finally {
    loadingSubscription.value = false;
  }
}

async function onCreateSubscription() {
  if (creatingSub.value) return;
  if (!selectedCardId.value) {
    message.error('Выберите карту');
    return;
  }
  creatingSub.value = true;
  try {
    await unwrap(createSubscription(selectedCardId.value));
    message.success('Подписка оформлена');
    await loadSubscription();
  } catch (err: any) {
    const msg = err?.message || 'Не удалось создать подписку';
    message.error(msg);
  } finally {
    creatingSub.value = false;
  }
}

async function onCancelSubscription() {
  if (cancelingSub.value) return;
  cancelingSub.value = true;
  try {
    await unwrap(cancelSubscription());
    message.success('Подписка отменена');
    subscription.value = null;
  } catch (err: any) {
    const msg = err?.message || 'Не удалось отменить подписку';
    message.error(msg);
  } finally {
    cancelingSub.value = false;
  }
}

async function onChangePayment() {
  if (changingMethod.value) return;
  if (!selectedCardId.value) {
    message.error('Выберите карту');
    return;
  }
  changingMethod.value = true;
  try {
    await unwrap(changePaymentMethod(selectedCardId.value));
    message.success('Способ оплаты обновлен');
  } catch (err: any) {
    const msg = err?.message || 'Не удалось изменить способ оплаты';
    message.error(msg);
  } finally {
    changingMethod.value = false;
  }
}


async function onAddCardViaStripe() {
  console.log(addingCard)
  if (addingCard.value) return;
  if (!stripe.value || !cardEl.value) {
    message.error('Stripe не готов');
    return;
  }
  addingCard.value = true;
  try {
    const { paymentMethod, error } = await stripe.value.createPaymentMethod({ type: 'card', card: cardEl.value });
    if (error || !paymentMethod) {
      throw new Error(error?.message || 'Не удалось создать метод оплаты');
    }
    await unwrap(addCard({ paymentMethodId: paymentMethod.id }));
    message.success('Карта добавлена');
    await loadCards();
    cardEl.value.clear();
  } catch (err: any) {
    const msg = err?.message || 'Не удалось добавить карту';
    message.error(msg);
  } finally {
    addingCard.value = false;
  }
}

onMounted(() => {
  loadCardsDebounced();
  initStripe();
  loadSubscription();
});
</script>

<template>
  <n-card title="Параметры">
    <n-card embedded size="small" style="margin-bottom: 12px;">
      <template #header>
        Платёжные карты
      </template>
      <n-flex
          style="height: 50px"
          vertical
      >
        <n-form label-placement="top" style="min-width: 260px; min-height: 40px;">
          <n-form-item label="Данные карты" feedback-style="display: none;" style="margin-bottom: 12px">
            <div ref="cardMountRef" v-show="stripeReady" style="width: 350px;border: 1px solid black; border-radius: 6px; padding: 10px;" />
            <n-skeleton v-if="!stripeReady" text style="width: 350px; border-radius: 6px; padding: 10px;"/>
          </n-form-item>
        </n-form>
        <div style="display: flex; justify-content: start; align-items: center">
          <n-button type="primary" primary :disabled="!stripeReady" :loading="addingCard" @click="onAddCardViaStripe" style="margin-right: 12px">Добавить карту</n-button>
          <n-button secondary @click="onRefreshCards">Обновить список</n-button>
        </div>
      </n-flex>

      <div style="margin-top: 12px;">
        <div v-if="loadingCards">
          <n-skeleton text :repeat="6" />
        </div>
        <div v-else-if="cards.length === 0">Карт пока нет.</div>
        <ul v-else style="padding-left: 18px; margin: 0;">
          <li v-for="c in cards" :key="String(c.id)">
            {{ c.brand }} •••• {{ c.last4 }} ({{ c.expMonth }}/{{ c.expYear }})
          </li>
        </ul>
      </div>
    </n-card>

    <n-card embedded size="small" style="margin-bottom: 12px;">
      <template #header>
        Подписка
      </template>
      <div v-if="loadingSubscription">
        <n-skeleton text :repeat="3" />
      </div>
      <div v-else>
        <div v-if="subscription">
          <div style="margin-bottom: 12px;">
            Текущая подписка активна.
          </div>
          <div style="margin-bottom: 12px;">
            Сумма: {{ subscription.amount }} | API Key: {{ subscription.apiKey }}
          </div>
          <n-form label-placement="top" style="max-width: 420px;">
            <n-form-item label="Карта для оплаты" feedback-style="display: none;" style="margin-bottom: 12px">
              <n-select :options="cardOptions" v-model:value="selectedCardId" :disabled="cards.length === 0" placeholder="Выберите карту" />
            </n-form-item>
            <div style="display: flex; justify-content: start; align-items: center">
              <n-button type="primary" tertiary :disabled="!selectedCardId" :loading="changingMethod" @click="onChangePayment">Сменить способ оплаты</n-button>
              <n-button type="error" secondary :loading="cancelingSub" @click="onCancelSubscription" style="margin-left: 12px;">Отменить подписку</n-button>
            </div>
          </n-form>
        </div>
        <div v-else>
          <div style="margin-bottom: 12px;">Подписка не активна. Чтобы оформить подписку, выберите карту.</div>
          <n-form label-placement="top" style="max-width: 420px;">
            <n-form-item label="Карта для оплаты">
              <n-select :options="cardOptions" v-model:value="selectedCardId" :disabled="cards.length === 0" placeholder="Выберите карту" />
            </n-form-item>
            <div style="display: flex; justify-content: start; align-items: center">
              <n-button type="primary" :disabled="!selectedCardId || cards.length === 0" :loading="creatingSub" @click="onCreateSubscription">Оформить подписку</n-button>
              <n-button secondary @click="onRefreshCards" style="margin-left: 12px;">Обновить карты</n-button>
            </div>
          </n-form>
          <div v-if="cards.length === 0" style="margin-top: 8px;">Сначала добавьте платёжную карту выше.</div>
        </div>
      </div>
    </n-card>

    <!-- Danger zone -->
    <n-card embedded size="small">
      <n-alert type="error" title="Опасная зона" :show-icon="true">
        Удаление аккаунта необратимо.
      </n-alert>
      <n-form label-placement="top" style="margin-top: 12px;">
        <n-form-item label="Пароль (для подтверждения)">
          <n-input v-model:value="dangerPassword" type="password" placeholder="Введите пароль" />
        </n-form-item>
        <n-popconfirm :positive-text="'Удалить'" :negative-text="'Отмена'" @positive-click="onDeleteAccount">
          <template #trigger>
            <n-button type="error" :loading="deleting">Удалить аккаунт</n-button>
          </template>
          Действительно удалить аккаунт? Это действие нельзя отменить.
        </n-popconfirm>
      </n-form>
    </n-card>
  </n-card>
</template>
