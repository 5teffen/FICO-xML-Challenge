
var dataPoint1 = [
{
    name: "External Risk Estimate",
    anch: 0,
    incr: 3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    anch: 1,
    incr: 0,
    val: 120,
    scl_val: 1.2,
    change: 100,
    scl_change: 1
},
{
    name: "Months Since Last Trade Open",
    anch: 0,
    incr: 1,
    val: 70,
    scl_val: 0.7,
    change: 80,
    scl_change: 0.8
},
{
    name: "Average Months in File",
    anch: 0,
    incr: 10,
    val: 0,
    scl_val: 0,
    change: 100,
    scl_change: 1
},
{
    name: "Satisfactory Trades",
    anch: 0,
    incr: 4,
    val: 150,
    scl_val: 1.5,
    change: 60,
    scl_change: 0.6
},
{
    name: "Trades 60+ Ever",
    anch: 1,
    incr: 0,
    val: 10,
    scl_val: 0.1,
    change: 10,
    scl_change: 0.1
}];

var dataPoint2 = [
{
    name: "External Risk Estimate",
    anch: 0,
    incr: 3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    anch: 1,
    incr: 0,
    val: 120,
    scl_val: 1.2,
    change: 100,
    scl_change: 1
},
{
    name: "Months Since Last Trade Open",
    anch: 0,
    incr: 1,
    val: 70,
    scl_val: 0.7,
    change: 80,
    scl_change: 0.8
},
{
    name: "Average Months in File",
    anch: 0,
    incr: 10,
    val: 0,
    scl_val: 0,
    change: 100,
    scl_change: 1
},
{
    name: "Satisfactory Trades",
    anch: 0,
    incr: 4,
    val: 150,
    scl_val: 1.5,
    change: 60,
    scl_change: 0.6
},
{
    name: "Trades 60+ Ever",
    anch: 1,
    incr: 0,
    val: 10,
    scl_val: 0.1,
    change: 10,
    scl_change: 0.1
}];

var dataPoint3 = [
{
    name: "External Risk Estimate",
    anch: 0,
    incr: 3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    anch: 1,
    incr: 0,
    val: 120,
    scl_val: 1.2,
    change: 100,
    scl_change: 1
},
{
    name: "Months Since Last Trade Open",
    anch: 0,
    incr: 1,
    val: 70,
    scl_val: 0.7,
    change: 80,
    scl_change: 0.8
},
{
    name: "Average Months in File",
    anch: 0,
    incr: 10,
    val: 0,
    scl_val: 0,
    change: 100,
    scl_change: 1
},
{
    name: "Satisfactory Trades",
    anch: 0,
    incr: 4,
    val: 150,
    scl_val: 1.5,
    change: 60,
    scl_change: 0.6
},
{
    name: "Trades 60+ Ever",
    anch: 1,
    incr: 0,
    val: 10,
    scl_val: 0.1,
    change: 10,
    scl_change: 0.1
}];

var totalData = [dataPoint1, dataPoint2, dataPoint3]

var allResults = [0.6, 0.3, 0.7]


function draw_mini_graph(testData, result,shift){
    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";
    var opp_colour = "";

    var separator = 0.015

    if (result) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col
        the_colour = good_col;}

    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 5, 
            right: 5, 
            bottom: 5, 
            left: 5
        },
        width = 150 - margin.right - margin.left,
        height = 35 - margin.top - margin.bottom;

    var padding_top = 0.1,
        padding_bottom = 0.1;

    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleBand()
            .domain(testData.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
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
        .style("opacity",function(d){
            if(d.anch == 1){
                return 0.2;
            }
            else {return 1;}
        })
        .style("fill",function(d){
            if(d.anch == 1){
                return opp_colour;
            }
            else {return "white";}
        });


    // -- Drawing surrounding box -- 
        svg.append("rect")
        .attr("class","border")
        .attr('x',xScale(testData[0].name))
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",(xScale.bandwidth()+0.1)*testData.length)
        .attr("fill","None")
        .attr("stroke","#A9A9A9")
        .attr("stroke-width",1);


    // -- Drawing Change Box -- 

    svg.append("g")
        .selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
        .attr("class","change_rect")
        .attr("x",function(d){return xScale(d.name) + xScale.bandwidth()*0.3})
        .attr("width",function(d){return xScale.bandwidth()*0.4})
        .attr("y",function(d){
            if (d.scl_val > 1){
                return yScale(1)}
            else if (d.scl_val > d.scl_change){
                return yScale(d.scl_val);
            }
            else {return yScale(d.scl_change);}
            })
        .attr("height",function(d){
            if (d.scl_val > 1){
                return yScale(d.scl_change)-yScale(1);}
            else if (d.scl_val > d.scl_change){
                return yScale(d.scl_change)-yScale(d.scl_val);
            }
            else if (d.scl_val == d.scl_change) {return 0;}
            else {return yScale(d.scl_val)-yScale(d.scl_change);}
            })
        .attr("fill", the_colour);



    // -- Drawing the initial level --
    svg.append("g")
        .selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","line_lvl")
        .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.15})
        .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.85})
        .attr("y1",function(d){
            if (d.scl_val > 1){
                return yScale(1)}
            else{
                return yScale(d.scl_val)
            }})
        .attr("y2",function(d){
            if (d.scl_val > 1){
                return yScale(1)}
            else{
                return yScale(d.scl_val)
            }})
        .attr("stroke", "black")
        .attr("stroke-width",1 )
        .attr("fill", "none");
}



function draw_all_graphs(totalData,allResults){
    shift = 0
    
    var margin = {
            top: 5, 
            right: 5, 
            bottom: 5, 
            left: 5
        },
    width = 150 - margin.right - margin.left,
    height = (35 - margin.top - margin.bottom)*totalData.length;
    
    
    
    for (i = 2; i < totalData.length; ++i){
        dataPoint = totalData[i]
        result = allResults[i]
        draw_mini_graph(dataPoint, result, shift)
    }
}
draw_all_graphs(totalData,allResults);

//draw_mini_graph(dataPoint1, 0.7,0)


