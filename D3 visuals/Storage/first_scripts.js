
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


    .data(testData.filter(function(d){
        if (d.scl_val > 1){
            console.log(10)
            return d;
        }
        }))



var percent = 0.5;
var testData = [
{
    name: "External Risk Estimate",
    anch: 1,
    incr: -3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    anch: 1,
    incr: 3,
    val: 30,
    scl_val: 0.3,
    change: 30,
    scl_change: 0.3
},
{
    name: "Months Since Last Trade Open",
    anch: 0,
    incr: 3,
    val: 70,
    scl_val: 0.7,
    change: 80,
    scl_change: 0.8
},
{
    name: "Average Months in File",
    anch: 1,
    incr: 3,
    val: 0,
    scl_val: 0,
    change: 20,
    scl_change: 0.2
},
{
    name: "Satisfactory Trades",
    anch: 0,
    incr: 3,
    val: 150,
    scl_val: 1.5,
    change: 60,
    scl_change: 0.6
},
{
    name: "Trades 60+ Ever",
    anch: 0,
    incr: 3,
    val: 10,
    scl_val: 0.1,
    change: 10,
    scl_change: 0.1
}];


// -- Establishing margins and canvas bounds -- 
var margin = {
        top: 40, 
        right: 60, 
        bottom: 140, 
        left: 60
    },
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var padding_top = 0.2,
    padding_bottom = 0.06;

var good_col = "red",
    bad_col = "blue";

var outlier = 1 + padding_top/2;


// -- Adding scales based on canvas -- 
var xScale = d3.scaleBand()
        .domain(testData.map(function(d){return d.name;}))
        .rangeRound([0, width])
        .paddingInner(0.01),
    yScale = d3.scaleLinear()
        .domain([0-padding_bottom, 1+padding_top])
        .rangeRound([height, 0]);

var svg = d3.select("body")
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');

// -- Drawing background rectangles -- 
svg.selectAll("rect")
    .data(testData)
    .enter()
    .append("rect")
    .attr("class","bg_bar")
    .attr('x',function(d) {return xScale(d.name);})
    .attr('y',0)
    .attr("height",function(d){return yScale(0-padding_bottom)})
    .attr("width",xScale.bandwidth())
    .style("fill","white");



// -- Handling the special case --
svg.append("g")
    .selectAll("rect")
    .data(testData.filter(function(d){return d.scl_val > 1;}))
    .enter()
    .append("rect")
    .attr("class","special")
    .attr('x',function(d) {return xScale(d.name)+ xScale.bandwidth()*0.35;})
    .attr('y',function(d) {return yScale(outlier);})
    .attr("height",function(d){return yScale(1)-yScale(outlier);})
    .attr("width",xScale.bandwidth()*0.3);

svg.append("g")
    .selectAll("rect")
    .data(testData.filter(function(d){return d.scl_val > 1;}))
    .enter()
    .append("rect")
    .attr("class","whitebox")
    .attr('x',function(d) {return xScale(d.name);})
    .attr('y',function(d) {return yScale(outlier-padding_top/8);})
    .attr("height",function(d){return (yScale(1)-yScale(outlier))/2;})
    .attr("width",xScale.bandwidth())
    .attr("fill","white");

svg.append("g")
    .selectAll("circle")
    .data(testData.filter(function(d){return d.scl_val > 1;}))
    .enter()
    .append("circle")
    .attr("r",2)
    .attr("cy",function(d) {return yScale(outlier-padding_top/8);})
    .attr("cx",function(d) {return xScale(d.name)+xScale.bandwidth()*0.5;})
    .attr("fill","red");

svg.append("g")
    .selectAll("circle")
    .data(testData.filter(function(d){return d.scl_val > 1;}))
    .enter()
    .append("circle")
    .attr("r",2)
    .attr("cy",function(d) {return yScale(outlier-padding_top/4);})
    .attr("cx",function(d) {return xScale(d.name)+xScale.bandwidth()*0.5;})
    .attr("fill","red");

svg.append("g")
    .selectAll("circle")
    .data(testData.filter(function(d){return d.scl_val > 1;}))
    .enter()
    .append("circle")
    .attr("r",2)
    .attr("cy",function(d) {return yScale(outlier-padding_top*3/8);})
    .attr("cx",function(d) {return xScale(d.name)+xScale.bandwidth()*0.5;})
    .attr("fill","red");

// -- Drawing the initial level (blue) --
svg.append("g")
    .selectAll("line")
    .data(testData)
    .enter()
    .append("line")
    .attr("class","line_lvl")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.25})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.75})
    .attr("y1",function(d){
        if (d.scl_val >= 1){
            return yScale(outlier)-1}
        else{
            return yScale(d.scl_val)
        }})
    .attr("y2",function(d){
        if (d.scl_val >= 1){
            return yScale(outlier)-1}
        else{
            return yScale(d.scl_val)
        }})
    .attr("stroke", "rgb(30,61,122)")
    .attr("stroke-width", 4)
    .attr("stroke-linecap","round")
    .attr("fill", "none");



// -- The text for initial level (blue) --
var draw_text = svg.selectAll('text')
    .data(testData)
    .enter()
    .append('text')
    .text(function(d){return d.val;})
    .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("y", function(d){
        if (d.scl_val >= 1){
            return yScale(outlier)-4;
        }

        if (d.change >= d.val){
            return yScale(d.scl_val)+12;
        }

        else {
            return yScale(d.scl_val)-3;
        }
    })
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
    .attr("y2",function(d){
        if (d.scl_change >= 1){
            return yScale(1)}
        else{
            return yScale(d.scl_change)
        }})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.change != d.val) {return 2;}
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
    .attr("y1",function(d){
        if (d.scl_val >= 1){
            return yScale(1)}
        else{
            return yScale(d.scl_val)-1
        }})
    .attr("y2",function(d){
        if (d.scl_change >= 1){
            return yScale(1)}
        else{
            return yScale(d.scl_change)
        }})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.change != d.val) {return 2;}
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
    .attr("y1",function(d){
        if (d.scl_val >= 1){
            return yScale(1)}
        else{
            return yScale(d.scl_val)-1
        }})
    .attr("y2",function(d){
        if (d.scl_change >= 1){
            return yScale(1)}
        else{
            return yScale(d.scl_change)
        }})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.change != d.val) {return 2;}
        else {return 0}})
    .attr("fill", "none");


svg.append("g")
    .selectAll('text')
    .data(testData)
    .enter()
    .append('text')
    .text(function(d){return d.change;})
    .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("y", function(d){
        if (d.change >= d.val){
            return yScale(d.scl_change)-3;
        }

        else {
            return yScale(d.scl_change)+12;
        }
    })
    .attr("font-family", 'sans-serif')
    .attr("font-size", '12px')
    .attr("font-weight", 'bold')
    .attr("fill", function(d) {
        if ((d.change != d.val) && (d.scl_val <= 1)) {return "red";}
        else {return "None"}})
    .attr("text-anchor",'middle');


// -- Drawing Arrows -- 
svg.append("g")
    .selectAll("line")
    .data(testData.filter(function(d){return d.scl_val <= 1;}))
    .enter()
    .append("line")
    .attr("class","arrow")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.42})
    .attr("y1",function(d){
        if (d.change >= d.val){
            return yScale((d.scl_val+d.scl_change)/2) - 3
        }
        else {
            return yScale((d.scl_val+d.scl_change)/2) + 3
        }})
    .attr("y2",function(d){
        if (d.change >= d.val){
            return yScale((d.scl_val+d.scl_change)/2) + 3
        }
        else {
            return yScale((d.scl_val+d.scl_change)/2) - 3
        }})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.change != d.val) {return 2;}
        else {return 0}})
    .attr("stroke-linecap","round")
    .attr("fill", "none");

svg.append("g")
    .selectAll("line")
    .data(testData.filter(function(d){return d.scl_val <= 1;}))
    .enter()
    .append("line")
    .attr("class","arrow")
    .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()/2})
    .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.58})
    .attr("y1",function(d){
        if (d.change >= d.val){
            return yScale((d.scl_val+d.scl_change)/2) - 3
        }
        else {
            return yScale((d.scl_val+d.scl_change)/2) + 3
        }})
    .attr("y2",function(d){
        if (d.change >= d.val){
            return yScale((d.scl_val+d.scl_change)/2) + 3
        }
        else {
            return yScale((d.scl_val+d.scl_change)/2) - 3
        }})
    .attr("stroke", "red")
    .attr("stroke-width", function(d) {
        if(d.change != d.val) {return 2;}
        else {return 0}})
    .attr("stroke-linecap","round")
    .attr("fill", "none");

// var xAxis = d3.axisBottom().scale(xScale);
//
// svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//     .selectAll(".tick text") 
//       .call(wrap, xScale.bandwidth());

var xAxis = d3.axisBottom().scale(xScale);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("fill",function(d) {
            if (d.anch == 1) {
                return "red"
                }
            else {
                return "white"
            }})
        .attr("dy", "0.5em")
        .attr("dx", "-0.5em")
        .attr("transform","rotate(-40)");

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}




