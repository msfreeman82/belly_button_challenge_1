// Load the URL into a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Initialize the dashboard when the data is loaded
dataPromise.then(data => {
    // Select the dropdown menu for sample selection
    var selector = d3.select("#selDataset");

    // Get all the sample names from the data
    var sampleNames = data.names;

    // Add the sample names to the dropdown menu options
    sampleNames.forEach(sample => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Set the first sample name as the initial sample displayed on the dashboard
    var initialSample = sampleNames[0];

    // Show information and charts for the initial sample
    buildMetadata(initialSample, data);
    buildCharts(initialSample, data);
});

// This function runs when the user selects a new sample from the dropdown menu
function optionChanged(newSample) {
    // Update the information and charts for the new sample
    dataPromise.then(data => {
        buildMetadata(newSample, data);
        buildCharts(newSample, data);
    });
}

// This function shows the demographic information for the selected sample
function buildMetadata(sample, data) {
    // Get the metadata for all samples
    var metadata = data.metadata;

    // Filter the metadata to only include the selected sample
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = metadataArray[0];
    var PANEL = d3.select("#sample-metadata");

    // Clear the previous demographic information
    PANEL.html("");

    // Show the demographic information for the selected sample
    Object.entries(selectedSample).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
    });
}

// This function shows the charts for the selected sample
function buildCharts(sample, data) {
    // Get all the sample data
    var samples = data.samples;

    // Filter the sample data to only include the selected sample
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Filter the metadata data to only include the selected sample
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];

    // Get the data for the selected sample
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    var wfreq = metadataArray[0].wfreq;

    // Code for Bar Chart
      // Create y labels and use the slice function to only get the top 10
      var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();

      // Reverse the x axis to ensure the bar chart has biggest on top down
      var barData = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation: "h",
          text: otu_labels.slice(0,10),
      }];
  
  
      // Create the bar chart
      Plotly.newPlot("bar", barData);
  
    // Code for Gauge Chart
 // Trig to calc meter point
 var degrees = 180 - wfreq * 20,
 radius = .5;
var radians = degrees * Math.PI / 180;  // Calculate the angle in radians for the needle on the gauge chart
var x = radius * Math.cos(radians); // Calculate the x-coordinate for the needle
var y = radius * Math.sin(radians); // Calculate the y-coordinate for the needle

// Create the path for the needle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX, space, pathY, pathEnd);

// Create the path for the needle
var mainPath = 'M ',
pathX1 = -1 * Math.sin(radians) * .025,
pathY1 = Math.cos(radians) * .025,
pathX2 = -1 * pathX1,
pathY2 = -1 * pathY1; 

var path = mainPath.concat(pathX1, ' ', pathY1, ' L ', pathX2, ' ', pathY2, ' L ', String(x), ' ', String(y), ' Z'); 

// Create the data for the scatter plot and the pie chart 
var scatterData = { 
type: 'scatter',
x: [0], y: [0],
marker: {
    size: 28, 
    color:'850000',
    },
showlegend: false,
text: wfreq,
hoverinfo: 'text'
};

var pieData = { 
values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
rotation: 90,
text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2','0-1', ''],
textinfo: 'text',
textposition:'inside',	  
marker: { 
    colors: ['rgba(15, 128, 0, .5)', 'rgba(15, 128, 0, .45)', 'rgba(15, 128, 0, .4)',
            'rgba(110, 154, 22, .5)', 'rgba(110, 154, 22, .4)','rgba(110, 154, 22, .3)',
            'rgba(210, 206, 145, .5)','rgba(210, 206, 145, .4)','rgba(210, 206, 145, .3)',
            'rgba(255, 255, 255, 0)']
    },
hole: .5,
type: 'pie',
hoverinfo: 'text',
showlegend: false
};

var gaugeData = [scatterData, pieData];

var gaugeLayout = {
    // Needle
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: { color: '850000' }
    }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 500, width: 500,
    xaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', gaugeData, gaugeLayout);  // Create the gauge chart

    // Code for Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          },
          text: otu_labels
      }];
  
      var bubbleLayout = {
          xaxis: {title: "OTU ID"}
      };
  
      // Create the bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }
  

  