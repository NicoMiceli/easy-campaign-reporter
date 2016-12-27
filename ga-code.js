gapi.analytics.ready(function() {

	var gaID = "";
	var options = {
		ids: ""
	};
	var startDate, endDate, gaOutput

	gapi.analytics.auth.authorize({
		container: 'embed-api-auth-container',
		//ADD API KEY HERE:
		clientid: '877106660496-bvm53u3hi8jkb7nfmiait66dfgsmioku.apps.googleusercontent.com'
	});

	var viewSelector = new gapi.analytics.ViewSelector({
		container: 'view-selector-container'
	});

	// Render the view selector to the page.
	viewSelector.execute();

	function grabValue(id) {
		var value = $("#" + id).val();
		return value
	}

	/**
	 * Create a new DataChart instance with the given query parameters
	 * and Google chart options. It will be rendered inside an element
	 * with the id "chart-container".
	 */

	viewSelector.on('change', function(ids) {
		options.ids = ids;
		gaID = ids;
		console.log(options.ids);
	});

	//
	// Button Click 
	//
	$("#get-data").click(function() {
		var campaign = $("#campaign").val();
		console.log("campaign = " + campaign)
		grabDates("start","end");

		var dataChart = new gapi.analytics.googleCharts.DataChart({
			query: {
				ids: gaID,
				metrics: grabValue("metric"),
				dimensions: grabValue("dim"),
				'start-date': grabValue("start"),
				'end-date': grabValue("end")
			},
			chart: {
				container: 'chart-container',
				type: 'LINE',
				options: {
					width: '100%'
				}
			}
		});

		var dataTable = new gapi.analytics.report.Data({
			query: {
				ids: gaID,
				metrics: grabValue("metric"),
				dimensions: grabValue("dim"),
				'start-date': grabValue("start"),
				'end-date': grabValue("end")
			}
		})

		if (campaign.length > 0) {
			dataTable.set({
				query: {
					filters: "ga:campaign==" + campaign
				}
			})
			dataChart.set({
				query: {
					filters: "ga:campaign==" + campaign
				}
			})
		}

		console.log("button clicked")
		dataTable.on('success', function(response) {
			console.log(response);
		})
		dataTable.execute();
		dataChart.execute();
	});
});