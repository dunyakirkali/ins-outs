// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require select2
//= require d3
//= require_tree .

$(function(){ 
  $(document).foundation();
  $("#countries").select2({ width: 'resolve' });
  $("#years").select2({ width: 'resolve' });
  
  $(window).bind("load", function () {
    var footer = $("#footer");
    var pos = footer.position();
    var height = $(window).height();
    height = height - pos.top;
    height = height - footer.height();
    if (height > 0) {
      footer.css({
        'margin-top': height + 'px'
      });
    }
  });

  var width = $('#options').innerWidth() - 30,
      height = $('body').height() - ($('#options').position().top + $('#options').height()) - 30,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.population; });

  var svg = d3.select("#graph .columns").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var country_data = null;
  
  function draw() {
    country_data.forEach(function(d) {
      d.population = +d.population;
    });

    var g = svg.selectAll(".arc")
        .data(pie(country_data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.age); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.age; });
  }
  
  d3.csv("assets/data.csv", function(error, data) {
    country_data = data;
    draw();
  });
  
  function updateWindow(){
      x = window.innerWidth;
      y = window.innerHeight;

      svg.attr("width", x).attr("height", y);
      draw();
  }
  window.onresize = updateWindow;
  
  $('#info-link').click(function(e) {
    $('html, body').animate({
      scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    e.preventDefault();
  })
});
