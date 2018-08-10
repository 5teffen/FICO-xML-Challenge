
function draw_mini_graph(testData, svg, width, height, shift, mini_idx){

    console.log('Drawing');
    
    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";
    var opp_colour = "";

    var separator = 0.015

    if (testData[0].per <= 0.5) {
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
    svg.append("g")
        .attr("id", "mini-graph-"+mini_idx.toString())
        .attr("onclick", "redirect_to_instance(this)")
        .selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
        .attr('x',function(d) {return xScale(d.name);})
        .attr('y',shift)
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
                return the_colour;
            }
            else {return "white";}
        });


    // -- Drawing surrounding box -- 
        svg.append("rect")
        .attr("class","border")
        .attr('x',xScale(testData[0].name))
        .attr('y',shift)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",(xScale.bandwidth()+0.1)*testData.length)
        .attr("fill","None")
        .attr("stroke","#A9A9A9")
        .attr("stroke-width",2);


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
                return yScale(1)+shift}
            else if (d.scl_val > d.scl_change){
                return yScale(d.scl_val)+shift;
            }
            else {return yScale(d.scl_change)+shift;}
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
        .attr("fill", opp_colour);



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
                return yScale(1)+shift;}
            else{
                return yScale(d.scl_val)+shift;
            }})
        .attr("y2",function(d){
            if (d.scl_val > 1){
                return yScale(1)+shift;}
            else{
                return yScale(d.scl_val)+shift;
            }})
        .attr("stroke", "black")
        .attr("stroke-width",1 )
        .attr("fill", "none");
}

function draw_all_graphs(totalData, mini_indexes){
    var shift = 0
    var separation = 10
    
    var margin = {
            top: 5, 
            right: 5, 
            bottom: 5, 
            left: 5
        },
        
    width = 400 - margin.right - margin.left,
    height = (40 - margin.top - margin.bottom),
    totalHeight = (height+separation)*totalData.length;
    
    
    var svg = d3.select("#right-graph-0")
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",totalHeight + margin.top + margin.bottom)
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');
    
    
    for (i = 0; i < totalData.length; ++i){
        dataPoint = totalData[i];
        draw_mini_graph(dataPoint, svg, width, height, shift, mini_indexes[i]);
        
        shift += (height + separation);
    }
}

// draw_all_graphs(totalData);

//draw_mini_graph(dataPoint1, 0.7,0)


