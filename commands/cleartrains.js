const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
const config = require('../config.json');

var name = 'cleartrains', desc = 'Remove all tracked trains.'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),

	async execute(interaction) {
	    interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }
        if (config.trains.length == 0) {
            return interaction.followUp({content:'This bot is not tracking any trains.', ephemeral: true});
        } else {
            config.trains = [];
            config.stations = [];
            updateConfig(config);
            return interaction.followUp({content:'The list of trains being tracked has been cleared.', ephemeral: true});
        }
	},
};