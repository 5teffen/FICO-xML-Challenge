

/* 

Preparing the background and 

*/

var result = 0.75;

var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    width = 450 - margin.right - margin.left,
    height = 400- margin.top - margin.bottom;

var xScale = d3.scaleBand()
        .domain([0, 1])
        .rangeRound([0,width]);


var svg = d3.select("body")
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');