### \<dc-bar-chart>
- [Home]('https://github.com/geodav-tech/vue-dcjs#available-components')

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin](../../mixins/#group)
- [AxisMixin](../../mixins/#axis)

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elastic | boolean | true | `dc.chart.elasticY()` does the chart y axis scale dynamically when other dimensions are filtered? |
| renderArea | boolean | true | fills the area under the line |
| limitTicksToNumDays | boolean | true | if there are less than (options.xAxis.ticks || 10) dates, limit the number of ticks to the number of days |
| useD3TimeDay | boolean | true | default to using `d3.timeDay(dimension-constructor)` when constructing the dimension |
| snapDateCalculation | boolean | true | snap the top/bottom to the start, end of a day when calculating the number of days and domain |
| useUtcSnapping | boolean | false | use `setUTCHours` instead of `setHours` when snapping to start/end of domain |
| fakeGroupingSettings | { startDate: dateString, endDate: dateString, fillValue: object || function} | fill out any missing dates between start and end (inclusive) with fillValue. function form passes the date the value is for |

### note
Unlike other charts, this chart can default the dimension constructor to `dc.timeDay(dc.pluck('date')(d))`

### examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- Hours worked by date
```html
<dc-date-chart
	:ndx="ndx"
	reducer="hours"
/>
/>
```
