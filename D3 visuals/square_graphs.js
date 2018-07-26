
var squareOne = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.7,
    occ: 10,
    incr: 3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    label: "Ft.2",
    per: 0.7,
    occ: 10,
    incr: 0,
    val: 120,
    scl_val: 1.2,
    change: 70,
    scl_change: 0.7
}];
    
var squareTwo = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.5,
    occ: 10,
    incr: 3,
    val: 50,
    scl_val: 0.5,      // Should be in range 0-1
    change: 20,
    scl_change: 0.2
    
},
{
    name: "Months Since Oldest Trade Open",
    label: "Ft.2",
    per: 0.5,
    occ: 10,
    incr: 0,
    val: 20,
    scl_val: 0.2,
    change: 50,
    scl_change: 0.5
}];
    
//var squareThree = [
//{
//    name: "External Risk Estimate",
//    label: "Ft.1",
//    per: 0.3,
//    occ: 10,
//    incr: 3,
//    val: 50,
//    scl_val: 0.5,      // Should be in range 0-1
//    change: 20,
//    scl_change: 0.2
//    
//},
//{
//    name: "External Risks",
//    label: "Ft.2",
//    per: 0.3,
//    occ: 10,
//    incr: 3,
//    val: 70,
//    scl_val: 0.7,      // Should be in range 0-1
//    change: 80,
//    scl_change: 0.8
//    
//},
//{
//    name: "Months Since Oldest Trade Closed",
//    label: "Ft.2",
//    per: 0.5,
//    occ: 10,
//    incr: 0,
//    val: 20,
//    scl_val: 0.2,
//    change: 50,
//    scl_change: 0.5
//},
//{
//    name: "Months Since Oldest Trade Open",
//    label: "Ft.3",
//    per: 0.3,
//    occ: 10,
//    incr: 0,
//    val: 120,
//    scl_val: 1.2,
//    change: 80,
//    scl_change: 0.8
//}];

var totalData = [squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo];

function draw_single_graph(testData, svg, width, height){
    
    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";
    var opp_colour = "";

    var separator = 0.015

    if (testData[0].per < 0.5) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col
        the_colour = good_col;}

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


    // -- Drawing background rectangles -- 
    svg.append("g").selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
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
                return yScale(1);}
            else{
                return yScale(d.scl_val);
            }})
        .attr("y2",function(d){
            if (d.scl_val > 1){
                return yScale(1);}
            else{
                return yScale(d.scl_val);
            }})
        .attr("stroke", "black")
        .attr("stroke-width",1 )
        .attr("fill", "none");
}

function draw_all_graphs(totalData) {
    var x_shift = 0,
        y_shift = 0,
        
        x_sep = 10,
        y_sep = 10;
    
    const sq_height = 50,
          sq_width = 50;

    
    const margin = {
            top: 5, 
            right: 5,
            bottom: 5, 
            left: 5
        };
          
    const horizontal_limit = 3;
    
    var width = 500 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
            .append("g")
                .attr("transform","translate(" + margin.left + ',' + margin.top +')');
    
    
    
    var text_shift = 0,
        text_feat = 30,
        text_space = 100;
    
    for (i = 0; i < totalData[0].length; ++i){
        svg.append('g').append("text")
            .text((totalData[0][i].name).toString())
            .attr("x",text_feat)
            .attr("y",10+text_shift)
            .attr("font-family", 'sans-serif')
            .attr("font-size", '10px')
            .attr("fill","#808080")
            .attr("text-anchor",'start')
                .call(wrap, text_space);
        
        svg.append('g').append("text")
            .text((totalData[0][i].label).toString())
            .attr("x",0)
            .attr("y",15+text_shift)
            .attr("font-family", 'sans-serif')
            .attr("font-size", '12px')
            .attr("fill","#808080")
            .attr("text-anchor",'start');
                
        text_shift += 25
    }
    
    
    svg = svg.append("g")
            .attr("transform","translate(" + (text_space+text_feat) + ",0)");
    
    
    var count = 0
    for (i = 0; i < totalData.length; ++i){
        var single_square = totalData[i];
        
        var shifted_svg = svg.append('g')
                        .attr("transform","translate(" + x_shift + ',' + y_shift +')');
        
        draw_single_graph(single_square, shifted_svg, sq_width, sq_height);
        
        if (count == horizontal_limit){
            x_shift = 0;
            y_shift += (sq_height + y_sep);
            count = 0;
        }
        
        else{
            x_shift += sq_width + x_sep;
            count += 1;
        }
    }
}




function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}


draw_all_graphs(totalData);

