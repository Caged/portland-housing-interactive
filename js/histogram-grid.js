var el = d3.select(".js-vis"),
    ewidth = parseFloat(el.style("width")),
    eheight = parseFloat(el.style("height"))

function format(row) {
  let keys = Object.keys(row)
  keys.forEach(function(k) { row[k] = +row[k] })
  return row
}

d3.csv("data/sfr-sales.csv", format, function(err, data) {
  var years = d3.nest()
    .key(function(d) { return d.year })
    .sortKeys(d3.descending)
    .entries(data)

  var list = el.append('ol')
    .attr('class', 'histogram-list columns is-multiline')

  var card = list.selectAll('.histogram-card')
    .data(years)
  .enter().append("li")
    .attr("class", "histogram-card is-one-quarter column")

  card.append("div")
    .text(function(d) { return d.key })

  var margin = { top: 10, right: 10, bottom: 20, left: 10 },
      width = parseInt(card.style('width')) - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom,
      thresholds = d3.range(-100, 100,10)

  var x = d3.scaleLinear()
    .domain(d3.extent(thresholds))
    .rangeRound([0, width])

  var y = d3.scaleLinear()
    .range([height, 0])

  var histo = d3.histogram()
      .domain(x.domain())
      .thresholds(thresholds)

  var vis = card.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  vis.each(function(sales) {
    let changes = sales.values.map(function(d) { return d.percent_increase_adjusted }),
        extent = d3.extent(changes),
        el = d3.select(this),
        bins = histo(changes)

    y.domain([0, d3.max(bins, function(d) { return d.length })])

    let bar = el.selectAll('.bar')
      .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")"
      }).on('click', function(d) { console.log(d);})

    bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", function(d) { return height - y(d.length); });

    el.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  })
})
