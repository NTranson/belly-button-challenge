// Set the data endpoint/url
const dataendpoint =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data;
// Fetch JSON data and console log it
d3.json(dataendpoint).then(function (result) {
  data = result;
  console.log("raw data", data);

  init();
});

// Function to initialize the dashboard
function init() {
  // Get a list of Test Subject ID Numbers
  const names = data.names
//   console.log("Test Subject IDs", names);

  // Populate the DropDown with the Test Subject IDs
  const dropdown = d3.select("#selDataset");
  names.forEach((subject) => {
    dropdown.append("option").text(subject).property("value", subject);
  });

  // Use the first Subject when initializing the Dashboard
  const firstSubject = names[0];
  optionChanged(firstSubject);
};


// Functin to create the bar chart
function createBar(id) {
    let subject = data.samples.find(obj => obj.id == id)
    // console.log("subject", subject)
    let trace1 = [{
        type: 'bar',
        x: subject.sample_values.slice(0, 10).reverse(),
        y: subject.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        orientation: 'h',
        text: subject.otu_labels.slice(0, 10).reverse()
      }];
      
      Plotly.newPlot('bar', trace1);
};


// Function to create the bubble chart
function createBubble(id) {
    const samples = data.samples.find(obj => obj.id == id)
    // console.log(samples)
    var trace2 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        text: samples.otu_labels,
        mode: 'markers',
        marker: {
          color: samples.otu_ids,
          size: samples.sample_values
        }
      };
      
      var data1 = [trace2];
      
      var layout = {
        title: 'OTU IDs and Their Values',
        xaxis: {title: { text: "OTU IDs"}},
        yaxis: {title: { text: "OTU Values"}},
        showlegend: false,
        // height: 600,
        // width: 600
      };
      
      Plotly.newPlot('bubble', data1, layout);
};


// Function to create MetaData
function createMetaData(id) {
    const metadata = data.metadata.find(obj => obj.id == id)
    const metadataEl = d3.select("#sample-metadata");
    metadataEl.html("")
    Object.entries(metadata).forEach((subject) => {
        metadataEl.append("p").text(`${subject[0]}: ${subject[1]}`);
        // console.log(`${subject[0]}: ${subject[1]}`)
      });
};


// Function to update the Dashbaord
function optionChanged(id) {
  createBar(id);
  createBubble(id);
  createMetaData(id);
};