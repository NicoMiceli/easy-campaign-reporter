//Debug Mode
var debugMode = true;

$(document).ready(function($) {
	if (debugMode) {
		$("#autofill").click(function() {
			$("#metric").val("ga:sessions");
	    	$("#dim").val("ga:date");
	    	$("#start").val("2016-12-01");
	    	$("#end").val("2017-02-28");
		});	
	};
	$("#error").hide();
});


gapi.analytics.ready(function() {

	var gaID = "";
	var options = {
		ids: ""
	};
	var startDate, endDate, gaOutput;

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
		//console.log("campaign = " + campaign)
		//grabDates("start","end");

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
			//pullCampaignParam()
			
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
		};

		//console.log("button clicked")
		dataTable.on('success', function(response) {
			console.log(response);
			console.log(response.query.metrics[0])
			//console.log(JSON.stringify(response.totalsForAllResults))
			for (var prop in response.totalsForAllResults) {
				console.log(response.totalsForAllResults)
				console.log('break')
				break;
			};
			console.log(Object.keys(response.totalsForAllResults)[0])
			console.log(Object.values(response.totalsForAllResults)[0])
			$("#result-text").html("<h2>Results:</h2><p class='lead'>There were <b>"+Object.values(response.totalsForAllResults)[0]+"</b> "+Object.keys(response.totalsForAllResults)[0]+" between "+grabValue('start')+" and "+grabValue('end')+"</p>")

		});
		dataTable.on('error', function(response){
			console.log('error');
			console.log(response.error.message)
		});
		dataChart.on('error', function(response){
			console.log('error');
			$("#error").show();
			$('#error-msg').html(response.error.message)
		});

		dataTable.execute();
		dataChart.execute();
		$("#error").hide();
	});
});