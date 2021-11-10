const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const { updateConfig } = require('../utils/utils');

var name = 'toggleviewpast', desc = 'Toggle exclusion of trains from view list if they have left their associated station'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
        if (config.viewpast) {
            config.viewpast = false;
            updateConfig(config);
            return interaction.reply({content:'Trains will no longer appear on the info board if they have left their associated station.', ephemeral: true});
        } else {
            config.viewpast = true;
            updateConfig(config);
            return interaction.reply({content:'Trains will now appear on the info board regardless if they have left their associated station.', ephemeral: true});
        }
	},
};