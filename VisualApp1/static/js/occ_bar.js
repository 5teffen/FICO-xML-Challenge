function draw_occurance_bar(anch_good,anch_bad,change_good,change_bad,ft_index) {


    var bar_width = 30,
        bar_height = 5;
    
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

    var section = "#ft-div-" + ft_index.toString();

    var svg = d3.select(section).append("svg")
                .attr("width",40)
                .attr("height",30)
                .attr("class", "occ-svg")
    
//   // Change Label
//    svg.append('g').append("text")
//        .text("# anchors")
//        .attr("x",4)
//        .attr("y",bar_height/2+5)
//        .attr("font-family", 'sans-serif')
//        .attr("font-size", '5px')
//        .attr("fill","#808080")
//        .attr("text-anchor",'start');
//    
//    svg.append('g').append("text")
//        .text("# changes")
//        .attr("x",4)
//        .attr("y",bar_height/2+shift+5)
//        .attr("font-family", 'sans-serif')
//        .attr("font-size", '5px')
//        .attr("fill","#808080")
//        .attr("text-anchor",'start');
    
    
    svg = svg.append("g")
             .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
    // Drawing the frame
    
    var sep = 1
    var border = 1.2
    
    svg.append('g').append("rect")
        .attr("height",bar_height+sep*2)
        .attr("width",bar_width+border)
        .style("fill","None")
        .style("stroke-width",border)
        .style("stroke","black");
    
    var svg_up = svg.append("g")
                     .attr("transform","translate(" + border + ',' + sep +')');
    
    svg.append('g').append("text")
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
    
    // Drawing the anch good recangle
    svg_up.append('g').append("rect")
        .attr("height",bar_height)
        .attr("width",xScale(anch_good))
        .style("fill",good_col);
    
    // Drawing the anch bad rectangle
     svg_up.append('g').append("rect")
        .attr('x',xScale(anch_good))
        .attr("height",bar_height)
        .attr("width",xScale(anch_bad))
        .style("fill",bad_col);
    
    
    
    // Second part
    
    svg.append('g').append("rect")
        .attr('y',shift)
        .attr("height",bar_height+sep*2)
        .attr("width",bar_width+border)
        .style("fill","None")
        .style("stroke-width",border)
        .style("stroke","black");
    
    var svg_down = svg.append("g")
                     .attr("transform","translate(" + border + ',' + sep +')');
    
    // Drawing the change good recangle
    svg_down.append('g').append("rect")
        .attr('y',shift)
        .attr("height",bar_height)
        .attr("width",xScale(change_good))
        .style("fill",good_col);
    
    // Drawing the change bad rectangle
     svg_down.append('g').append("rect")
        .attr('y',shift)
        .attr('x',xScale(change_good))
        .attr("height",bar_height)
        .attr("width",xScale(change_bad))
        .style("fill",bad_col);
    
    
}

function draw_occurance_text() {


    var bar_width = 45,
        bar_height = 5;
    
    var shift = bar_height+5
    
    var text_space = 0
    
    var text_col = "#808080"
    
    var x_buffer = 2+text_space,
        y_buffer = 5;
    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var section = "#bar-div-header";

    var svg = d3.select(section).append("svg")
                .attr("width",80)
                .attr("height",25)
                .attr("class", "bar-label")
    
  // Change Label
   svg.append('g').append("text")
       .text("# key features")
       .attr("x",4)
       .attr("y",bar_height/2+7)
       .attr("font-family", 'sans-serif')
       .attr("font-size", '11px')
       .attr("fill","#808080")
       .attr("text-anchor",'start');
   
   svg.append('g').append("text")
       .text("# changes")
       .attr("x",4)
       .attr("y",bar_height/2+shift+7)
       .attr("font-family", 'sans-serif')
       .attr("font-size", '11px')
       .attr("fill","#808080")
       .attr("text-anchor",'start');
    
    
//     svg = svg.append("g")
//              .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');
    
//     // Drawing the frame
    
//     var sep = 1
//     var border = 1.2
    
//     svg.append('g').append("rect")
//         .attr("height",bar_height+sep*2)
//         .attr("width",bar_width+border)
//         .style("fill","None")
//         .style("stroke-width",border)
//         .style("stroke","black");
    
//     var svg_up = svg.append("g")
//                      .attr("transform","translate(" + border + ',' + sep +')');
    
//     svg.append('g').append("text")
// //        .text(function(){return Math.round(result*100).toString() + "%"})
// //        .attr("x",function(){return xScale(result)+5;})
// //        .attr("y",bar_height+20)
// //        .attr("font-family", 'sans-serif')
// //        .attr("font-size", '16px')
// //        .attr("font-weight", 'bold')
// //        .attr("fill", function(d) {
// //            if (result > 0.5) {return good_col;}
// //            else {return bad_col}})
// //        .attr("text-anchor",'middle');
    
//     // Drawing the anch good recangle
//     svg_up.append('g').append("rect")
//         .attr("height",bar_height)
//         .attr("width",xScale(anch_good))
//         .style("fill",good_col);
    
//     // Drawing the anch bad rectangle
//      svg_up.append('g').append("rect")
//         .attr('x',xScale(anch_good))
//         .attr("height",bar_height)
//         .attr("width",xScale(anch_bad))
//         .style("fill",bad_col);
    
    
    
//     // Second part
    
//     svg.append('g').append("rect")
//         .attr('y',shift)
//         .attr("height",bar_height+sep*2)
//         .attr("width",bar_width+border)
//         .style("fill","None")
//         .style("stroke-width",border)
//         .style("stroke","black");
    
//     var svg_down = svg.append("g")
//                      .attr("transform","translate(" + border + ',' + sep +')');
    
//     // Drawing the change good recangle
//     svg_down.append('g').append("rect")
//         .attr('y',shift)
//         .attr("height",bar_height)
//         .attr("width",xScale(change_good))
//         .style("fill",good_col);
    
//     // Drawing the change bad rectangle
//      svg_down.append('g').append("rect")
//         .attr('y',shift)
//         .attr('x',xScale(change_good))
//         .attr("height",bar_height)
//         .attr("width",xScale(change_bad))
//         .style("fill",bad_col);
    
    
}

