function draw_occurance_bar(good,bad,ft_index) {


    var bar_width = 55,
        bar_height = 10;
    
    var shift = bar_height+5
    
    var text_space = 0
    
    var text_col = "#808080"
    
    var x_buffer = 2+text_space,
        y_buffer = 2;
    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

//    var section = "#ft-div-" + ft_index.toString();

    var svg = d3.select("body").append("svg")
                .attr("width",65)
                .attr("height",15)
                .attr("class", "occ-svg")
    
    svg = svg.append("g")
             .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
    // Drawing the frame
    
    var sep = 1;
    var border = 1;
    
    svg.append('g').append("rect")
        .attr("height",bar_height+sep*2)
        .attr("width",bar_width+border)
        .style("fill","None")
        .style("stroke-width",border)
        .style("opacity",0.5)
        .style("stroke","black");
    
    var svg_up = svg.append("g")
                     .attr("transform","translate(" + border + ',' + sep +')');

    // Drawing the anch good recangle
    svg_up.append('g').append("rect")
        .attr("height",bar_height)
        .attr("width",xScale(good))
        .style("fill",good_col);
    
    // Drawing the anch bad rectangle
     svg_up.append('g').append("rect")
        .attr('x',xScale(good))
        .attr("height",bar_height)
        .attr("width",xScale(bad))
        .style("fill",bad_col);
    
    
}

function draw_occurance_text(type) {


    var bar_width = 45,
        bar_height = 10;
        
    var text_space = 0
    
    var text_col = "#808080"
    
    var x_buffer = 0;
        y_buffer = 0;


    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var section = "#bar-div-header";
    
    if (type == 'a'){var text_str = "# of Key Features";}
    else {var text_str= "# of Changes";}

    var svg = d3.select("body").append("svg")
                .attr("width",85)
                .attr("height",25)
                .attr("class", "bar-label")
    
  // Change Label
    
   svg.append('g').append("text")
       .text(text_str)
       .attr("x",0)
       .attr("y",bar_height/2+7)
       .attr("font-family", 'sans-serif')
       .attr("font-size", '10px')
       .attr("fill","#808080")
       .attr("text-anchor",'start');

    
}

draw_occurance_bar(0.29,0.3,1);
draw_occurance_text('a');