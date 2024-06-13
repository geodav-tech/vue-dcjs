<template>
  <example-container
    class="stacked-team-avatar-container"
    link="src/components/dc-stacked-bar-chart"
    linkText="Stacked bar chart"
    label="showing hours on a team, stacked by if the user has uploaded an avatar or not"
  >
    <dc-stacked-bar-chart
      v-if="stacks.length && groups.length"
      :ndx="computedNdx"
      :stacks="stacks"
      :groups="groups"
      :colors="['#ee9c20', '#209cee']"
      :options="{
        valueAccessor: 'hours',
        stackAccessor: (d) => d.avatar.toString(),
        groupAccessor: 'team',
        legendOptions: {
          y: 12,
          x: 36
        },
        margins: {
          top: 50,
          left: 40
        },
        title: function (d) {
          return `${this.layer} ${d.key}: ${d.value[this.layer].toFixed(2)}`
        },
        height: 420
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
      stacks: [
        { name: 'Has avatar', key: 'true' },
        { name: 'Does not have avatar', key: 'false' }
      ]
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
    }
  },
  computed: {
    computedNdx() {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>
