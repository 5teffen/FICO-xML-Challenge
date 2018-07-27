function square(col,strike,size,parent) {

    var svg = d3.select(parent).append("svg")
            .attr("width",size)
            .attr("height",size)
            .attr("display", "inline-block");

    svg.append('defs')
      .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
      .append('path')
        .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

    svg.append("rect")
          .attr("x", 0)
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(){
                 if (col) {
                     return '#1b9e77';
                 }
                 else {
                     return '#d95f02';
                 }
        });

    svg.append("rect")
        .attr("x", 0)
        .attr("width", size)
        .attr("height", size)
        .attr("fill", function(){
                 if (strike) {
                     return 'url(#diagonalHatch)';
                 }
                 else {
                     return "None";
                 }
        });
}
