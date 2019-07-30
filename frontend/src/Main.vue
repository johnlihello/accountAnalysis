<template>
  <div id="main">
    <app-bar></app-bar>
    <div v-show="isMonthTableShow">
      <date-dropdown @refreshGraph="refreshGraph($event)"></date-dropdown>
    </div>
    <div v-show="isMonthTableShow">
      <month-table ref='monthTable' @showDailyDetail="showDailyDetail($event)"></month-table>
    </div>
    <div v-show="isDailyDetailShow">
      <daily-detail ref='dailyDetail' @changeToMonthTable='changeToMonthTableView($event)'></daily-detail>
    </div>
    <router-view/>
  </div>
</template>

<script>
import AppBar from '@/components/AppBar';
import MonthTable from '@/components/MonthTable';
import DateDropdown from '@/components/DateDropdown';
import DailyDetail from '@/components/DailyDetail';

export default{
  name: 'Main',
  components: {
    AppBar,
    MonthTable,
    DateDropdown,
    DailyDetail,
  },
  data() {
    return {
      isMonthTableShow: true,
      isDailyDetailShow: true,
    };
  },
  mounted() {
    this.changeToMonthTableView();
  },
  methods: {
    changeToMonthTableView() {
      this.isMonthTableShow = true;
      this.isDailyDetailShow = false;
    },
    changeToDailyDetailView() {
      this.isMonthTableShow = false;
      this.isDailyDetailShow = true;
    },
    refreshGraph(dateArgs) {
      this.$refs.monthTable.getData(dateArgs.year, dateArgs.month);
    },
    async showDailyDetail(dateStr) {
      await this.changeToDailyDetailView();
      this.$refs.dailyDetail.getDateCostDetail(dateStr);
    },
  },
};

</script>
