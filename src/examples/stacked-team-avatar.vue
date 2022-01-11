<template>
  <div class="stacked-team-avatar-container example-container">
    <label class="example-label">
      <a href="https://github.com/geodav-tech/vue-dcjs/tree/master/src/components/dc-stacked-bar-chart" target="_blank">
        Stacked bar chart
      </a>
      showing hours on a team, stacked by if the user has uploaded an avatar or not
    </label>
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
    ></dc-stacked-bar-chart>
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
