<template>
  <example-container class="pie-checklist-container">
    <pie-team :ndx="computedNdx" class="flex-item" @post-render="(chart) => (pieChart = chart)" />
    <example-container link="src/components/dc-checklist" linkText="Checklist" label="for pie chart" :reset="false">
      <dc-checklist v-if="pieChart" :chart="pieChart" :digits="0" :max-height="324" />
    </example-container>
    <example-container link="src/components/dc-checklist" linkText="Checklist" label="for pie chart" :reset="false">
      <span>this is duplicated on purpose to test 2 checklists listening to the same chart</span>
      <dc-checklist v-if="pieChart" :chart="pieChart" :digits="0" :max-height="324" />
    </example-container>
  </example-container>
</template>

<script>
import { DcChecklist } from '../components'
import ExampleContainer from './example-container.vue'
import PieTeam from './pie-team.vue'
import sampleData from '../sample-data'

export default {
  components: { DcChecklist, PieTeam, ExampleContainer },
  props: {
    ndx: {
      // if not passed we will construct our own
      type: Object
    }
  },
  data() {
    return {
      pieChart: null,
      constructedNdx: null
    }
  },
  mounted() {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
  },
  computed: {
    computedNdx() {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>

<style>
.pie-checklist-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pie-checklist-container .example-container {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
