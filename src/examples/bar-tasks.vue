<template>
  <example-container class="bar-tasks-container" link="src/components/dc-bar-chart" linkText="Bar chart" label="by task">
    <dc-bar-chart
      :ndx="computedNdx"
      :options="{
        groupAll: true,
        height: 300,
        scrollable: true,
        minScrollable: 18,
        margins: {
          top: 40,
          right: 60,
          left: 60,
          bottom: 60
        },
        filterFunction: (filters, item) =>
          (filters.includes('none') && (!item.tasks || !item.tasks.length)) || item.tasks.some((task) => filters.includes(task))
      }"
      :dimension-constructor="(d) => d"
      :reducer="{
        add: (p, v) => {
          if (!v.tasks || !v.tasks.length) {
            p.none = (p.none || 0) + v.hours
          } else {
            v.tasks.forEach((task) => {
              p[task] = (p[task] || 0) + v.hours
            })
          }
          return p
        },
        remove: (p, v) => {
          if (!v.tasks || !v.tasks.length) {
            p.none = (p.none || 0) - v.hours
          } else {
            v.tasks.forEach((task) => {
              p[task] = (p[task] || 0) - v.hours
            })
          }
          return p
        },
        init: () => ({})
      }"
    />
  </example-container>
</template>

<script>
import { DcBarChart } from '../components'
import sampleData from '../sample-data.js'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcBarChart, ExampleContainer },
  props: {
    ndx: {
      // if not passed we will construct our own
      type: Object
    }
  },
  data() {
    return {
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
