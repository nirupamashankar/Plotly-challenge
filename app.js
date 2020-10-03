  // Use D3 fetch to read the JSON file
  var jsonData;
   d3.json("samples.json").then((data) => {
    //console.log(data)
    jsonData=data;

  // set a function for populating drop down
    populateDropDown();
    
  });
  // populate the drop down list with ids from sample set
    function populateDropDown() { 
      
  // select the panel to put data
      var dropdown = d3.select('#selDataset');
      jsonData.names.forEach((name) => {
      dropdown.append('option').text(name).property('value', name);
      });
      
  // set 940 as place holder ID
      populatedemographics(jsonData.names[0]);
      visuals(jsonData.names[0]);
    };
  
  // set a function for working with demgraphic info panel
  function populatedemographics(id) {

  //filter data with id, select the demographic info with appropriate id
  
  var filterMetaData= jsonData.metadata.filter(meta => meta.id.toString() === id)[0];
  
  // select the panel to put data
  var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(filterMetaData).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    };
    
    
function optionChanged(id) {
  
  populatedemographics(id);
  
  visuals(id);
  };


function visuals(id) {
  
  d3.json("data/samples.json").then((data)=> {
    
  var samples = data.samples.filter(s => s.id.toString() === id)[0];

  // get only top 10 otu ids for the plot OTU and reversing it. 
  var sampleValues =  samples.sample_values.slice(0, 10).reverse();
  
  var OTU_top =  (samples.otu_ids.slice(0, 10)).reverse();
     
// get the otu ids to the desired form for the plot
  var OTU_id = OTU_top.map(d => "OTU " + d);
  var washfreq = data.metadata.filter(wfreq => wfreq.id.toString() === id)[0];
     
// get the top 10 labels for the plot
  var labels =  jsonData.samples[0].otu_labels.slice(0,10);
  
  //start setting up for bar graph
  
  //create trace
  var trace = {
      x: sampleValues,
      y: OTU_id,
      text: OTU_top,
      marker: {
      color: samples.otu_ids},
      type:"bar",
      orientation: "h",
  };
  // create data variable
  var data11 = [trace];

  // create layout variable to set plots layout
  var layout = {
      title: "Top 10 OTU",
      yaxis:{
          tickmode:"linear",
      },
      margin: {
          l: 80,
          r: 80,
          t: 40,
          b: 30
      }
  };

  // create the bar plot
Plotly.newPlot("bar", data11, layout);
  
// start setting up for the bubble plot

// create trace 
var trace1 = {
  x: samples.otu_ids,
  y: samples.sample_values,
  mode: "markers",
  marker: {
      size: samples.sample_values,
      color: samples.otu_ids
  },
  text: samples.otu_labels

};

// set the layout for the bubble plot
var layout = {
  xaxis:{title: "OTU ID"},
  height: 600,
  width: 1300
};

// create the data variable 
var data1 = [trace1];

// create the bubble plot
Plotly.newPlot("bubble", data1, layout); 

/*var data = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: 270,
		title: { text: "Speed" },
		type: "indicator",
    mode: "gauge+number"
    color: 
	}
];*/
var data12 = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 10,
    title: { text: "Belly Button Washing Frequency (Scrubs per Week)" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 6 },
    gauge: {
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 2], color: "lightgreen" },
        { range: [2, 4], color: "green" }
      ],
      threshold: {
        line: { color: "black", width: 4 },
        thickness: 0.75,
        value: washfreq.wfreq
      }
    }
  }
];


var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };


Plotly.newPlot('gauge', data12, layout);
  });

}