// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.find(meta => meta.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
  });
});
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const selectedSample = samples.find(s => s.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = selectedSample.otu_ids;
    const sampleValues = selectedSample.sample_values;
    const otuLabels = selectedSample.otu_labels;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Viridis'
      }
  };
  
  const bubbleData = [bubbleTrace];
  const bubbleLayout = {
      title: 'OTU ID vs Sample Values',
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false
  };

    // Render the Bubble Chart
    Plotly.newPlot("bubble-chart", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
  };
  
  const barData = [barTrace];
  const barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
  };

    // Render the Bar Chart
    Plotly.newPlot("bar-chart", barData, barLayout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach(sample => {
      dropdown.append("option")
          .text(sample)
          .property("value", sample);
  });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
});
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
</script>
</body>
</html>