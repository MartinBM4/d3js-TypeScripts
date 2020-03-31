import * as d3 from "d3";
import * as topojson from "topojson-client";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { Initstats } from "./stats";
import { Finalstats } from "./stats";


const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #f4f4f4");


const aProjection = d3Composite
  .geoConicConformalSpain()
  // Let's make the map bigger to fit in our resolution
  .scale(3300)
  // Let's center the map
  .translate([500, 400]);


const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(spainjson, spainjson.objects.ESP_adm1);


document
  .getElementById("initstats")
  .addEventListener("click", function handleinitstats() {
    updateMap(Initstats);
  });

document
  .getElementById("finalstats")
  .addEventListener("click", function handlefinalstats() {
    updateMap(Finalstats);
  });


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


const updateMap = (data: any[]) => {

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
};


updateMap(Initstats);