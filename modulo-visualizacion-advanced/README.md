# Spain COVID-19 Visualisation

In below map, infected cases are shown by color and circles. With button, it can be seen evaluation of confirmed cases in Spain.

![](https://github.com/MartinBM4/d3js-TypeScripts/blob/master/modulo-visualizacion-advanced/advanced.gif)

# Steps:

- We starting with the example   !["d3js-mandatory"](https://github.com/MartinBM4/d3js-TypeScripts/tree/master/modulo-visualizacion-mandatory).

- We will clone the project and execute:
```diff
npm install
```
in the console.

- Define the color gradient.

```diff
var color = d3
.scaleThreshold<number, string>()
.domain([5, 20, 50, 100, 500, 2000, 3000])
.range([
  "#E6F4F1",
  "#B5E6FD",
  "#8ED6F8",
  "#5FA9C9",
  "#2D7E9D",
  "#005572",
  "#00304A"
]);
```

- Calculate the maximum number of infected, calculate de radius of the circle according to the number of inffected and assign a color to a region.

```typescript
const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );

  const affectedRadiusScale = d3
    .scaleQuantile()
    .domain([0, maxAffected])
    .range([4, 15, 27, 28, 30, 40]);

  const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
    const entry = data.find(item => item.name === comunidad);

    return entry ? affectedRadiusScale(entry.value) : 0;

  };


  const assignRegionBackgroundColor = (name: string) => {
    const item = data.find(
      item => item.name === name
    );

    if (item) {
      console.log(item.value);
    }
    return item ? color(item.value) : color(0);
  };
```

- The last step is apply the transition to the colour of the map.

```typescript
svg
    .selectAll("path")
    .data(geojson["features"])
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("fill", d => assignRegionBackgroundColor(d["properties"]["NAME_1"]))
    .attr("d", geoPath as any)
    .merge(svg.selectAll("path") as any)
    .transition()
    .duration(500)
    .attr("fill", d => assignRegionBackgroundColor(d["properties"]["NAME_1"]));

```
