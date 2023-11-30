import { CapMixin, ColorMixin, MarginMixin, transition } from 'dc'
import { axisBottom, axisLeft, axisRight, axisTop, extent as d3Extent, scaleLinear } from 'd3'

// https://gist.github.com/ialarmedalien/ebca7eeb67c6d0b0a7809c46ef160cd0
// Adapted into a class implementation by shawn@geodav.tech
/**
 * Separate axis implementation.
 *
 * Examples:
 * - {@link https://bl.ocks.org/ialarmedalien/0a4bf25ffc0fb96ae569a20f91957bc1 eslint on dc.js source}
 * @class AxisChart
 * @example
 * // create an axis under #chart-container1 element using the default global chart group
 * var chart1 = new AxisChart('#chart-container1');
 * // create an axis under #chart-container2 element using chart group A
 * var chart2 = new AxisChart('#chart-container2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-selection d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 */
export class AxisChart extends CapMixin(ColorMixin(MarginMixin)) {
  _g
  _scale
  _elastic
  _type = 'axisBottom'
  _theAxis = axisBottom()
  _axisData
  validAxisTypes = ['axisBottom', 'axisTop', 'axisLeft', 'axisRight']
  axisCap

  calculateAxisScale() {
    if (!this._scale || this._elastic) {
      var extent = d3Extent(this._axisData, (d, i) => this.cappedValueAccessor(d, i))
      if (extent[0] > 0) {
        extent[0] = 0
      }
      if (extent[1] < 0) {
        extent[1] = 0
      }
      this._scale = scaleLinear()
        .domain(extent)
        .range([0, this._type === 'axisBottom' || this._type === 'axisTop' ? this.effectiveWidth() : this.effectiveHeight()])
    }
    this._theAxis.scale(this._scale)
  }

  drawAxis() {
    var axisG = this._g.select('g.axis')

    this.calculateAxisScale()

    if (axisG.empty()) {
      axisG = this._g.append('g').attr('class', 'axis')
    }

    transition(axisG, this.transitionDuration(), this.transitionDelay()).call(this._theAxis)
  }

  _doRender() {
    this.resetSvg()
    this._g = this.svg().append('g').attr('transform', `translate(${this.margins().left}, ${this.margins().top})`)
    this.drawChart()
    return this
  }

  /**
   * Gets or sets the axis type. The axis type can be any valid
   * {@link https://github.com/d3/d3-axis d3 axis}. The default is
   * axisBottom (a bottom axis).
   * @see {@link https://github.com/d3/d3-axis d3 axis}
   * @param {d3.type} [type]
   * @returns {string|dc.axisChart} no args: type string; args: axis chart
   */
  type(type) {
    if (!arguments.length) {
      return this._type
    }
    if (this.validAxisTypes.indexOf(type) !== -1) {
      const axis = { axisBottom, axisTop, axisRight, axisLeft }[type]
      this._theAxis = axis()
      this._type = type
    } else {
      console.error(type + ' is not a valid d3 axis type')
    }
    return this
  }

  /**
   * Gets or sets the axis scale. The axis scale can be any d3
   * {@link https://github.com/d3/d3-scale quantitative scale}.
   * @see {@link https://github.com/d3/d3-scale quantitative scale}
   * @param {d3.scale} [scale] any value d3 scale
   * @returns {d3.scale|dc.axisChart} no args: chart scale; args: axis chart
   */
  scale(scale) {
    if (!arguments.length) {
      return this._scale
    }
    this._scale = scale
    return this
  }

  /**
   * Get or set the elasticity on the axis. If this attribute is set to true,
   * then the axis will rescale to auto-fit the data range when filtered.
   * @param {Boolean} [elastic] any valid boolean
   * @returns {Boolean|dc.axisChart} no args: boolean; args: axis chart
   */
  elastic(elastic) {
    if (!arguments.length) {
      return this._elastic
    }
    this._elastic = elastic
    return this
  }

  /**
   * Get the axis for the axis chart instance.
   * See the {@link https://github.com/d3/d3-axis d3 axis object}
   * documention for more information.
   * @see {@link https://github.com/d3/d3-axis d3.axis}
   * @example
   * // customize axis tick format
   * chart.axis().tickFormat(function (v) {return v + '%';});
   * // customize axis tick values
   * chart.axis().tickValues([0, 100, 200, 300]);
   * @returns {d3.axis} d3 axis
   */
  axis() {
    return this._theAxis
  }

  drawChart() {
    this._axisData = this.data()
    this.drawAxis()
  }

  _doRedraw() {
    this.drawChart()
    return this
  }

  constructor(parent, chartGroup) {
    super(parent, chartGroup)
    this._minHeight = 0
    this._defaultHeightCalc = () => 24
    this.anchor(parent, chartGroup)
  }
}
