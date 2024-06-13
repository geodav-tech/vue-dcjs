<template>
  <example-container
    class="stacked-team-project-container"
    link="src/components/dc-stacked-bar-chart"
    linkText="Stacked bar chart"
    label="showing hours on a team, stacked by project"
  >
    <dc-stacked-bar-chart
      v-if="stacks.length && groups.length"
      :ndx="computedNdx"
      :stacks="stacks"
      :groups="groups"
      :options="{
        valueAccessor: 'hours',
        stackAccessor: 'project',
        groupAccessor: 'team',
        legendOptions: {
          y: 12,
          x: 36,
          horizontal: true,
          legendWidth: 900,
          itemWidth: 180
        },
        margins: {
          top: 160,
          left: 40
        },
        title: function (d) {
          return `${this.layer} ${d.key}: ${d.value[this.layer].toFixed(2)}`
        },
        height: 480
      }"
    />
  </example-container>
</template>

<script>
import { DcStackedBarChart } from '../components'
import sampleData from '../sample-data'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcStackedBarChart, ExampleContainer },
  props: {
    ndx: {
      type: Object
    }
  },
  data() {
    return {
      constructedNdx: null,
      groups: [],
      stacks: []
    }
  },
  mounted() {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
    this.createKeyStacks()
  },
  methods: {
    createKeyStacks() {
      let allData = this.ndx.all()
      this.groups = Array.from(new Set(allData.map((d) => d.team))).sort()
      this.stacks = Array.from(new Set(allData.map((d) => d.project))).sort()
    }
  },
  computed: {
    computedNdx() {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>
