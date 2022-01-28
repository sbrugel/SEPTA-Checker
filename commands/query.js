const { SlashCommandBuilder } = require('@discordjs/builders');
const rp = require('request-promise');
const cheerio = require('cheerio');
const config = require('../config.json');

let name = 'query', desc = 'Get delay info for a specified train.', opt = 'search', optdesc = 'The train to look up'
const url = 'http://trainview.septa.org/';
const json_url = 'http://www3.septa.org/hackathon/TrainView/';

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
        .addStringOption(option =>
            option.setName(opt)
                .setDescription(optdesc)
                .setRequired(true)),

	async execute(interaction) {
        let result = await rp.get(url);
        let $ = cheerio.load(result);
        let iteration = 0, printstring = '', loopend = false;
	    let run = 0; //increment through every cell of the table

	    interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        $("table > tbody > tr > td").each((index, element) => { //run through every cell of the table
            if (!loopend) {
                iteration = run % 4; //0, 1, 2, or 3
                //iteration 0 is the origin station, which is unused for the purposes of this script
                if (iteration == 1) { //train number
                    if ($(element).text() === interaction.options.getString('search') || ($(element).text() + 'P') === (interaction.options.getString('search') + 'P')) {
                        console.log('true');
                        //for the latter condition, sometimes trains that are part-cancelled run only to/from Philadelphia
                        //and have a "P" appended to their train ID
                        printstring = '**Train no. ' + interaction.options.getString('search') + ' going to ';
                    } else {
                        printstring = '';
                    }
                }
                if (printstring !== '') { //continue adding to the string since the train is valid
                    if (iteration == 2) { //destination
                        printstring += $(element).text() + ' is currently running ';
                    }
                    else if (iteration == 3) { //delay
                        printstring += $(element).text();
                        if ($(element).text() != 'On Time') {
                            printstring += ' late';
                            loopend = true;
                        }
                    }
                }
                run++;
            }
        });

        if (printstring === '') { //train is not running right now
            return interaction.followUp({ content: 'This train could not be found. Either the train is currently not running or the train number you entered is invalid.', ephemeral: true });
        }

        result = await rp.get(json_url);
		$ = cheerio.load(result);
        let jsondata = JSON.parse($('body').text());
		let index = 0;
		for (let j = 0; j < jsondata.length; j++) {
			if (jsondata[j].trainno == interaction.options.getString('search')) {
				index = j;
			}
		}
		if (config.verboseConsists) {
			if (jsondata[index].consist != '') {
				printstring += "** (Train is formed of " + jsondata[index].consist + ". Last at " + jsondata[index].currentstop + ".)";
			} else {
				printstring += "** (No consist data is available. Last at " + jsondata[index].currentstop + ".)";
			}
		} else {
			let traincoaches = jsondata[index].consist.split(',');
			let trainlength = traincoaches.length;
			let traintype = 'Default';
			if (traincoaches[0].length == 4 || traincoaches[0][0] == '9') {
				traintype = 'Loco-Hauled';
			} else if (traincoaches[0][0] == '7' || traincoaches[0][0] == '8') {
				traintype = 'Silverliner V';
			} else if (traincoaches.length == 1) {
				traintype = 'Coach data unavailable'
			} else {
				traintype = 'Silverliner IV'; // because these piles of garbage are unfortunately the most common :-(
			}
			printstring += "** (Train is formed of " + trainlength + " coaches, " + traintype + ". Last at " + jsondata[index].currentstop + ".)";
		}
        return interaction.followUp({ content: printstring, ephemeral: true });
	},
};