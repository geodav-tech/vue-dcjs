<template>
  <div class="dc-check-list-container" :style="computedStyle">
    <slot name="search">
      <div class="dc-search-input-container">
        <label for=".dc-search-input" class="dc-search-input-label">Search</label>
        <input class="dc-search-input" v-model="groupFilter" @input="updateSearch" />
      </div>
    </slot>
    <div class="dc-checkbox-container">
      <div class="dc-checkbox" v-for="item in shownGroups" :key="item.key" @click="toggleFilterFor(item.key)">
        <slot name="option" v-bind:option="item" v-bind:value="inFilter.includes(item.key)">
          <span class="dc-option-box" :class="{'selected': inFilter.includes(item.key)}" />
          <span class="dc-option-label" :class="{'selected': inFilter.includes(item.key)}">
            {{ item.key }} ({{ item.value | formatFilter(computedDigits) }})
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { flat, accessorFunc } from '@/dc-utils'
export default {
  name: 'DcChecklist',
  props: {
    chart: {
      type: Object,
      required: true
    },
    options: { // computedOptions from the chart
      type: Object,
      required: true
    },
    searchable: {
      type: Boolean,
      default: true
    },
    search: { // if you want to override search string functionality
      type: String,
      default: ''
    },
    othersLimit: {
      // define an "others" group cutoff. values past this number are considered in an "others" group
      // not needed if options.slicesCap is defined
      type: Number
    },
    digits: {
      type: Number
    },
    maxHeight: { // will make checkboxes scrollable with a max-height
      type: [String, Number],
      default: null
    },
    othersLabel: {
      type: String
    }
  },
  data () {
    return {
      groupFilter: '',
      groups: [],
      others: [], // groups for pie charts which list an "others" category
      inFilter: [],

    }
  },
  mounted () {
    this.resetFilters()
    this.updateListValues()
    this.chart.on('renderlet', () => {
      this.updateListValues()
    })
    this.chart.on('filtered', () => {
      this.$nextTick(() => {
        this.checkOthersFilterToggled()
        this.resetFilters()
        this.updateListValues()
      })
    })
  },
  filters: { 
    formatFilter (value, digits) {
      if (digits || digits === 0) {
        return value.toFixed(digits)
      } else {
        return value
      }
    }
  },
  methods: {
    resetFilters () {
      // set the inFilter to match the chart
      this.inFilter = Array.from(new Set(flat(this.chart.filters())))
      this.groupFilter = ''
    },
    updateListValues () {
      // deep copy the groups so values do not get messed up when filtering
      this.groups = JSON.parse(JSON.stringify(this.chart.group().order((value) => this.valueAccessor({ value })).top(Infinity)))
      if (this.options.slicesCap || this.othersLimit) {
        this.others = this.groups.slice(this.options.slicesCap || this.othersLimit).map(d => d.key)
      } else {
        this.others = []
      }
    },
    checkOthersFilterToggled () {
      // fix issue where a category would get excluded by mistake when:
      // - check a box in the 'others' category from this list
      // - click the 'others' category on the pie chart after
      // check for this case and add back in the category you clicked if necessary
      let currentFilters = this.chart.filters()
      let othersLabel = this.othersLabel || this.options.othersLabel || 'others'
      const fixFilters = this.others.filter(k => !currentFilters.includes(k) && this.inFilter.includes(k))
      if (currentFilters.includes(othersLabel) && fixFilters.length) {
        currentFilters.push(...fixFilters)
        this.inFilter = currentFilters
        this.chart.replaceFilter([currentFilters])
      }
    },
    toggleFilterFor (key) {
      if (this.inFilter.includes(key)) {
        this.inFilter = this.inFilter.filter(k => k !== key)
      } else {
        this.inFilter.push(key)
      }

      // yes this has to be an array of arrays thus [inFilter]
      // https://stackoverflow.com/questions/38920359/how-to-filter-multiple-values-in-a-dc-crossfilter-dimension
      // marked answer, first part mentions this
      this.chart.replaceFilter([this.inFilter])
      this.$nextTick(() => this.$dc.redrawAll())
    },
    updateSearch () {
      this.$emit('update:search', this.groupFilter)
      this.$emit('update-search', this.groupFilter)
    }
  },
  computed: {
    shownGroups () {
      if (!this.groupFilter || !this.groupFilter.length) {
        return this.groups
      } else {
        return this.groups.filter(g => {
          const reg = new RegExp(this.groupFilter, 'gi')
          return reg.test(g.key)
        })
      }
    },
    valueAccessor () {
      return accessorFunc(this.options.valueAccessor || (d => d.value))
    },
    computedDigits () {
      if (this.digits || this.digits === 0) {
        return this.digits
      } else {
        return this.options.digits
      }
    },
    computedStyle () {
      let styles = []
      if (this.maxHeight) {
        styles.push('overflow-y: auto')
        if (typeof this.maxHeight === 'number') {
          styles.push(`max-height: ${this.maxHeight}px`)
        } else {
          styles.push(`max-height: ${this.maxHeight}`)
        }
      }

      return styles.join('; ')
    }
  },
}
</script>

<style>
  .dc-check-list-container {
    text-align: left;
    width: 100%;
  }
  .dc-check-list-container .dc-search-input-container .dc-search-input-label {
    display: block;
    font-weight: bold;
    font-size: 0.85rem;
    margin-bottom: -0.25rem;
  }
  .dc-check-list-container .dc-search-input-container .dc-search-input {
    border-radius: 0.25rem;
    padding: 0.25rem;
    width: calc(100% - 1.25rem);
    border-color: black;
  }

  .dc-check-list-container .dc-checkbox-container .dc-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .dc-check-list-container .dc-checkbox-container .dc-checkbox:nth-child(2n) {
    background-color: whitesmoke;
  }
  .dc-check-list-container .dc-checkbox-container .dc-checkbox .dc-option-box {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    margin: 0.25rem;
    border: 2px solid black;
  }
  .dc-check-list-container .dc-checkbox-container .dc-checkbox .dc-option-box.selected {
    background-color: rgb(56, 140, 230, 1);
  }
  .dc-check-list-container .dc-checkbox-container .dc-checkbox:hover .dc-option-box {
    background-color: rgba(56, 140, 230, 0.25);
  }
  .dc-check-list-container .dc-checkbox-container .dc-checkbox:hover .dc-option-box.selected {
    background-color: rgba(56, 140, 230, 0.75);
  }
</style>