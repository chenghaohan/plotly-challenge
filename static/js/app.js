//test and preview dataset
d3.json('samples.json').then(function(data){
    console.log(data)
})

// Main function that update demo info and three graphs 
function updateWeb(sample) {

d3.json("samples.json").then( function(data) {
    var metadata = data.metadata;
   
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // select sample metadata div in HTML
    var PANEL = d3.select("#sample-metadata");

    // empty HTML to clear existing data
    PANEL.html("");


    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
//------------------------------define var---------------------------------------------------------------
d3.json("samples.json").then( function(data) {

//samples value var for bar and bubble charts
  var result = data.samples.filter(sampleObj => sampleObj.id == sample)[0];

  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;

  //freq variables for GAUAGE 
  var wfreqcy = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;

//------------------------------bubble---------------------------------------------------------------
  // Build a Bubble Chart
  var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
    margin: { t: 30}
  };
  var bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
  ];

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

//------------------------------barchart---------------------------------------------------------------
  //Build a barchart to show top 10 bacterias found
  var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  var barData = [
    {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }
  ];

  Plotly.newPlot("bar", barData, barLayout);

//------------------------------Gauge---------------------------------------------------------------
  //Build Gauge Graph
if (wfreqcy == null) {
    wfreqcy = 0}

// color scale indicator of the graph
var trace1 = {
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreqcy,
    type: "indicator",
    mode: "gauge",
    gauge: {
        axis: {
            range: [0, 9],
            tickmode: 'linear',
            tickfont: {
                size: 15
            }
        },
        bar: { color: 'rgba(8,29,88,0)' }, 
        steps: [
            { range: [0, 1], color: 'rgb(255,255,217)' },
            { range: [1, 2], color: 'rgb(237,248,217)' },
            { range: [2, 3], color: 'rgb(199,233,180)' },
            { range: [3, 4], color: 'rgb(127,205,187)' },
            { range: [4, 5], color: 'rgb(65,182,196)' },
            { range: [5, 6], color: 'rgb(29,145,192)' },
            { range: [6, 7], color: 'rgb(34,94,168)' },
            { range: [7, 8], color: 'rgb(37,52,148)' },
            { range: [8, 9], color: 'rgb(8,29,88)' }
        ]
    }
};

// determine angle for each wfreq segment on the chart
var angle = (wfreqcy / 9) * 180;

// calculate end points for triangle pointer path
var degrees = 180 - angle;
var radius = 0.6;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);


var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    cX = String(x),
    cY = String(y),
    pathEnd = ' Z';
var path = mainPath + cX + " " + cY + pathEnd;

// Needle trade to point out data
var Needle = {
    type: 'scatter',
    showlegend: false,
    x: [0],
    y: [0],
    marker: { size: 35, color: '850000' },
    name: wfreqcy,
    hoverinfo: 'name'
};

// Gauge layout trace
var Gaugelayout = {

    // draw the needle pointer shape using path defined above
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
    }],
    font: {
        family: 'Quicksand'
    },
    hoverlabel: {
        font: {
            family: 'Quicksand',
            size: 16
        }
    },
    title: {
        text: `Belly Button Washing Frequency <br> Scrubs per Week`,
        font: {
            size: 20
        },
    },
    height: 500,
    width: 500,
    xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
    },
    yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-0.5, 1.5]
    }
};

// create a data array from the two traces
var GaugedData= [trace1, Needle];

// plot the gauge chart
Plotly.newPlot('gauge', GaugedData, Gaugelayout);

});
}
//---------------------------creating initiation function-----------------------------------------
function init() {
//define a selector used to change dataset
var selector = d3.select("#selDataset");

// loops thru sample list and push rach sampel id to the selector
d3.json("samples.json").then(function(data) {
  var sampleNames = data.names;

  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  var initData = sampleNames[0];
  updateWeb(initData);
});
}

//Build a function to update data/graphs when user changed choose a new ID 
function optionChanged(id) {
updateWeb(id);
}

//call init function to show the default data on the webpage
init();
