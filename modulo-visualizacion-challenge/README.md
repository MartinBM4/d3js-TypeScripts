# COVID-19 in italy

We focus on Italy affection by community displaying a map pinning affected locations and scaling that pin and map color according to the number of cases affected, something like

![](https://github.com/MartinBM4/d3js-TypeScripts/blob/master/modulo-visualizacion-challenge/challenge.gif)

# Steps:

- We starting with the example   !["Advanced Sample"](https://github.com/MartinBM4/d3js-TypeScripts/tree/master/modulo-visualizacion-advanced) . Lets clone the project and execute in the console:

```diff
npm install
```

- Replace the file spain.json to italy.json. 
  Italy JSON -> https://github.com/deldersveld/topojson/blob/master/countries/italy/italy-regions.json
  
- Modify the document _./src/communities.ts 
  Tips: Use the same name as the JSON.
  
```diff
export const latLongCommunities = [
  {
    name: "Abruzzo",
    long: 13.8865503,
    lat: 42.2131104
  },
  {
    name: "Apulia",
    long: 16.8518799,
    lat: 40.9584503
  },
  {
    name: "Basilicata",
    long: 15.9699878,
    lat: 40.6430766
  },
  {
    name: "Calabria",
    long: 16.3463791,
    lat: 39.3087714
  },
  {
    name: "Campania",
    long: 14.5516996,
    lat: 40.8660812
  },
  {
    name: "Emilia-Romagna",
    long: 11.2186396,
    lat: 44.5967607
  },
  {
    name: "Friuli-Venezia Giulia",
    long: 13.2371502,
    lat: 46.0693016
  },
  {
    name: "Lazio",
    long: 12.740503,
    lat: 41.809343
  },
  {
    name: "Liguria",
    long: 8.3964938,
    lat: 44.3167917
  },
  {
    name: "Lombardia",
    long: 9.8452433,
    lat: 45.4790671
  },
  {
    name: "Marche",
    long: 12.989615,
    lat: 43.5058744
  },
  {
    name: "Molise",
    long: 14.7520939,
    lat: 41.6738865
  },
  {
    name: "Piemonte",
    long: 7.5153885,
    lat: 45.0522366
  },
  {
    name: "Sardegna",
    long: 9.1191702,
    lat: 40.2305412
  },
  {
    name: "Sicily",
    long: 14.0153557,
    lat: 37.5999938
  },
  {
    name: "Toscana",
    long: 11.2923403,
    lat: 43.2980186
  },
  {
    name: "Trentino-Alto Adige",
    long: 11.1693296,
    lat: 46.4336662
  },
  {
    name: "Umbria",
    long: 12.6216211,
    lat: 42.938004
  },
  {
    name: "Valle d'Aosta",
    long: 7.4261866,
    lat: 45.7388878
  },
  {
    name: "Veneto",
    long: 11.80369,
    lat: 45.7030792
  }
];

```

- Modify the stats. We search the stats of the March 1st and the March 31st.
  Tips: Use the same name as the _./src/italy.json and the _./src/communities.ts .
```diff
export const Initstats = [
  {
    name: "Abruzzo",
    value: 5
  },
  {
    name: "Apulia",
    value: 3
  },
  {
    name: "Basilicata",
    value: 0
  },
  {
    name: "Calabria",
    value: 1
  },
  {
    name: "Campania",
    value: 17
  },
  {
    name: "Emilia-Romagna",
    value: 285
  },
  {
    name: "Friuli-Venezia Giulia",
    value: 6
  },
  {
    name: "Lazio",
    value: 6
  },
  {
    name: "Liguria",
    value: 25
  },
  {
    name: "Lombardia",
    value: 984
  },
  {
    name: "Marche",
    value: 25
  },
  {
    name: "Molise",
    value: 0
  },
  {
    name: "Piemonte",
    value: 49
  },
  {
    name: "Sardegna",
    value: 0
  },
  {
    name: "Sicily",
    value: 9
  },
  {
    name: "Toscana",
    value: 13
  },
  {
    name: "Trentino-Alto Adige",
    value: 0
  },
  {
    name: "Umbria",
    value: 2
  },
  {
    name: "Valle d'Aosta",
    value: 0
  },
  {
    name: "Veneto",
    value: 263
  }
];



export const Finalstats = [
  {
    name: "Abruzzo",
    value: 689
  },
  {
    name: "Apulia",
    value: 1005
  },
  {
    name: "Basilicata",
    value: 92
  },
  {
    name: "Calabria",
    value: 319
  },
  {
    name: "Campania",
    value: 1101
  },
  {
    name: "Emilia-Romagna",
    value: 9254
  },
  {
    name: "Friuli-Venezia Giulia",
    value: 992
  },
  {
    name: "Lazio",
    value: 1728
  },
  {
    name: "Liguria",
    value: 2116
  },
  {
    name: "Lombardia",
    value: 30703
  },
  {
    name: "Marche",
    value: 2736
  },
  {
    name: "Molise",
    value: 73
  },
  {
    name: "Piemonte",
    value: 5515
  },
  {
    name: "Sardegna",
    value: 421
  },
  {
    name: "Sicily",
    value: 846
  },
  {
    name: "Toscana",
    value: 2699
  },
  {
    name: "Trentino-Alto Adige",
    value: 1110
  },
  {
    name: "Umbria",
    value: 648
  },
  {
    name: "Valle d'Aosta",
    value: 400
  },
  {
    name: "Veneto",
    value: 5948
  }
];

```

- The import of the _./src/index.ts change:
```typescript
import * as d3 from "d3";
import * as topojson from "topojson-client";
const italyjson = require("./italy.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { Initstats } from "./stats";
import { Finalstats } from "./stats";
```

- Care with the projection because this change:
```diff
const aProjection = d3.geoMercator()
.center([0, 41])
.rotate([347, 0])
.scale(2900)
.translate([500, 500]);
```

- And the topojson:
```diff
const geojson = topojson.feature(italyjson, italyjson.objects.ITA_adm1);
```

- We use another color gradient.

```diff
var color = d3
.scaleThreshold<number, string>()
.domain([0,20,30,50,250,500,1000,1500,2000,5000,7500,10000,15000,20000,25000])
.range([
  "#BCEBFF",
  "#88D8FA",
  "#5FC9F6",
  "#34A9DB",
  "#1C8FC1",
  "#10739E",
  "#0A648B",
  "#0A648B",
  "#054C6A",
  "#053F58",
  "#033449",
  "#032736"

]);
```




