function getPlotlyDefault1(yaxisTitle, xaxisTitle, chartTitle) {
	return {
		title: {
			text: chartTitle,
		},
		margin: { t: 25, b: 25, l: 50, r: 50 },
		plot_bgcolor: "#1a1e24",
		paper_bgcolor: "#1a1e24",
		font: { color: "white" },
		yaxis: {
			gridcolor: "#ffffff66",
			title: {
				text: yaxisTitle,
			},
		},
		xaxis: {
			gridcolor: "#ffffff66",
			title: {
				text: xaxisTitle,
			},
		},
		legend: { orientation: "h" },
	};
}

const DEFAULT_PLOT_2 = { showSendToCloud: true, responsive: true };

function getPlotlyDefault2() {
	return DEFAULT_PLOT_2;
}

export { getPlotlyDefault1, getPlotlyDefault2 };
