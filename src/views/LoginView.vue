<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useMessage, NFlex, NCard, NForm, NFormItem, NInput, NButton, NSpace, NText } from 'naive-ui';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();
const message = useMessage();

const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
});

async function onSubmit() {
  if (loading.value) return;
  loading.value = true;
  try {
    const u = await login({ email: form.email, password: form.password });
    message.success(`Добро пожаловать, ${u.username}!`, { closable: true });
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch (err: any) {
    message.error(err?.message ?? 'Ошибка входа', { closable: true });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div style="display:flex;height:100%;width: 100%;align-items:center;justify-content:center">
    <n-card style="max-width:450px;width:90%;" title="Вход">
      <n-form @submit.prevent="onSubmit">
        <n-form-item label="Email">
          <n-input id="email" v-model:value="form.email" placeholder="you@example.com" type="text" />
        </n-form-item>
        <n-form-item label="Пароль">
          <n-input v-model:value="form.password" placeholder="••••••••" type="password" />
        </n-form-item>
        <n-space vertical size="large">
          <n-button type="primary" attr-type="submit" :loading="loading" block>
            Войти
          </n-button>
        </n-space>
        <n-flex style="padding-top: 10px;" vertical justify="center" align="center">
          <n-text>
            Нет аккаунта?
            <RouterLink to="/register">Зарегистрироваться</RouterLink>
          </n-text>
        </n-flex>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>

</style>
