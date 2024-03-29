# base-chart
- [Home]('https://github.com/geodav-tech/vue-dcjs#available-components')
Provides default functionality for any type of chart

### props
| Name | Type | Default | Description | Required |
| --- | --- | --- | --- | --- |
| ndx | crossfilter(data) | | crossfilter object. the result of `this.$crossfilter(dataArray)` | true |
| name | string | | give this chart a `.name` that can be used to find charts in the registry easier, or used in combination with the `<dc-checklist>` | false |,
| options | object | combined with the defaultOptions. unique to each chart | false |

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disposeDimension | boolean | true | dispose of the dimension in beforeDestroy(). set to false if sharing dimensions between charts |
| render | boolean | true | render this chart on startup. set to false to cancel startup render |
| valueAccessor | string, ({ key, value }) => value | d => d.value | what is the value of the reduction result |
| keyAccessor | string, ({ key, value }) => key | d => d.key | what is the key the chart should use |
| margins | number, { top?: number, left?: number, bottom?: number, right?: number} | { top: 30, left: 30, right: 30, bottom: 30} | the spacing around each side of the chart body. pass a single number for all sides |
| title | string, ({ key, value }) => string | d => \`${d.key}: ${d.value}\` | hoverable title from group |
| label | string, ({ key, value }) => string | d => d.key | rendered title on top of bars/slices/etc |
| onCreate | (evt, chart) => void | | pass a callback function to make adjustments to the chart before being rendered |
| onFilter | (chart, filters) => void | | pass a callback function for this.chart.on('filtered', onFilter) |

### methods
`reset(): void`
- clears all filters in the chart if exists

`drawChart(): void`
- overarching create and draw function. creates the chart and renders it (if options.render)

`createChart(): void`
- must be called after `this.chart = new this.$dc.SomeChart(``#chart-${this._uid}``)`
- adds the default functionality provided by options above.
- should be called in parent charts via `this.$super(BaseChartMixin).createChart()` within the parent `createChart()` function

`renderChart(): Promise(chart)`
- wrapper that fires the pre-render and post-render hook for parents and can be used to chain functions on startup 

`render(): void`
- what happens during the render step. multi-chart components will override this function rendering both charts in this step.

`addChartExtras(): void`
- adds `chart.name` or `chart.vueOptions` to the chart object for checklist/parent components to use

# dimension
handles dimension creation for charts

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| dimensionConstructor | string, (d) => key | d => d | how do we create the dimension. can pass nested strings like `person.age` to use `d => d.person.age` or pass a function that will give use the key for the dimension. e.g. `d => d.team_id` |
| dimensionIsArray | boolean | false | if the key is an array, pass this property. |

### methods
`createDimension(): crossfilter.dimension`
- assumes `this.ndx` is defined and is a crossfilter instance
- use the current props as options to create the dimension


# group
handles `dimension.group()` or `dimension.groupAll()` based functions. Includes some extras for fake-grouping when needed.

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| reducer | string, (d => value), { add: (p, v) => p, remove: (p, v) => p, init: () => p } | defines how the dimension is reduced. provide a string or a function to use `reduceSum`, provide { add, remove, init } to use a full reducer |
| groupOptions | { order?: d => orderValue, orderNatural?: boolean (not compatable with order) } | add any options to the group. currently only supports ordering |

### methods
`createGroup(dimension, groupAll = false): group`
- uses the current options to group the dimension and reduce it.
- emits it to parents as `group-created`

`ordinalToLinear(group, valueFunc, isGroupAll = false): group`
- transforms an ordinal group (having string keys) to a linear group (having integer keys)
- used with the scrollable bar chart for linear focus


# axis

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| axisOptions | object | | x,y axisOptions specified below. Can also be passed via `options.axisOptions` | 

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| x | scale | | scale to apply to `this.chart.x()` e.g. `this.$d3.scaleTime().domain(['2021-01-01', '2021-01-31'])` |
| y | scale | | scale to apply to `this.chart.y()` |
| ticks | number | | the count of ticks to show |
| format | string, number, (d) => value | `axis.tickFormat()` if string `d3.format(string)`, if number `d3.format(,.${number}f)`, if function just call function |
| values | number[], string[] | | apply `axis.tickValues(values)` if you wish to show only specific values, this is the best option |
| size | number | 6 | apply `axis.tickSize(size)` changes the size in px of the ticks on this axis |
| autoTicks | bool | false | apply automatic number of ticks (up to 10 or a maximum passed to ticks) based on the value. e.g. if the max value is 2, there will be 2 ticks instead of 10 |


### methods
`applyAxisOptions(): void`
apply the options specified in either the `axisOptions` prop or `computedOptions.axisOptions`



# legend
Adds legend capability and options to any chart that extends this mixin

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| legend | boolean | | set true to show legend, or use some form of legendOptions.legend or legendOptions.showLegend |
| legendOptions | object | | legendOptions as a property or use options.legendOptions |

### option
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| autoWidth | boolean | false | automatically adjust the width of the legend items using dc.legend.autoWidth |
| itemWidth | number | | manually set the width of each legendItem |
| gap | number | | manually adjust the gap between legend items |
| highlightSelected | string | | highlight this key in the legend |
| horizontal | boolean | false | make this legend horizontal instead of vertical |
| itemHeight | number | | height of each legend item |
| keyboardAccessible | boolean | false | individual legend items will be focusable from keyboard by pressing enter or space will behave as if clicked on. |
| legendText | d => text | group name | sets the function which will display the legend item text. defaults to the name of the group |
| legendWidth | number | 500 | sets the maximum width of the horizontal legend |
| maxItems | number | | sets the maximum number of legend items to display |
| x | number | 0 | sets the x position of the legend |
| y | number | 0 | sets the y position of the legend |

### methods
`applyLegendOptions(): void`
use during createChart after chart creation and groups have been applied. Adds the legend with appropriate options to the chart (if applicable).

