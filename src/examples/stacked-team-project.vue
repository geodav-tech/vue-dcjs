<template>
  <div class="stacked-team-project-container example-container">
    <label class="example-label">
      <a href="https://github.com/geodav-tech/vue-dcjs/tree/master/src/components/dc-stacked-bar-chart" target="_blank">
        Stacked bar chart
      </a>
      showing hours on a team, stacked by project.
    </label>
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
  </div>
</template>

<script>
import { DcStackedBarChart } from '../components'
export default {
  components: { DcStackedBarChart },
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
