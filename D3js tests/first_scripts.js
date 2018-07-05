
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
    change: 0,
    scl_change: 0
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
    val: 20,
    scl_val: 0.2,
    change: 0,
    scl_change: 0
},
{
    name: "Title E",
    val: 40,
    scl_val: 0.4,
    change: 60,
    scl_change: 0.6
},
{
    name: "Title F",
    val: 10,
    scl_val: 0.1,
    change: 0,
    scl_change: 0
}];


// -- Establishing margins and canvas bounds -- 
var margin = {
        top: 20, 
        right: 20, 
        bottom: 80, 
        left: 20
    },
    width = 450 - margin.right - margin.left,
    height = 300- margin.top - margin.bottom;

// -- Adding scales based on canvas -- 
var xScale = d3.scaleBand()
        .domain(testData.map(function(d){return d.name;}))
        .rangeRound([0, width])
        .paddingInner(0.1),
    yScale = d3.scaleLinear()
        .domain([0,1])
        .rangeRound([height, 0]);

var svg = d3.select("body")
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.right +')'); 

// -- Drawing background rectangles -- 
svg.selectAll("rect")
    .data(testData)
    .enter()
    .append("rect")
    .attr("class","bg_bar")
    .attr('x',function(d) {return xScale(d.name);})
    .attr('y',0)
    .attr("height",function(d){return yScale(0)})
    .attr("width",xScale.bandwidth())
    .style("fill","white");

// -- Drawing current level --
svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","line_lvl")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.25})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.75})
    .attr("y1",function(d){return yScale(d.scl_val)})
    .attr("y2",function(d){return yScale(d.scl_val)})
    .attr("stroke", "rgb(30,61,122)")
    .attr("stroke-width", 2)
    .attr("stroke-linecap","round")
    .attr("fill", "none");

svg.selectAll('text')
    .data(testData)
    .enter()
    .append('text')
    .text(function(d){return d.val;})
    .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("y", function(d){return yScale(d.scl_val)+12;})
    .attr("font-family", 'sans-serif')
    .attr("font-size", '12px')
    .attr("font-weight", 'bold')
    .attr("fill",'rgb(30,61,122)')
    .attr("text-anchor",'middle');


// -- Drawing desired level -- 
svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","line_goal","box")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.35})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.65})
    .attr("y1",function(d){return yScale(d.scl_change)})
    .attr("y2",function(d){return yScale(d.scl_change)})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.scl_change != 0) {return 2;}
        else {return 0}})
    .attr("stroke-linecap","round")
    .attr("fill", "none");

svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","box")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.65})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.65})
    .attr("y1",function(d){return yScale(d.scl_val)-1})
    .attr("y2",function(d){return yScale(d.scl_change)})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.scl_change != 0) {return 2;}
        else {return 0}})
    .attr("fill", "none");

svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","box")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.35})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.35})
    .attr("y1",function(d){return yScale(d.scl_val)-1})
    .attr("y2",function(d){return yScale(d.scl_change)})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.scl_change != 0) {return 2;}
        else {return 0}})
    .attr("fill", "none");


svg.append("g")
    .selectAll('text')
    .data(testData)
    .enter()
    .append('text')
    .text(function(d){return d.change;})
    .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("y", function(d){return yScale(d.scl_change)-3;})
    .attr("font-family", 'sans-serif')
    .attr("font-size", '12px')
    .attr("font-weight", 'bold')
    .attr("fill", function(d) {
        if(d.scl_change != 0) {return "red";}
        else {return "None"}})
    .attr("text-anchor",'middle');

// -- Drawing Arrows -- 

// svg.append("g")
//     .selectAll("line")
//     .data(testData)
//     .enter()
//     .append("line")
//     .attr("class","arrow")
//     .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()/2})
//     .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()/2})
//     .attr("y1",function(d){return yScale(d.scl_val)-1})
//     .attr("y2",function(d){return yScale(d.scl_change)})
//     .attr("stroke", "red")
//     .attr("stroke-width", function(d) {
//         if(d.scl_change != 0) {return 2;}
//         else {return 0}})
//     .attr("fill", "none");

svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","arrow")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.42})
    .attr("y1",function(d){return yScale((d.scl_val+d.scl_change)/2) - 3})
    .attr("y2",function(d){return yScale((d.scl_val+d.scl_change)/2) + 3})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.scl_change != 0) {return 2;}
        else {return 0}})
    .attr("stroke-linecap","round")
    .attr("fill", "none");

svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","arrow")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.58})
    .attr("y1",function(d){return yScale((d.scl_val+d.scl_change)/2) - 3})
    .attr("y2",function(d){return yScale((d.scl_val+d.scl_change)/2) + 3})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.scl_change != 0) {return 2;}
        else {return 0}})
    .attr("stroke-linecap","round")
    .attr("fill", "none");

// svg.append("g")
//     .selectAll('text')
//     .data(testData)
//     .enter()
//     .append('text')
//     .text(function(d){return d.name;})
//     .attr("class","labels")
//     .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
//     .attr("y", function(d){return yScale(0)+15;})
//     .attr("font-family", 'sans-serif')
//     .attr("font-size", '12px')
//     .attr("font-weight", 'bold')
//     .attr("fill", "white")
//     .attr("text-anchor",'middle');

// svg.append("g")
//     .attr("class","axis")
//     .attr("transform","rotate(60)")
//     .call(xAxis);

var xAxis = d3.axisBottom().scale(xScale);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dy", "1em")
        .attr("dx", "3em")
        .attr("transform","rotate(40)");



