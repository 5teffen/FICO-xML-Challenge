
var squareOne = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.7,
    occ: 50,
    inc_change: 3
    
},
{
    name: "Months Since Oldest Trade Open",
    label: "Ft.2",
    per: 0.7,
    occ: 10,
    inc_change: -4,

}];
    
var squareTwo = [
{
    name: "External Risk Estimate23",
    label: "Ft.1",
    per: 0.3,
    occ: 30,
    inc_change: 3
    
},
{
    name: "Months Since Oldest Trade Open1",
    label: "Ft.2",
    per: 0.3,
    occ: 5,
    inc_change: 2
}];

var squareThree = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.3,
    occ: 10,
    inc_change: 3
    
},
{
    name: "External Risks Things",
    label: "Ft.2",
    per: 0.3,
    occ: 10,
    inc_change: -2
    
},
{
    name: "Months Since Oldest Trade Closed",
    label: "Ft.3",
    per: 0.3,
    occ: 10,
    inc_change: 1
},
{
    name: "Trades 90+",
    label: "Ft.4",
    per: 0.3,
    occ: 10,
    inc_change: 3
}];

var totalData1 = [squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo];
var totalData2 = [squareThree,squareThree,squareThree,squareThree,squareThree];

function draw_single_graph(testData, svg, width, height){
    console.log("function called")
    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";

    var separator = 0.015

    if (testData[0].per < 0.5) {
        the_colour = bad_col;}
    else {
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
        .style("fill","white");


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
    
    for (i = 0; i < testData.length; ++i){
        var d = testData[i];
        var abs_val = Math.abs(testData[i].inc_change); 
        for (n = 0; n < abs_val ; ++n) {
            var one_incr = yScale(0.9)-yScale(1)+1
            svg.append("g")
                .append("rect")
                .attr("x",xScale(d.name) + xScale.bandwidth()*0.25)
                .attr("width", xScale.bandwidth()*0.5)
                .attr("y",function(){
                        if (d.inc_change < 0){return yScale(0.5)+one_incr*n;}
                        else {return yScale(0.5)-one_incr*(n+1)}
                })
                .attr("height",one_incr)
                .attr("fill", the_colour)
                .attr("stroke-width",0.4)
                .attr("stroke","white");
        }
//        
    }

    // -- Drawing the initial level --
    svg.append("g")
        .selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","line_lvl")
        .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.15})
        .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.85})
        .attr("y1",function(d){return yScale(0.5);})
        .attr("y2",function(d){return yScale(0.5);})
        .attr("stroke", "black")
        .attr("stroke-width",1)
        .attr("fill", "none");
}

function draw_all_graphs(totalData,limit) {
    const horizontal_limit = 5;
    
    
    var x_shift = 0,
        y_shift = 0,
        
        x_sep = 8,
        y_sep = 8;
    
    const sq_height = 45,
          sq_width = 45;

    
    const margin = {
            top: 5, 
            right: 5,
            bottom: 5, 
            left: 5
        };
          
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
        text_space = 95;
    
    for (i = 0; i < totalData[0].length; ++i){
        var name_string =(totalData[0][i].name).toString() 
        
        svg.append('g').append("text")
            .text(name_string)
            .attr("x",text_feat)
            .attr("y",function(){
                    console.log(name_string.length);
                    if (name_string.length < 20){return 10+text_shift;}
                    else {return 10+text_shift;}
            })  
            .attr("font-family", 'sans-serif')
            .attr("font-size", '10px')
            .attr("fill","#808080")
            .attr("text-anchor",'start')
                .call(wrap, text_space);
        
//        svg.append('g').append("text")
//            .text((totalData[0][i].label).toString())
//            .attr("x",0)
//            .attr("y",17+text_shift)
//            .attr("font-family", 'sans-serif')
//            .attr("font-size", '12px')
//            .attr("fill","#808080")
//            .attr("text-anchor",'start');
                
        svg.append('g').append("text")
            .text((totalData[0][i].label).toString())
            .attr("x",0)
            .attr("y",function(){
                    console.log(name_string.length);
                    if (name_string.length < 20){return 10+text_shift;}
                    else {return 10+text_shift;}
            })  
            .attr("font-family", 'sans-serif')
            .attr("font-size", '12px')
            .attr("fill","#808080")
            .attr("text-anchor",'start');
        text_shift += 25
    }
    
    svg = svg.append("g")
            .attr("transform","translate(" + (text_space+text_feat+5) + ",0)");
    
    
    
    var count = 0
    if (totalData.length <= limit) {limit = totalData.length;}

    for (indx = 0; indx < limit; ++indx){
        var single_square = totalData[indx];
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


draw_all_graphs(totalData1,100);

