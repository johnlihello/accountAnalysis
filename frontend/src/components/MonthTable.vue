<template>
    <div id="main" style="height:40vh width:40vw">
      <canvas id="chart" style="height:500px width:200px"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js';
import GetService from '@/services/GetService.js';
import palette from 'google-palette/palette.js';
export default {
  name: 'Account',
  components: {
  },
  mounted() {
    this.getData(this.year, this.month);
  },
  data() {
    return {
      topic: '201905 Spend',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datas: [300, 700, 450, 750, 450],
      index: 0,
      mychart: '',
      year: '2019',
      month: '06',
    };
  },
  methods: {
    async getData(year, month) {
      this.year = year;
      this.month = month;
      this.topic = year + month + ' Spend';
      this.labels = [];
      this.datas = [];
      const self = this;
      const result = await GetService.getAccountData(year, month);
      const data = result['data']['dataDict'];
      for (const [key, value] of Object.entries(data)) {
        self.labels.push(key);
        self.datas.push(value);
      }
      this.draw_graph();
    },
    draw_graph() {
      const self = this;
      const canvas = document.getElementById('chart');
      const colors = palette('tol-sq', this.datas.length).map(function(hex) {
        return '#' + hex;
      });
      if (this.mychart != '') {
        this.mychart.clear();
        this.mychart.destroy();
      };
      this.mychart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: this.topic,
              data: this.datas,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          onClick: function(c, i) {
            const e = i[0];
            const date = this.data.labels[e._index];
            const cost_total_money = this.data.datasets[0].data[e._index];
            self.$emit('showDailyDetail', date);
          },
          maintainAspectRatio: true,
          scales: {
            yAxes: [{
              ticks: {
                max: 2000,
                beginAtZero: true,
                stepSize: 500,
              },
            }],
          },
        },
      });
    },
  },
};
</script>
