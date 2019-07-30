<template>
  <div>
    <b-button variant="outline-primary" @click="changeToMonthTable()">MonthTable</b-button>
    <h3>Total cost is {{ totalMoney }}.</h3>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<style>
h3 {
  padding-left: 3vw;
  text-align: left;
}
</style>


<script>
import GetService from '@/services/GetService.js';
export default {
  data() {
    return {
      items: [
        {age: 40, first_name: 'Dickerson', last_name: 'Macdonald'},
        {age: 21, first_name: 'Larsen', last_name: 'Shaw'},
        {age: 89, first_name: 'Geneva', last_name: 'Wilson'},
        {age: 38, first_name: 'Jami', last_name: 'Carney'},
      ],
      totalMoney: 0,
    };
  },
  mounted() {
  },
  methods: {
    async getDateCostDetail(dateStr) {
      const result = await GetService.getDateAccountData(dateStr);
      const data = result['data']['dataList'];
      this.totalMoney = 0;
      data.forEach((element) => {
        delete element.uid;
        delete element.幣別;
        delete element._id;
        delete element['付款(轉出)'];
        this.totalMoney += element.金額;
      });
      data.sort(function(a, b) {
        return parseFloat(a.Id) - parseFloat(b.Id);
      });
      this.items = data;
    },
    changeToMonthTable() {
      this.$emit('changeToMonthTable');
    },
  },
};
</script>
