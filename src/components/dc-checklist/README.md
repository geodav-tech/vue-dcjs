### <dc-checklist>
- [Home](../../../#available-components)

### Options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| chart | string, dc-chart | | provide chart instance, or name of chart (chart must be given a name in it's options or as a prop) to connect to |
| searchable | boolean | true | enable the search box |
| search | string | '' | the value of the search input to be used when overwriting the search input binding |
| othersLimit | number | | use when multiple values are grouped into an 'others' category like in pie chart. can also read the `options.slicesCap` from the chart if present |
| digits | number | | limit the digits shown in the value of each item |
| maxHeight | number | | limit the height of the checklist and make the component scrollable |
| othersLabel | string | 'others' | if there is an 'others' category, what is it's key |

### Examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

The checklist requires another chart to be used, but it can be provided a matching name if the chart is given a name.
below is an example of a checklist and a pie chart hooked up together
```html
<div style="display: flex">
  <dc-checklist
    style="flex: 1"
    chart="TeamPieChart"
    :digits="0"
    :max-height="300"
  />
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
</div>

```