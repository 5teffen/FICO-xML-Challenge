
var testData = [
{
    name: "Title A",
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 70,
    scl_change: 0.7
},
{
    name: "Title B",
    val: 30,
    scl_val: 0.3,
    change: 70,
    scl_change: 0.7
},
{
    name: "Title C",
    val: 70,
    scl_val: 0.7,
    change: 80,
    scl_change: 0.8
},
{
    name: "Title D",
    val: 10,
    scl_val: 0.1,
    change: 15,
    scl_change: 0.15
}];



// var svg = d3.select("svg"),
//     margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = +svg.attr("width") - margin.left - margin.right,
//     height = +svg.attr("height") - margin.top - margin.bottom;

// var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
// 	y = d3.scaleLinear().rangeRound([height, 0]);

// var g = svg.append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var data = []
// d3.tsv("data.tsv", function(d) {
//   d.frequency = +d.frequency;
//   return d;
// }, function(error, data) {
//   if (error) throw error;

// 	x.domain(data.map(function(d) { return d.letter; }));
//   y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

// 	g.append("g")
//     	.attr("class", "axis axis--x")
//     	.attr("transform", "translate(0," + height + ")")
//      	.call(d3.axisBottom(x));

//   	g.append("g")
//       	.attr("class", "axis axis--y")
//       	.call(d3.axisLeft(y).ticks(10, "%"))
//     	 .append("text")
//      	  .attr("transform", "rotate(-90)")
//       	.attr("y", 6)
//       	.attr("dy", "0.71em")
//       	.attr("text-anchor", "end")
//       	.text("Frequency");

//   	g.selectAll(".bar")
//     	 .data(data)
//     	 .enter().append("rect")
//       	.attr("class", "bar")
//       	.attr("x", function(d) { return x(d.letter); })
//       	.attr("y", function(d) { return y(d.frequency); })
//       	.attr("width", x.bandwidth())
//       	.attr("height", function(d) { return height - y(d.frequency); });
// });