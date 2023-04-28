  // set the dimensions and margins of the graph
  const margin = {
          top: 10,
          right: 15,
          bottom: 20,
          left: 10
      },
      width = 360 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom; //orig=400

  // append the svg object to the body of the page
  const svg = d3.select("#chartDiv")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // get currentYear value on slider change
  let currentYear = 1961;
  let csvPath = `data/plantheatstress_count_${currentYear}.csv`

  parent.document.onreadystatechange = () => {
      if (parent.document.readyState === 'complete') {

          function callback(mutationList, observer) {
              mutationList.forEach((mutation) => {
                  currentYear = parent.document.getElementById('yearSlider-handle-0').getAttribute('aria-valuenow')
                  csvPath = `data/plantheatstress_count_${currentYear}.csv`
                  svg.selectAll("svg").remove()
                  svg.selectAll("g").remove()
                  svg.selectAll("rect").remove()
                  svg.selectAll("line").remove()

                  updateChart()
              })
          };

          const targetNode = parent.document.getElementById('yearSlider-handle-0');
          const observerOptions = {
              attributes: true
          };

          const observer = new MutationObserver(callback);
          observer.observe(targetNode, observerOptions);
      }
  };

  let min = 0;
  let max = 70

  // get the data
  const updateChart = () => {
      d3.csv(csvPath, (data) => {

          // X axis: scale and draw:
          const x = d3.scaleLinear()
              .domain([min, max])
              .range([0, width]);
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // set the parameters for the histogram
          const histogram = d3.histogram()
              .value(function(d) {
                  return d.indicator;
              })
              .domain(x.domain()) // then the domain of the graphic
              .thresholds(x.ticks(40)); // then the numbers of bins

          // And apply this function to data to get the bins
          const bins = histogram(data);

          // Y axis: scale and draw:
          const y = d3.scaleLinear()
              .range([height, 0]);
          y.domain([0, d3.max(bins, function(d) {
              return d.length;
          })]); // d3.hist has to be called before the Y axis 
          // svg.append("g")
          //     .call(d3.axisLeft(y));

          //make custom colors
          //let colorscale = colorbrewer['RdYlGn']['11'].reverse();
          var color = d3.scaleQuantize()
              //  .domain([0, 70])
              .range(d3.schemeRdYlGn['11'].reverse());

          color.range().forEach(function(d) {
                  console.log(color.invertExtent(d))
              })
              // append the bar rectangles to the svg element
          svg.selectAll("rect")
              .data(bins)
              .enter()
              .append("rect")
              .attr("x", 1)
              .attr("transform", function(d) {
                  return "translate(" + x(d.x0) + "," + y(d.length) + ")";
              })
              .attr("width", function(d) {
                  return x(d.x1) - x(d.x0); // ended in -1 here
              })
              .attr("height", function(d) {
                  return height - y(d.length);
              })
              .style("fill", function(d) {
                  return color.invertExtent(d)
              })

          // add average line on graph
          const dataSum = d3.sum(data, function(d) {
              return d.indicator;
          });
          svg.append("line")
              .attr("y1", 0) // x1 and y1 are first endpoint
              .attr("y2", height)
              .attr("x1", x(dataSum / data.length)) //x2 and y2 are second endpoint
              .attr("x2", x(dataSum / data.length))
              .style("stroke", "black")
      });
  }
  updateChart();