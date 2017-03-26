
$(document).ready(function($) {
	$("#autofill").click(function() {
		$("#metric").val("ga:sessions");
	    $("#dim").val("ga:date");
	    $("#start").val("2016-12-01");
	    $("#end").val("2016-12-31");
	});
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

	function pullCampaignParam () { 
		var campaign = $("#campaign").val();
		var campaignName = '';
		console.log('pullCampaignParam')
		if (campaign.match('utm\_campaign\=')) {
			var campaignSubStr = campaign.substring(campaign.indexOf('utm_campaign=')+13);
			console.log(campaignSubStr)
			if (campaignSubStr.match(/\#/)) {
				console.log(campaignSubStr.split("#")[0])
				//return campaignSubStr.split("#")[0];
				campaignName = campaignSubStr.split("#")[0];
			} else if (campaignSubStr.match(/\&/)) {
				console.log(campaignSubStr.split("&")[0])
				//return campaignSubStr.split("&")[0]
				campaignName=campaignSubStr.split("&")[0]
			};
		} else if(campaign.match(/\.|\//)){
			console.log("campaign value \n"+campaign)
		} else {
			console.log('campaign else')
			//return campaign;
			campaignName = campaign
		}
		return campaignName
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
			console.log("campaign if fun" + pullCampaignParam())
			dataTable.set({
				query: {
					filters: "ga:campaign==" + pullCampaignParam()
				}
			})
			dataChart.set({
				query: {
					filters: "ga:campaign==" + pullCampaignParam()
				}
			})
		};

		//console.log("button clicked")
		dataTable.on('success', function(response) {
			console.log(response);
			console.log(response.query.metrics[0])
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

	

