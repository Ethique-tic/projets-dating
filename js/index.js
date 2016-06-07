function Location(title, locName, date, lat, lng) {
	this.title = title;
	this.locName = locName;
	this.date = date;
	this.lat = lat;
	this.lng = lng;
}

var data = [
	/*new Location('Order processed', 'Phoenix, AZ, USA', new Date(2015, 3, 10), 33.43, -112.15),
	new Location('Picked up by courier', 'Phoenix, AZ, USA', new Date(2015, 3, 11), 33.43, -112.15),
	new Location('Departed depot', 'Phoenix, AZ, USA', new Date(2015, 3, 12), 33.67, -112.11),
	new Location('Cleared customs', 'LAX, CA, USA', new Date(2015, 3, 15), 34.05, -117.65),
	new Location('Departed country', 'LAX, CA, USA', new Date(2015, 3, 15), 34.05, -117.65),
	new Location('Arrived in country', 'Auckland, NZ', new Date(2015, 3, 17), -37.00, 174.78),
	new Location('Cleared customs', 'Auckland, NZ', new Date(2015, 3, 18), -37.00, 174.78),
	new Location('Picked up by courier', 'Auckland, NZ', new Date(2015, 3, 18), -37.00, 174.78),
	new Location('ETA', 'Hamilton, NZ', new Date(2015, 3, 20), -37.80, 175.28)*/
	new Location('Minitel rose', 'Paris, FR', new Date(1992, 3, 5), 48.52, 2.2),
	new Location('match.com premier site de rencontre', 'Dallas, USA', new Date(1995, 1, 1), 32.74, -96.77),
	new Location('Beautiful people: premier site où les utilisateurs peuvent décliner adhésion de membre', 'Copenhagen, DK', new Date(2000, 1, 1), 55.68, 9.77),
	new Location('Meetic apparition france', 'Paris, FR', new Date(2002,11, 5), 48.72, 2.0),
	new Location('Apparition Ashley Madison', 'Vancouver, CAN', new Date(2002,12, 5), 49.25, -123.11),
	new Location('4% utilisateurs de sites en Europe', '', new Date(2005,5,8), 47.53, 10.58),
	new Location('6% utilisateurs de sites en Europe', '', new Date(2006,5,8), 47.50, 10.60),
	new Location('pic Meetic selon google trends', 'Paris, FR', new Date(2007,3,8), 48.53, 2.58),
	new Location('9% d’utilisateurs en Europe', '', new Date(2007,5,8), 47.60, 10.58),
	new Location('20% d’utilisateurs en Europe', '', new Date(2008,5,8), 47.53, 10.50),
	new Location('Apparition de Gleeden', 'Paris, FR', new Date(2009,2,25), 48.7, 2.1),
	new Location('Grindr (premier site de géolocalisation)', 'Los Angeles, USA', new Date(2009,3,25), 33.98, -118.22),
	new Location('Apparition Tinder', 'San Francisco, USA', new Date(2012,2,15), 37.69, -122.35),
	new Location('Création du site "adopte un nègre" pour dénoncer la discrimination sur les sites de rencontre', '', new Date(2013,2,15), 37.69, -122.35 ),
	new Location('Arracher affiches de Gleeden manif pour tous', 'Paris, FR', new Date(2014,9,8), 37.69, -122.35),
	new Location('Egypte utilise Grindr pour la chasse aux LGBTQI', 'Caire, EG', new Date(2014,9,12), 30.04, 31.24),
	new Location('Ashley Madison scandale(hackers/révélations)', 'USA', new Date(2015,8,19), 38.25, -100.00)

];

var colTop = "#27a4e5",
	 colBottom = "#27cfe5";

var map = L.map('map', {zoomControl: false, worldCopyJump: true}).setView([data[data.length - 1].lat, data[data.length - 1].lng], 4);

L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 2,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

var markerIcon = L.divIcon({className: 'map__marker'});

// Add a marker and popup for each data point
data.forEach(function(d) {
	var marker = L.marker([d.lat, d.lng], { icon: markerIcon }).addTo(map);
	marker.bindPopup(d.title + '<br>' + d.locName);
	d.marker = marker;
});

// Timeline creation

var margin = {top: 10, right: 0, bottom: 50, left: 70},
	width = 272 - margin.left - margin.right,
	height = (data.length * 80) - margin.top - margin.bottom;

var vis = d3.select('#timeline')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
var labelsGroup = vis.append('g')
	.classed('timeline__labels', true);

var linksGroup = vis.append('g')
	.classed('timeline__lines', true);

var timeScale = d3.time.scale()
	.domain([data[0].date, data[data.length - 1].date])
	.range([0, height]).nice(d3.time.year);

var colorScale = d3.time.scale()
	.domain([0, height])
	.range([colTop, colBottom]);

var axis = d3.svg.axis()
	.scale(timeScale)
	.orient('left')
	.tickValues(data.map(function(d) { return d.date }))
    .tickFormat(d3.time.format('%Y'))//%Y-for year boundaries, such as 2011
	.tickSize(0, 0)
	.tickPadding(20);

var lineGradient = vis.append('linearGradient')
	.attr('id', 'lineGradient')
	.attr('x1', 0).attr('x2', margin.top)
	.attr('y1', 0).attr('y2', height)
	.attr("gradientUnits", "userSpaceOnUse");

lineGradient.append("stop")
	.attr("offset", "0")
	.attr("stop-color", colTop);

lineGradient.append("stop")
	.attr("offset", "1")
	.attr("stop-color", colBottom);

var axisEl = vis.append('g')
	.classed('timeline__line', true)
	.call(axis);

// Add a circle to each date on the timeline
axisEl.selectAll('.tick')
	.append('circle')
	.classed('timeline__point', true)
	.attr('r', 6)
	.attr('stroke', function(d) { return colorScale(timeScale(d)) });

// Moving the timeline line behind the points
var line = axisEl.select('.domain').remove();
axisEl.node().insertBefore(line.node(), axisEl.node().children[0]);

var labelPadding = 10;	// Top/bottom padding around each label

var placeholder = labelsGroup.append('text');
// Getting the height of each label by adding each to the DOM then grabbing its bounds
var nodes = data.map(function(d) {
	var bounds = placeholder.text(d.title)[0][0].getBBox();
	return new labella.Node(timeScale(d.date), bounds.height + (labelPadding * 2), d);
});

placeholder.remove();

var renderer = new labella.Renderer({
	layerGap: 20,
	nodeHeight: 150,
	direction: 'right'
});

function drawLabels(nodes) {
	renderer.layout(nodes);
	
	var labels = labelsGroup.selectAll('.timeline__label')
		.data(nodes)
		.enter()
		.append('g')
		.classed('timeline__label', true)
		.attr('transform', function(d){ return 'translate(' + d.x + ',' + (d.y - d.dy/2) + ')'; });
	
	labels.append('text')
		.text(function(d) { return d.data.title })
		.attr('dominant-baseline', 'central')
		.attr('y', labelPadding)
		.attr('dy', '0.55em');
	
	labels.on('click', function(d) {
		map.panTo(d.data.marker.getLatLng(), {animate: true})
		d.data.marker.openPopup();
	});
	
	var links = linksGroup.selectAll('.timeline__links')
		.data(nodes)
		.enter()
		.append('path')
		.classed('timeline__link', true)
		.attr('d', function(d){ return renderer.generatePath(d); });
	
	linksGroup.attr('transform', 'translate(15, 0)');
	labelsGroup.attr('transform', 'translate(20, 0)');
}

var force = new labella.Force()
	.nodes(nodes)
	.on('end', function() {
		drawLabels(force.nodes());
	}).start(100);