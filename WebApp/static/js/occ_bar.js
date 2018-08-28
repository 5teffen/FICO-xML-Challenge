function draw_occurance_bar(anch,good,bad,ft_index) {

    var bar_width = 40,
        bar_height = 8;
    
    var shift = bar_height+5
    
    var text_space = 0
    
    var text_col = "#808080"
    
    var x_buffer = 2+text_space,
        y_buffer = 2;

    // var anch = false;
    
    if (anch == true) {var max = 5000;}
    else {var max = 2000;}

    var xScale = d3.scaleLinear()
            .domain([0,max])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var section = "#ft-div-" + ft_index.toString();

    var svg = d3.select(section).append("svg")
                .attr("width",55)
                .attr("height",15)
                .attr("class", "occ-svg")
    
    svg = svg.append("g")
             .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
    // Drawing the frame
    
    var sep = 1;
    var border = 1.5;
    
    // svg.append('g').append("line")
    //     .attr("y1",0)
    //     .attr("x1",0)
    //     .attr("y2",bar_height+sep*2)
    //     .attr("x2",0)
    //     .attr("stroke-width",border)
    //     .attr("opacity",0.7)
    //     .attr("stroke","black");
    
    var svg_up = svg.append("g")
                     .attr("transform","translate(" + border + ',' + sep +')');

    // To ensure something is visible
    if (anch == true){
        if (good+bad < 100) 
            if (good > bad && good != 0) {good = 70;}
            else if (bad != 0) {bad = 70;}   
    }
    else {
        if (good+bad < 40) 
            if (good > bad && good != 0) {good = 28;}
            else if (bad != 0) {bad = 28;}   
    }
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
    
    if (type == 'key'){var text_str = "# key features";}
    else {var text_str= "# changes";}

    var svg = d3.select(section).append("svg")
                .attr("width",85)
                .attr("height",25)
                .attr("class", "bar-label")
    
  // Change Label
    
   svg.append('g').append("text")
       .text(text_str)
       .attr("x",0)
       .attr("y",bar_height/2+7)
       .attr("font-family", "Source Sans Pro")
       .attr("font-size", '13px')
       .attr("font-weight", '700')
       .attr("fill","black")
       .attr("text-anchor",'start');

    
}
