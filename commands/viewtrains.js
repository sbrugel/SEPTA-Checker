const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

var name = 'viewtrains', desc = 'Sends a list of all trains currently being tracked'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
        if (config.trains.length == 0) {
            return interaction.reply({content:'This bot is not tracking any trains. Use /addtrain [train number] to add a train to track!', ephemeral: true});
        } else {
            var toprint = [];
            for (var i = 0; i < config.trains.length; i++) {
                if (config.stations[i] != null) { //a station is also being tracked for this train
                    toprint.push(config.trains[i] + ' (ETA is being tracked at ' + config.stations[i] + ')');
                } else {
                    toprint.push(config.trains[i])
                }
            }
            const embed = new MessageEmbed()
                .setTitle('Currently tracked trains')
                .setDescription(toprint.sort().join(', '))
                .setColor('#0099ff');

            return interaction.reply({embeds: [embed], ephemeral: true});
        }
	},
};