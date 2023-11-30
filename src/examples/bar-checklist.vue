<template>
  <example-container class="bar-checklist-container">
    <bar-tasks :ndx="computedNdx" class="flex-item" @post-render="(chart) => (this.barChart = chart)" />
    <example-container link="src/components/dc-checklist" linkText="Checklist" label="for bar chart" :reset="false">
      <dc-checklist v-if="barChart" :chart="barChart" :digits="0" :max-height="324" />
    </example-container>
  </example-container>
</template>

<script>
import { DcChecklist } from '../components'
import ExampleContainer from './example-container.vue'
import BarTasks from './bar-tasks.vue'
import sampleData from '../sample-data'

export default {
  components: { ExampleContainer, BarTasks, DcChecklist },
  props: {
    ndx: {
      // if not passed, we'll construct our own
      type: Object
    }
  },
  data () {
    return {
      barChart: null,
      constructedNdx: null
    }
  },
  mounted () {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
  },
  computed: {
    computedNdx () {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>

<style>
.bar-checklist-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bar-checklist-container .example-container {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
}
.bar-checklist-container .example-container .dc-chart-container {
  flex: 1;
}
</style>
