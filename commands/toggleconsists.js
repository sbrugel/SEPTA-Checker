const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

var name = 'toggleconsists', desc = 'For each train, switch between general consist info and exact car numbers'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
        if (config.verboseConsists) {
            config.verboseConsists = false;
            return interaction.reply({content:'Now showing general consist info for each train (number of coaches, train type).', ephemeral: true});
        } else {
            config.verboseConsists = true;
            return interaction.reply({content:'Now showing exact car numbers for each train.', ephemeral: true});
        }
	},
};