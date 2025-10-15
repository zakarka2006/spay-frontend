<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NGlobalStyle } from 'naive-ui'
</script>

<template>
  <n-config-provider style="height: 100%;width: 100%;">
    <n-message-provider :placement="'top'">
      <router-view />
    </n-message-provider>
    <n-global-style />
  </n-config-provider>
</template>
