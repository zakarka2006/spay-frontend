<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { NTabs, NFlex, NTabPane, NLayout, NLayoutHeader, NLayoutContent, NButton } from 'naive-ui';
import type { TabsInst } from 'naive-ui';

type TabName = 'home' | 'settings' | 'billing';

const router = useRouter();
const route = useRoute();
const { logout, user } = useAuth();

const tabsInstRef = ref<TabsInst | null>(null);
const tabValue = ref<TabName>('home');

function syncFromRoute() {
  const name = (route.name as string) || 'home';
  let v: TabName = 'home';
  if (name === 'settings') v = 'settings';
  if (name === 'billing') v = 'billing';
  tabValue.value = v;
  nextTick(() => tabsInstRef.value?.syncBarPosition());
}

function onTabUpdate(v: TabName) {
  if (tabValue.value !== v) {
    tabValue.value = v;
  }
  // Navigate to corresponding child route
  router.push({ name: v });
  nextTick(() => tabsInstRef.value?.syncBarPosition());
}

watch(() => route.name, () => {
  syncFromRoute();
});

onMounted(() => {
  syncFromRoute();
});

async function onLogout() {
  await logout();
  router.replace('/login');
}
</script>

<template>
  <n-layout style="min-height: 100vh;">
    <n-layout-header style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;gap:16px;">
      <div style="font-weight:600;white-space: nowrap; margin-right: 30px;">Панель управления</div>
      <n-tabs
          justify-content="start"
          ref="tabsInstRef"
          v-model:value="tabValue"
          size="large"
          animated
          pane-wrapper-style="display: none;"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          @update:value="onTabUpdate"
      >
        <n-tab-pane name="home" tab="Главная" />
        <n-tab-pane name="billing" tab="Биллинг" />
        <n-tab-pane name="settings" tab="Параметры" />
      </n-tabs>
      <n-flex align="center" :wrap="false" size="small">
        <div v-if="user && user.username" style="white-space: nowrap; font-weight: 500;">{{ user.username }}</div>
        <n-button tertiary type="error" @click="onLogout">Выйти</n-button>
      </n-flex>
    </n-layout-header>
    <n-layout-content style="padding:16px;padding-top:8px;">
      <router-view/>
    </n-layout-content>
  </n-layout>
</template>
