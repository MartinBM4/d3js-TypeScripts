# Pinning locations + scale (COVID-19)

Our boss liked a lot the map we have developed, now he wants to focus on Spain affection by City, he wants to
display a map pinning affected locations and scaling that pin according the number of cases affected, something like:

![Alt text](https://github.com/MartinBM4/d3js-TypeScripts/blob/master/modulo-visualizacion-mandatory/mandatory.gif)

codesandbox: https://codesandbox.io/s/hopeful-ellis-rlczx

We have to face three challenges here:

- Place pins on a map based on location.
- Scale pin radius based on affected number.
- Spain got canary island that is a territory placed far away, we need to cropt that islands and paste them in a visible
  place in the map.
- Create buttons to show different data periods.

# First step:

- We will take as starting example _00-render-map-hover_, let's copy the content from that folder and execute _npm install_.

```bash
npm install
```

- This time we will Spain topojson info: https://github.com/deldersveld/topojson/blob/master/countries/spain/spain-comunidad-with-canary-islands.json

Let's copy it under the following route _./src/spain.json_

- Now instead of importing _europe.json_ we will import _spain.json_.

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
- const europejson = require("./europe.json");
+ const spainjson = require("./spain.json");
```

- Let's build the spain map instead of europe:

_./src/index.ts_

```diff
const geojson = topojson.feature(
+  spainjson,
-  europejson,
+  spainjson.objects.ESP_adm1
-  europejson.objects.continent_Europe_subunits
);
```

> How do we know that we have to use _spainjson.objects.ESP_adm1_ just by examining
> the _spain.json_ file and by debugging and inspecting what's inside _spainjson_ object.

- If we run the project, we will get some bitter-sweet feelings, we can see a map of spain,
  but it's too smal, and on the other hand, canary islands are shown far away (that's normal,
  but usually in maps these islands are relocated).

- Let's start by adding the right size to be displayed in our screen.

_./src/index.ts_

```diff
const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);
```

- If we run the project we can check that the map is now renders in a proper size and position, let's
  go for the next challenge, we want to reposition Canary Islands, in order to do that we can build a
  map projection that positions that piece of land in another place, for instance for the USA you can
  find Albers USA projection: https://bl.ocks.org/mbostock/2869946, there's a great project created by
  [Roger Veciana](https://github.com/rveciana) that implements a lot of projections for several
  maps:

  - [Project site](https://geoexamples.com/d3-composite-projections/)
  - [Github project](https://github.com/rveciana/d3-composite-projections)

Let's install the library that contains this projections:

```bash
npm install d3-composite-projections --save
```

- Let's import it in our _index.ts_ (we will use require since we don't have typings).

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
```

- Let's change the projection we are using (we will need to tweak as well the
  _scale_ and _translate_ values):

_./index.ts_

```diff
const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);
```

- If we run the project (npm start in the console and use chrome with http://localhost:1324), voila ! we got the map just the way we want it.

# Second step:
- We will put the buttons on the screen to be able to modify the values.
_./src/index.html

```diff
<body>
  <div>
    <button id="initstats">Caso inicial</button>
    <button id="finalstats">Caso final</button>
  </div>
  <script src="./index.ts"></script>
</body>
```
You can see in the Localhost (navegator) two buttons at the top left of the sreen.


- Now we will write a function in _./src/index.ts to modify the infected values that we have in _./src/stats.ts
  Tips: use the same name as in _./src/stats.ts

```diff
document
  .getElementById("initstats")
  .addEventListener("click", function handleResultsBase() {
    updateMap(Initstats);
  });
document
  .getElementById("finalstats")
  .addEventListener("click", function handleResults22Marzo() {
    updateMap(Finalstats);
  });
```


# Third step: 

- Now we want to display a circle in the middle of each community (comunidad autónoma),
  we have collected the latitude and longitude for each community, let's add them to our
  project.

_./src/communities.ts_

```typescript
export const latLongCommunities = [
  {
    name: "Madrid",
    long: -3.70256,
    lat: 40.4165
  },
  {
    name: "Andalucía",
    long: -4.5,
    lat: 37.6
  },
  {
    name: "Valencia",
    long: -0.37739,
    lat: 39.45975
  },
  {
    name: "Murcia",
    long: -1.13004,
    lat: 37.98704
  },
  {
    name: "Extremadura",
    long: -6.16667,
    lat: 39.16667
  },
  {
    name: "Cataluña",
    long: 1.86768,
    lat: 41.82046
  },
  {
    name: "País Vasco",
    long: -2.75,
    lat: 43.0
  },
  {
    name: "Cantabria",
    long: -4.03333,
    lat: 43.2
  },
  {
    name: "Asturias",
    long: -5.86112,
    lat: 43.36662
  },
  {
    name: "Galicia",
    long: -7.86621,
    lat: 42.75508
  },
  {
    name: "Aragón",
    long: -1.0,
    lat: 41.0
  },
  {
    name: "Castilla y León",
    long: -4.45,
    lat: 41.383333
  },
  {
    name: "Castilla La Mancha",
    long: -3.000033,
    lat: 39.500011
  },
  {
    name: "Islas Canarias",
    long: -15.5,
    lat: 28.0
  },
  {
    name: "Islas Baleares",
    long: 2.52136,
    lat: 39.18969
  },
  {
    name: "La Rioja",
    long: -2.44373,
    lat: 42.4650
  },
  {
    name: "Navarra",
    long: -1.676069,
    lat: 42.695391
  }
];
```

- Let's import it:

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
+ import { latLongCommunities } from "./communities";
```

- And let's append at the bottom of the _index_ file a
  code to render a circle on top of each community:

_./src/index.ts_

```typescript
const circles = svg.selectAll("circle");

circles
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);
```

- Nice ! we got an spot on top of each community, now is time to
  make this spot size relative to the number of affected cases per community.



# Fourth  step:

- We will add the stats that we need to display (affected persons per community):

_./stats.ts_

```typescript
export const stats = [
  {
    name: "Madrid",
    value: 174
  },
  {
    name: "La Rioja",
    value: 39
  },
  {
    name: "Andalucía",
    value: 34
  },
  {
    name: "Cataluña",
    value: 24
  },
  {
    name: "Valencia",
    value: 30
  },
  {
    name: "Murcia",
    value: 0
  },
  {
    name: "Extremadura",
    value: 6
  },
  {
    name: "Castilla La Mancha",
    value: 16
  },
  {
    name: "País Vasco",
    value: 45
  },
  {
    name: "Cantabria",
    value: 10
  },
  {
    name: "Asturias",
    value: 5
  },
  {
    name: "Galicia",
    value: 3
  },
  {
    name: "Aragón",
    value: 11
  },
  {
    name: "Castilla y León",
    value: 19
  },
  {
    name: "Islas Canarias",
    value: 18
  },
  {
    name: "Islas Baleares",
    value: 6
  }
];
```

And the values of the current date:

```typescript
export const Finalstats = [
  {
    name: "Madrid",
    value: 9700
  },
  {
    name: "La Rioja",
    value: 655
  },
  {
    name: "Andalucía",
    value: 1725
  },
  {
    name: "Cataluña",
    value: 4700
  },
  {
    name: "Valencia",
    value: 1603
  },
  {
    name: "Murcia",
    value: 301
  },
  {
    name: "Extremadura",
    value: 387
  },
  {
    name: "Castilla La Mancha",
    value: 1822
  },
  {
    name: "País Vasco",
    value: 2089
  },
  {
    name: "Cantabria",
    value: 285
  },
  {
    name: "Asturias",
    value: 545
  },
  {
    name: "Galicia",
    value: 915
  },
  {
    name: "Aragón",
    value: 533
  },
  {
    name: "Castilla y León",
    value: 1741
  },
  {
    name: "Islas Canarias",
    value: 415
  },
  {
    name: "Islas Baleares",
    value: 331
  },
  {
    name: "Navarra",
    value: 795
  }
];
```

- Let's import it into our index.ts

_./src/index.ts_

```diff
import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
+ import { stats } from "./stats";
```

- Let's calculate the maximum number of affected of all communities:

_./src/index.ts_

```typescript
const maxAffected = stats.reduce(
  (max, item) => (item.value > max ? item.value : max),
  0
);
```

- Let's create an scale to map affected to radius size.

_./src/index.ts_

```typescript
const affectedRadiusScale = d3
  .scaleLinear()
  .domain([0, maxAffected])
  .range([0, 50]); // 50 pixel max radius, we could calculate it relative to width and height
```

- Let's create a helper function to glue the community name with the affected cases.
  Tips: Use the same name of the cities for the documents: _./src/stats.ts , _./src/communities.ts & _./src/spain.json
        or you will need a mapping function.
      
_./src/index.ts_

```typescript
const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
  const entry = stats.find(item => item.name === comunidad);

  return entry ? affectedRadiusScale(entry.value) : 0;
};
```

- Let's tie it up with the circle rendering code that we created above:

_./src/index.ts_

```diff
svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
-  .attr("r", 15)
+  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);
```

- If we run the example we can check that know circles are shonw in the right size:

- Black circles are ugly let's add some styles, we will just use a red background and
  add some transparency to let the user see the spot and the map under that spot.

_./src/map.css_

```diff
.country {
  stroke-width: 1;
  stroke: #2f4858;
  fill: #008c86;
}

.selected-country {
  stroke-width: 1;
  stroke: #bc5b40;
  fill: #f88f70;
}

+ .affected-marker {
+  stroke-width: 1;
+  stroke: #bc5b40;
+  fill: #f88f70;
+  fill-opacity: 0.7;
+ }
```

- Let's apply this style to the black circles that we are rendering:

_./src/index.ts_

```diff
svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
+  .attr("class", "affected-marker")
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);
```

- In addition to this, we have to modify the circles with respect to the pressed buttons.
```diff
  const circles = svg.selectAll("circle");

  circles
    .data(latLongCommunities)
    .enter()
    .append("circle")
    .attr("class", "affected-marker")
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
    .attr("cx", d => aProjection([d.long, d.lat])[0])
    .attr("cy", d => aProjection([d.long, d.lat])[1])

    .merge(circles as any)
    .transition()
    .duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name));
```

## Et voilà!
