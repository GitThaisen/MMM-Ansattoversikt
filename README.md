# MagicMirror² Module: MMM-Ansattoversikt
Module for the MagicMirror showing employees at NRK Medieutvikling with data from a Google spreadsheet and Slack. A random employee will be picked every nth seconds.

## Prerequisities

A Google spreadsheet listing all the employees and a Google Drive API service account. A description of the setup can be found [here](https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html)

## How to install
Remote into your MagicMirror installation and go to the modules folder:

`cd ~/MagicMirror`

Clone the repository:

`git clone https://github.com/nrkno/MMM-Ansattoversikt`

Install dependencies:

`npm install`

Add the module to the modules array in the config/config.js file:

    {
    	module: 'MMM-Ansattoversikt',
    	position: 'bottom_left',
    	config: {
    			slackToken: 'aaaa-bbbbb-ccccc-dddd-12344',
    			googleSpreadSheetId: '',
    			updateInterval: '10'
    			}
    },

## Configuration options

<table style="width:100%">
	<tr>
		<th>Option</th>
		<th>Comment</th>
		<th>Default</th>
	</tr>
	<tr>
		<td>slackToken</td>
		<td>You must create a test token for the [Slack API](https://api.slack.com/tokens) </td>
		<td>aaaa-bbbbb-ccccc-dddd-12344</td>
	</tr>
	<tr>
		<td>googleSpreadSheetId</td>
		<td>The unique id for your spreadsheet</td>
		<td>11122233344aaabbbcccddd</td>
	</tr>
    <tr>
        <td>updateInterval</td>
        <td>How long each employee will be visible on screen (in seconds)</td>
        <td>10</td>
    </tr>
</table>
