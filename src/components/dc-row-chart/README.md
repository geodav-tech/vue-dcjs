# \<dc-row-chart>
- [Home]('https://github.com/geodav-tech/vue-dcjs#available-components')

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin](../../mixins/#group)

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elastic | boolean | true | `dc.chart.elasticX()` does the chart x axis scale dynamically when other dimensions are filtered? |
| scrollable | boolean | true | add a custom axis chart and make the main chart area scrollable with `scrollHeight` |
| minHeight | number | 150 | how tall (px) is the default chart when there are not enough entries to fill the space |
| barHeight | number | 20 | the ideal height of each bar when there are enough entries to fill the space provided |
| axisChartHeight | number | 50 | how tall the x axis chart is when scrollable is true. make this number bigger if you have large text on ticks |
| scrollHeight | number, string | '200px' | how tall is the scrollable chart area when scrollable is true. accepts any css string. e.g. `100vh` |
| scrollBarPadding | number | 8 | if scrollable, should we accommodate the right margin for the scroll bar we expect to see. adds right margin (px) when scrollable |


### Examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- Hours worked by user
	* uses a custom dimension constructor and label accessor to keep the name without a custom reduce
```html
<dc-row-chart
	:ndx="ndx"
	:options="{
		label => d.key.split('.').slice(1).join('.')
	}"
	:dimensionConstructor="d => `${d.user_id}.${d.name}`"
	reducer="hours"
/>
```
