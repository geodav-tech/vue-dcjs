### \<dc-number-display>
- [Home]('https://github.com/geodav-tech/vue-dcjs#available-components')

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [GroupMixin](../../mixins/#group)

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| html | { one: string, some: string, none: string } | | how to display the chart. use `%number` to interpolate the value into the string |
| singular | string | | if no `html` what is the noun for one of the result |
| plural | string | singular + 's' | if no `html` what is the noun for multiple of the result. defaults to singular + 's' when singular is defined. |

### note:
- This chart's valueAccessor prop receives the total unfiltered value (upon chart creation)
	- e.g. instead of (d, i) => value, you will get (d, i, unfilteredTotal) => value

### examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- total number of hours worked
```html
<dc-number-display
  :ndx="ndx"
  reducer="hours"
  :options="{
    singular: 'hour',
    formatNumber: ',.1f'
  }"
/>
```

- percentage of total hours that remain across all filters in ndx
```html
<dc-number-display
  :ndx="ndx"
  reducer="hours"
  :options="{
    html: { some: '%number hours worked', none: '%number hours worked', one: '%number hours worked' },
    formatNumber: ',.1%',
    valueAccessor: (d, i, total) => d / (total || 1)
  }"
/>
```

