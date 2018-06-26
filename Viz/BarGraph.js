


var margin = {top: 20, right: 20, bottom: 80, left: 40},
 	width = 700 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

// Define SVG

var svg = d3.select("body")
			.append("svg")
			.attr("width",width + margin.right + margin.left)
			.attr("height",height + margin.top + margin.bottom)
			.append("g")
				.attr("transform","translate(" + margin.left + ',' + margin.right +')'); 

// Define the scales

var xScale = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
    yScale = d3.scaleLinear().rangeRound([height, 0]);


// Define the axis

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);


d3.csv("data.csv", function(error, data) { 
	if(error) console.log("Error: Data didn't load");

	data.forEach(function(d){
		d.gdp = +d.gdp;
		d.country = d.country;
		console.log(d.gdp);
	});

	data.sort(function(a,b) {
		return b.gdp - a.gdp;
	});

	xScale.domain(data.map(function(d){return d.country;}));
	yScale.domain([0, d3.max(data,function(d) {return d.gdp;}) ] ); 


	// Draw the bars
	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')

		.attr('x',function(d) {return xScale(d.country)})
		.attr('y',function(d) {return yScale(d.gdp)})
		.attr("width",xScale.bandwidth())
		.attr("height",function(d) {return height - yScale(d.gdp)})

		.style("fill", function(d,i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')'});

		//.delay( function(d,i) { return i * 200; })

    svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')

    .text(function(d){return d.gdp;})

    .attr("x", function(d){ return xScale(d.country) + xScale.bandwidth()/2; }) // Label at the middle of the bar
    .attr("y", function(d){ return yScale(d.gdp+0.1);})
    .attr("font-family", 'sans-serif')
    .attr("font-size", '13px')
    .attr("font-weight", 'bold')
    .attr("fill",'blue')
    .attr("text-anchor",'middle');

	svg.append('g')
		.attr("class", "x-axis")
		.attr("transform","translate(0," + height +')' )
		.call(xAxis)
		.selectAll("text")
		.attr("transform","rotate(-60)")
		.attr("dx","0em") 
		.style("text-anchor","end")
		.style("font-size","12px");

	svg.append('g')
		.attr("class", "y-axis")
		.call(yAxis);
});



