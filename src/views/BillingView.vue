<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { NCard } from 'naive-ui';
import Chart from 'chart.js/auto';

const chart1Ref = ref<HTMLCanvasElement | null>(null);
const chart2Ref = ref<HTMLCanvasElement | null>(null);
let chart1: any = null;
let chart2: any = null;

onMounted(() => {

  if (chart1Ref.value) {
    const ctx1 = chart1Ref.value.getContext('2d');
    if (ctx1) {
      chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
          datasets: [
            {
              label: 'Ежемесячные расходы (₽)',
              data: [1200, 900, 1500, 1300, 2100, 1800, 2400, 2000, 2200, 2600, 2300, 2800],
              borderColor: 'rgba(53, 162, 235, 1)',
              backgroundColor: 'rgba(53, 162, 235, 0.25)',
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Динамика расходов за год' },
            tooltip: { enabled: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (v: any) => `${v} ₽` },
            },
          },
        },
      });
    }
  }

  if (chart2Ref.value) {
    const ctx2 = chart2Ref.value.getContext('2d');
    if (ctx2) {
      chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Оплачено', 'Возвраты', 'Отмены', 'Платежи в обработке'],
          datasets: [
            {
              label: 'Количество',
              data: [84, 3, 5, 7],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(201, 203, 207, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(201, 203, 207, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Статусы платежей' },
          },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
        },
      });
    }
  }
});

onBeforeUnmount(() => {
  try { chart1?.destroy?.(); } catch {}
  try { chart2?.destroy?.(); } catch {}
});
</script>

<template>
  <n-card title="Биллинг">
    <div style="margin-bottom: 12px;">Информация о биллинге.</div>
    <div class="charts">
      <div class="chart-block">
        <canvas ref="chart1Ref"></canvas>
      </div>
      <div class="chart-block">
        <canvas ref="chart2Ref"></canvas>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 768px) {
  .charts {
    grid-template-columns: 1fr 1fr;
  }
}
.chart-block {
  width: 100%;
  height: 280px;
}
.chart-block canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
