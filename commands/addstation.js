const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
const config = require('../config.json');
const rp = require('request-promise');
const cheerio = require('cheerio');

let name = 'addstation', desc = 'For a train being tracked, add a station to check the estimated arrival time for.' , trainparam = 'train', optdesc = 'Check the estimated arrival time for this train number at the station specified in the command.',
stationparam = 'station', optdesc2 = 'The station to add to this train.'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
        .addStringOption(option =>
            option.setName(trainparam)
                .setDescription(optdesc)
                .setRequired(true))
        .addStringOption(option =>
            option.setName(stationparam)
                .setDescription(optdesc2)
                .setRequired(true)),
	async execute(interaction) {
        interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }

        const { options } = interaction
        if (config.stations.indexOf(options.getString(stationparam)) == config.trains.indexOf(options.getString(trainparam)) && config.trains.indexOf(options.getString(trainparam)) != -1) { 
            //this exact station is being tracked for this exact train
            //this also checks if the train exists, purely since if it is not checked, it will state that a nonexistent train is being tracked
            //(e.g. I set a station for train #5205, which is not being tracked, it will result in this message if the second conditional if not checked, misleading me
            //into thinking that 5205 is being tracked)
            return interaction.followUp({content: `Train ${options.getString(trainparam)} is already being tracked at ${options.getString(stationparam)}!`, ephemeral: true});
        } else if (options.getString(stationparam).length < 4) { //too short of a name, thus too vague
            return interaction.followUp({content: `The station name you have entered is too short. Please enter a name that is 4 characters or longer.`, ephemeral: true});
        } else {
            for (let i = 0; i < config.trains.length; i++) { //find the train number in the trains list
                if (config.trains[i] == options.getString(trainparam)) {
                    let url = "http://trainview.septa.org/" + options.getString(trainparam);
                    const result = await rp.get(url);
                    const $ = cheerio.load(result);
                    
                    let iteration = 0;
                    let run = 0; //increment through every cell of the table

                    let foundstation = false;

                    $("table > tbody > tr > td").each((index, element) => { //run through every cell of the table
                        iteration = run % 5; //0, 1, 2, 3, or 4
                        //we are only looking for iterations 0 and 3 (station name, estimated arrival)
                        if (iteration == 0) { //station name
                            if ($(element).text().toLowerCase().includes(options.getString(stationparam).toLowerCase())) {
                                foundstation = true;
                            }
                        }
                    });

                    if (!foundstation) { //this station does not exist in the service, it seems
                        return interaction.followUp({content: `Train ${config.trains[i]} does not seem to serve ${options.getString(stationparam)}, or you may have mistyped the station. In some cases, punctuation may be essential for this command to work, e.g. St. Davids and not St Davids.`, ephemeral: true});
                    }
                    //since this station is valid...
                    config.stations[i] = options.getString(stationparam);
                    updateConfig(config);
                    return interaction.followUp({content: `Train ${config.trains[i]} is now being tracked at ${config.stations[i]}.`, ephemeral: true});
                }
            }
            return interaction.followUp({content: `Train ${options.getString(trainparam)} could not be found in your tracking list.`, ephemeral: true});
        }
	},
};