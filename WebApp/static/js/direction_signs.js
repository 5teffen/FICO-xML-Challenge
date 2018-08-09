function draw_dir(dir, ft_index) {
    
    var width = 25,
        height = 28;
    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, width]);
    
    var yScale = d3.scaleLinear()
            .domain([1, 0])
            .rangeRound([0, height]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var section = "#monot-" + ft_index.toString();

    var svg = d3.select(section).append("svg")
                .attr("width",width)
                .attr("height",height)
                .attr("class", "dir-svg")
    
    var defs = svg.append("defs");

   
    if ((dir == 1) || (dir == -1)) {
        svg.append('g').append("line")
            .attr("class","arrow")
            .attr("x1",xScale(0.5))
            .attr("x2",xScale(0.5))
            .attr("y1",yScale(0.25))
            .attr("y2",yScale(0.75))
            .style("stroke",function(){
                if (dir == 1) {return "#1b9e77";}
                else {return "rgb(217, 95, 2)";}
            })
            .style("stroke-linecap","round")
            .style("stroke-width",2); 
        
        svg.append('g').append("line")
            .attr("class","arrow")
            .attr("x1",xScale(0.5))
            .attr("x2",xScale(0.66))
            .attr("y1",yScale(0.75))
            .attr("y2",yScale(0.5))
            .style("stroke",function(){
                if (dir == 1) {return "#1b9e77";}
                else {return "rgb(217, 95, 2)";}
            })
            .style("stroke-linecap","round")
            .style("stroke-width",2); 
        
        svg.append('g').append("line")
            .attr("class","arrow")
            .attr("x1",xScale(0.5))
            .attr("x2",xScale(0.35))
            .attr("y1",yScale(0.75))
            .attr("y2",yScale(0.5))
            .style("stroke",function(){
                if (dir == 1) {return "#1b9e77";}
                else {return "rgb(217, 95, 2)";}
            })
            .style("stroke-linecap","round")
            .style("stroke-width",2); 
    }
    
    
    else{
        svg.append('g').append("line")
            .attr("class","arrow")
            .attr("x1",xScale(0.25))
            .attr("y1",yScale(0.5))
            .attr("x2",xScale(0.75))
            .attr("y2",yScale(0.5))
            .style("stroke","black")
            .style("stroke-linecap","round")
            .style("stroke-width",2); 
    }
    
}
