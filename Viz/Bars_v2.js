
var margin = {top: 20, right: 20, bottom: 80, left: 40},
 	width = 700 - margin.right - margin.left,
	height = 600 - margin.top - margin.bottom;

// Define SVG

var svg = d3.select("body")
			.append("svg")
			.attr("width",width + margin.right + margin.left)
			.attr("height",height + margin.top + margin.bottom)
			.append("g")
				.attr("transform","translate(" + margin.left + ',' + margin.right +')'); 

// Define the scales

var xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.15),
    yScale = d3.scaleLinear().rangeRound([height, 0]);

var colors = d3.scaleOrdinal().range(["#98abc5","#ff8c00"]);


// Define the axis

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);


d3.csv("data_file.csv", function(error, data) { 
	if(error) console.log("Error: Data didn't load");

	data.forEach(function(d){
		d.feature = d.feature;
		d.val = +d.val;
		d.scl = +d.val_scaled;
		d.next = +d.next; 
		d.next_scl = +d.next_scaled; 
		d.min = +d.min;
		d.max = +d.max;
		console.log(d.cur_val);
	});

	xScale.domain(data.map(function(d){return d.feature;}));
	yScale.domain([0, 100]); 
	zScale.domain(2)


	// Draw the bars
	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')

		.attr('x',function(d) {return xScale(d.feature)})
		.attr('y',function(d) {return yScale(d.scl)})
		.attr("width",xScale.bandwidth())
		.attr("height",function(d) {return height - yScale(d.scl)})
		.style("fill", function(d, i) { return colors[i]; });
		// .style("fill", function(d,i) { return 'rgb(19, 137, ' + ((i * 10) + 100) + ')'});

		//.delay( function(d,i) { return i * 200; })

    svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')

    .text(function(d){return d.val;})

    .attr("x", function(d){ return xScale(d.feature) + xScale.bandwidth()/2; }) // Label at the middle of the bar
    .attr("y", function(d){ return yScale(d.scl+1);})
    .attr("font-family", 'sans-serif')
    .attr("font-size", '20px')
    .attr("font-weight", 'bold')
    .attr("fill",'white')
    .attr("text-anchor",'middle');

	svg.append('g')
		.attr("class", "x-axis")
		.attr("transform","translate(0," + height +')' )
		.call(xAxis)
		.selectAll("text")
		.attr("dx","0em") 
		.style("fill","white")
		.style("text-anchor","middle")
		.style("font-size","12px");

	// svg.append('g')
	// 	.attr("class", "y-axis")
	// 	.call(yAxis);
});



