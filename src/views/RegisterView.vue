<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import {useMessage, NCard, NForm, NFormItem, NInput, NButton, NSpace, NText, NFlex} from 'naive-ui';

const router = useRouter();
const { register } = useAuth();
const message = useMessage();

const loading = ref(false);
const form = reactive({
  username: '',
  email: '',
  password: '',
});

async function onSubmit() {
  if (loading.value) return;
  loading.value = true;
  try {
    const u = await register({ username: form.username, email: form.email, password: form.password });
    message.success(`Добро пожаловать, ${u.username}!`, { closable: true });
    router.replace('/');
  } catch (err: any) {
    message.error(err?.message ?? 'Ошибка регистрации', { closable: true });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="display:flex;min-height:100vh;align-items:center;justify-content:center">
    <n-card style="max-width:480px;width:100%;" title="Регистрация">
      <n-form @submit.prevent="onSubmit">
        <n-form-item label="Имя пользователя">
          <n-input v-model:value="form.username" placeholder="Ваше имя" />
        </n-form-item>
        <n-form-item label="Почта">
          <n-input v-model:value="form.email" placeholder="you@example.com" type="text" />
        </n-form-item>
        <n-form-item label="Пароль">
          <n-input v-model:value="form.password" placeholder="••••••••" type="password" />
        </n-form-item>
        <n-space vertical size="large">
          <n-button type="primary" attr-type="submit" :loading="loading" block>
            Зарегистрироваться
          </n-button>
        </n-space>
        <n-flex style="padding-top: 10px;" vertical justify="center" align="center">
          <n-text>
            Уже есть аккаунт?
            <RouterLink to="/login">Войти</RouterLink>
          </n-text>
        </n-flex>
      </n-form>
    </n-card>
  </div>
</template>
