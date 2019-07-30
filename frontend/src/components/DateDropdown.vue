/* eslint-disable max-len */
<template>
  <div id='main'>
    <div>
      <b-dropdown id="dropdown-left" text="year" variant="primary" class="m-2">
        <b-dropdown-item v-for="year in this.years"
                    :key="year.value"
                    :value="year.value"
                    @click="setYear(year.value)">{{year.value}}</b-dropdown-item>
      </b-dropdown>

      <b-dropdown  id="dropdown-right" right text="month" variant="primary" class="m-2">
        <b-dropdown-item v-for="month in this.months"
                    :key="month.value"
                    :value="month.value"
                    @click="refreshGraph(month.value)">{{month.value}}</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateDropdown',
  components: {
  },
  data() {
    return {
      months: [
        {value: '01'},
        {value: '02'},
        {value: '03'},
        {value: '04'},
        {value: '05'},
        {value: '06'},
        {value: '07'},
        {value: '08'},
        {value: '09'},
        {value: '10'},
        {value: '11'},
        {value: '12'},
      ],
      years: [
        {value: '2019'},
      ],
      year: '2019',
    };
  },
  mounted() {
  },
  methods: {
    setYear(year) {
      this.year = year;
    },
    refreshGraph(month) {
      this.$emit('refreshGraph', {'year': this.year, 'month': month});
    },
  },
};
</script>
