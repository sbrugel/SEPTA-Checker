const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

var name = 'cleartrains', desc = 'Remove all tracked trains.'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
        if (config.trains.length == 0) {
            return interaction.reply({content:'This bot is not tracking any trains.', ephemeral: true});
        } else {
            config.trains = [];
            return interaction.reply({content:'The list of trains being tracked has been cleared.', ephemeral: true});
        }
	},
};