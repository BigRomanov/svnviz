// 
// Cosider creating the following classes
// Axis
// Series 
// Values

// Global settings
var g_width = 1024;
var g_height = 300;
var g_edge = 50;

// ////////////////////////////////////////////////////////
// Classes 
function Axis(x,y,dx,dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    
    this.length = function() {
        if (this.x == this.dx) { // this is a y axis
            return this.y - this.dy;
        }
        
        if (this.y == this.dy) { // this is a x axis
            return this.dx - this.x;
        }
    }
    
    this.draw = function(paper) {
        // Draw axis
        var axisPath = "M " + this.x + " " + this.y + " L " + this.dx + " " + this.dy;
        var axis = paper.path(axisPath);
        axis.attr({stroke: '#aaa', 'stroke-width': 1,'arrow-end': 'classic-wide-long'});  
    }
}

function Value(label, value) {
    this.label = label;
    this.value = value;
}

// ////////////////////////////////////////////////////////
// we assume all positive values here
function getMaxValue(series)
{
    if (series.length == 0) {
        return 0;
    }
    
    var maxValue = series[0];
    for (var i = 1; i < series.length; i++) {
        if (series[i].value > maxValue.value)
        {
            maxValue = series[i];
        }
    }
    return maxValue;
}

// ////////////////////////////////////////////////////////
// Drawing functions

// Draw a color axis parallel to X for each contributor
function drawXAxis(paper, offset, color)
{
    var axisY = (g_height - g_edge - offset);
    var axisPath = "M " + (g_edge) + " " + axisY + " L " + (g_width - g_edge) + " " + axisY;
    var axis = paper.path(axisPath);
    axis.attr({stroke: color, 'stroke-width': 1});  
}

function drawMarker(paper,x,y,label, orientation)
{
    orientation = typeof orientation !== 'undefined' ? orientation : "x";
    var markerHeight = 5;
    var markerPath;
    var labelX = x;
    var labelY = y + 10; // TODO: Replace with constant
    if (orientation == "x") // this is an X axis marker
    {
        markerPath = "M " + x + " " + y + " L " + x + " " + (y - markerHeight);
    }
    else
    {
        markerPath = "M " + x + " " + y + " L " + (x + markerHeight) + " " + y;
        var labelX = x - 10;
        var labelY = y;
    }
    
    var marker = paper.path(markerPath);
    marker.attr({stroke: '#aaa', 'stroke-width': 1});  

    var markerLabel = paper.text(labelX, labelY, label);
    
    var markerLabelWidth = markerLabel.getBBox().width;
    if (markerLabelWidth > 40) // TODO: Make this constant relative to gutter size
    {
        markerLabel.transform("t0,20r-45");
    }
}

// TODO: Make circle size proportional to value
function drawValue(paper,x,y)
{
    var r = 10;
    paper.circle(x,y,r);
}

// demo, receives an array of labels and draws markers for each
function drawMarkers(paper, labels)
{
    var gap = Math.floor((g_width - g_edge) / (labels.length + 1));

    for (var i = 0; i < labels.length; i++) {
        var markerX = g_edge + (i+1) * gap;
        var markerY = g_height - g_edge;
        
        drawMarker(paper, markerX, markerY, labels[i], "x");
    }   
}

function drawSeries(paper, series, xAxis, yAxis)
{
    var xStep = Math.floor((xAxis.length()) / (series.length + 1));
    
    // calculate the y step, by getting the max value
    var maxValue = getMaxValue(series);
    var yStep = Math.floor((yAxis.length()) / (maxValue.value + 1));
    
    for (var i = 0; i < maxValue.value; i++) {
        var x = yAxis.x;
        var y = yAxis.y - (i+1) * yStep ;
        drawMarker(paper, x, y, i+1, "y");
    }
    
    for (var i = 0; i < series.length; i++) {
        var x = xAxis.x + (i+1) * xStep;
        var y = yAxis.y;
        
        var value = series[i];
        
        drawMarker(paper, x, y, value.label, "x");
        
        console.log(y - value.value*yStep);
        drawValue(paper, x, y - value.value*yStep);
    }
}

function initializePane()
{
    console.log("Creating viz pane");

    var paper = new Raphael(document.getElementById('viz_pane'), g_width, g_height);  
    
    var xAxis = new Axis(g_edge, g_height - g_edge, g_width - g_edge, g_height - g_edge);
    xAxis.draw(paper);
    
    //console.log(xAxisPath);
    var yAxis = new Axis(g_edge, g_height - g_edge, g_edge, g_edge);
    yAxis.draw(paper);
    
    // demo drawing x axis
    //drawXAxis(paper, 50, "#ababab");
    //drawXAxis(paper, 100, "#ff0000");

    // some sample values
    var series = new Array();
    series.push(new Value("15.8.2013", 5));
    series.push(new Value("16.8.2013", 2));
    series.push(new Value("17.8.2013", 7));
    series.push(new Value("19.8.2013", 9));
    
    drawSeries(paper, series, xAxis, yAxis);
    
}

$(document).ready(function() {
    initializePane();
});
