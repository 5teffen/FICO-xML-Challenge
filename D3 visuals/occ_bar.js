function draw_percent_bar(good,bad) {
    
    var bar_width = 100,
        bar_height = 20;
    
    var x_buffer = 10,
        y_buffer = 10;
    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var svg = d3.select("body").append("svg")
                .attr("width",270)
                .attr("height",55)
                .append("g")
                     .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
    // Drawing the frame
    
    var sep = 2.5
    var border = 3
    
     svg.append('g').append("rect")
        .attr("height",bar_height+sep*2)
        .attr("width",bar_width+border)
        .style("fill","None")
        .style("stroke-width",border)
        .style("stroke","black");
    
    var svg = svg.append("g")
                     .attr("transform","translate(" + border + ',' + sep +')');
    
//    svg.append('g').append("text")
//        .attr("class","per_marker")
//        .text(function(){return Math.round(result*100).toString() + "%"})
//        .attr("x",function(){return xScale(result)+5;})
//        .attr("y",bar_height+20)
//        .attr("font-family", 'sans-serif')
//        .attr("font-size", '16px')
//        .attr("font-weight", 'bold')
//        .attr("fill", function(d) {
//            if (result > 0.5) {return good_col;}
//            else {return bad_col}})
//        .attr("text-anchor",'middle');
    
    // Drawing the good recangle
    svg.append('g').append("rect")
        .attr("height",bar_height)
        .attr("width",xScale(good))
        .style("fill",good_col);
    
    // Drawing the bad rectangle
     svg.append('g').append("rect")
        .attr('x',xScale(good))
        .attr("height",bar_height)
        .attr("width",xScale(bad))
        .style("fill",bad_col);

}

draw_percent_bar(0.29,0.15);