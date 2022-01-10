<script>
export default {
  props: {
    legend: {
      type: Boolean
    },
    legendOptions: {
      type: Object
    }
  },
  methods: {
    applyLegendOptions() {
      if (this.computedOptions.showLegend || this.computedOptions.legend || this.legend) {
        let legend = this.$dc.legend()
        let {
          autoWidth,
          gap,
          highlightSelected,
          horizontal,
          itemHeight,
          itemWidth,
          keyboardAccessible,
          legendText,
          legendWidth,
          maxItems,
          x,
          y
        } = this.computedLegendOptions

        // use !== undefined to allow false/0 values to be accepted

        if (autoWidth !== undefined) {
          legend.autoWidth(autoWidth)
        } else if (itemWidth !== undefined) {
          legend.itemWidth(itemWidth)
        }

        if (gap !== undefined) {
          legend.gap(gap)
        }

        if (highlightSelected !== undefined) {
          legend.highlightSelected(highlightSelected)
        }

        if (horizontal !== undefined) {
          legend.horizontal(horizontal)
        }
        if (itemHeight !== undefined) {
          legend.itemHeight(itemHeight)
        }

        if (keyboardAccessible !== undefined) {
          legend.keyboardAccessible(keyboardAccessible)
        }

        if (legendText !== undefined) {
          legend.legendText(legendText)
        }
        if (legendWidth !== undefined) {
          legend.legendWidth(legendWidth)
        }
        if (maxItems !== undefined) {
          legend.maxItems(maxItems)
        }
        if (x !== undefined) {
          legend.x(x)
        }
        if (y !== undefined) {
          legend.y(y)
        }
        this.chart.legend(legend)
      }
    }
  },
  computed: {
    computedLegendOptions() {
      return Object.assign({}, this.defaultOptions?.legendOptions, this.options?.legendOptions, this.legendOptions)
    }
  }
}
</script>
