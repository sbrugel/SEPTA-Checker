const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

let name = 'untrackalerts', desc = 'Stop tracking alerts for a line'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
        return interaction.reply({content:'Not yet implemented.', ephemeral: true});
	},
};