
function draw_percent_bar(result) {
    
    var bar_width = 30,
        bar_height = 50;
    
    var x_buffer = 10,
        y_buffer = 10;
    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var svg = d3.select("body").append("svg")
                .attr("width",500)
                .attr("height",500)
                .append("g")
                     .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
    var defs = svg.append("defs");

    // Setting the colour gradient
    var linearGradient = defs.append("linearGradient")
       .attr("id", "lin_gradient")
       .attr("x1", "0%")
       .attr("x2", "0%")
       .attr("y1", "0%")
       .attr("y2", "100%");
    
    var colorScale = d3.scaleLinear()
        .range(["white", "#7570b3", "white"]);

    linearGradient.selectAll("stop")
        .data(colorScale.range() )
        .enter().append("stop")
        .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
        .attr("stop-color", function(d) { return d; });

    // Drawing the rectangle with curved edges
    svg.append("rect")
        .attr("class","bg_bar")
        .attr("height",bar_height)
        .attr("width",bar_width)
        .attr("stroke",1)
        .attr("stroke-colour","black")
        .style("fill","url(#lin_gradient)");

}

draw_percent_bar(0.29);