# Canada Province Chart

## Installation

```bash
npm install canada-province-chart
```


## API

Data must be encoded against the following province codes:

```
abroad
na
yt
nt
nu
bc
ab
sk
mb
on
onlessncr
qc
qclessncr
nl
ncr
nb
ns
pe
```

We call this type `ProvCode`. Note that the use of `onlessncr`, `qclessncr` or  `ncr` cannot be combined with the use of `on` or `qc`.

Data must be provided in a `Array<{value:number, provCode:ProvCode}>` format. Let's call this `{value:number, provCode:ProvCode}` type `Datum`

| property          | required  | type                                                                                | example                                                                                 |
|---------------|---|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| data          | yes  | <code> Array<Datum> </code>               |  <code> [{ provCode: "ab", value: 200 },<br/>{ provCode: "sk", value: 300 }] </code> |
| htmlForLabel  | yes  | <code> (datum?: Datum, provCode: ProvCode) => html string </code>                                   | <code> (datum, provCode) => datum && \`\<div>${datum.value.toFixed(2)}\</div>` </code>                  |
| colorScale    | yes  | <code> (datum?: Datum, provCode: ProvCode) => color string </code> <br/>Only SVG-compatible colors, e.g. not hsla          | <code> (datum, provCode) => datum ? interpolateBlues(datum.value/MAX_VALUE) : "#ccc" </code> |
| lang          | yes  | <code>"en" \| "fr"</code>                                                           | <code>"en"</code>                                                                       |
| onMouseEnter | no  | <code> (datum?: Datum, provCode: ProvCode) => void </code>                                   
| onMouseLeave | no  | <code> (datum?: Datum, provCode: ProvCode) => void </code>                                   
| onClick | no  | <code> (datum?: Datum, provCode: ProvCode) => void </code>                                   



You can skip our react layer and call our d3 layer, which has an identical API : `CanadaD3Viz(container: HTMLElement, config: Props)` 

## Things to keep in mind

- The D3 layer does not partially update markup appropriately when data changes. It's recommended to wipe the container's innerHTML on each re-render (this is what our react layer does).
- The react API is very sensitive to prop changes. Make sure you `useMemo` or `useCallback` all relevant props or the chart rendering code will be called excessively.
- The color-scale, html-label and event callbacks all take `(datum: Datum, provCode: ProvCode)` as arguments. For regions without data, the first argument will be undefined. The second argument gives you flexibility on how you color, label or respond to events for regions without any corresponding data.
- Two special "provinces", Abroad and Not-available are only shown when they have data available.
- We don't currently support styling the label containers
- We don't support tooltips
