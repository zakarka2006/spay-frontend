<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { NCard, NForm, NFormItem, NInput, NButton, NDivider, NAlert, NPopconfirm } from 'naive-ui';
import { deleteUser } from '../api/user';
import { unwrap } from '../api/client';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const message = useMessage();
const { logout } = useAuth();

// Demo field (not wired)
const username = ref('');

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
</script>

<template>
  <n-card title="Параметры">
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
