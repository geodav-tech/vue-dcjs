### \<dc-pie-chart>
- [Home](../../../#available-components)

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin]('../../mixins/#group)

### options
| minRadius | number | 0 | ensure the pie chart is at least this big |
| maxRadius | number | Infinity | ensure that the pie chart is not any bigger than this |
| innerRadius | number, string | 0 | make the chart a donut. supports either exactly in px or as `x%` | 
| slicesCap | number | 10 | the maximum number of slices. any other groups are plotted into 'others' |
| othersLabel | number | 'others' | label on the 'others' |
| useImprovedLabels | number | true | use a custom positioning/wrapping function to display labels |
| labelWrapSeparator | number | ';|;' | separate key/value with this to split key/value in labels |

### Examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- hours worked by team with improved labels and wrapping
```html
<dc-pie-chart
	style="flex: 1"
	:ndx="ndx"
	:options="{
		name: 'TeamPieChart',
		title: d =>`${d.key}: ${d.value.toFixed(2)} hours`,
		slicesCap: 6,
		maxRadius: 300,
		label: d => `${d.key};|;${d.value.toFixed(0)}`
	}"
	dimension-constructor="team"
	reducer="hours"
/>
```
