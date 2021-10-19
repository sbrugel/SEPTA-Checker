const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
const config = require('../config.json');

var name = 'addstation', desc = 'For a train being tracked, add a station to check the estimated arrival time for.', opt = 'toadd', optdesc = 'The station to add',
opt2 = 'associated', optdesc2 = 'Check the estimated arrival time for this train number at the station specified in the command.'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
        .addStringOption(option =>
            option.setName(opt)
                .setDescription(optdesc)
                .setRequired(true))
        .addStringOption(option =>
            option.setName(opt2)
                .setDescription(optdesc2)
                .setRequired(true)),
	async execute(interaction) {
        interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }

        const { options } = interaction
        if (config.stations.indexOf(options.getString(opt)) == config.trains.indexOf(options.getString(opt2)) && config.trains.indexOf(options.getString(opt2)) != -1) { 
            //this exact station is being tracked for this exact train
            //this also checks if the train exists, purely since if it is not checked, it will state that a nonexistent train is being tracked
            //(e.g. I set a station for train #5205, which is not being tracked, it will result in this message if the second conditional if not checked, misleading me
            //into thinking that 5205 is being tracked)
            return interaction.followUp({content: `Train ${options.getString(opt2)} is already being tracked at ${options.getString(opt)}!`, ephemeral: true});
        } else {
            for (var i = 0; i < config.trains.length; i++) { //find the train number in the trains list
                if (config.trains[i] == options.getString(opt2)) {
                    config.stations[i] = options.getString(opt);
                    updateConfig(config);
                    return interaction.followUp({content: `Train ${config.trains[i]} is now being tracked at ${config.stations[i]}.`, ephemeral: true});
                }
            }
            return interaction.followUp({content: `Train ${options.getString(opt2)} could not be found in your tracking list.`, ephemeral: true});
        }
	},
};