import * as d3 from "d3";
import * as topojson from "topojson-client";
const italyjson = require("./italy.json");
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


const aProjection = d3.geoMercator()
.center([0, 41])
.rotate([347, 0])
.scale(2900)
.translate([500, 500]);

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(italyjson, italyjson.objects.ITA_adm1);


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



const updateMap = (data: any[]) => {

  const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );

  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .range([3,40]);

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