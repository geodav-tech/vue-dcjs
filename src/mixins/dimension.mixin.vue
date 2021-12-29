<script>
export default {
  name: 'DimensionMixin',
  props: {
    dimensionConstructor: {
      type: [String, Function] // (d) => value
    },
    dimensionIsArray: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    createDimension() {
      let dimensionAccessor = d => d
      if (typeof this.dimensionConstructor === 'string') {
        dimensionAccessor = this.$dc.pluck(this.dimensionConstructor)
      } else if (typeof this.dimensionConstructor === 'function') {
        dimensionAccessor = this.dimensionConstructor
      }
      return this.ndx.dimension(dimensionAccessor, this.dimensionIsArray)
    }
  }
}
</script>

<style>

</style>