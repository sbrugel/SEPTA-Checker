const { SlashCommandBuilder } = require('@discordjs/builders');
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
            return interaction.reply({content: 'This bot is tracking the following trains: ' + config.trains.join(', '), ephemeral: true});
        }
	},
};