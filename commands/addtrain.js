const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

var name = 'addtrain', desc = 'Add a train to the tracker.', opt = 'toadd', optdesc = 'The train to add'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
        .addStringOption(option =>
            option.setName(opt)
                .setDescription(optdesc)
                .setRequired(true)),
	async execute(interaction) {
        const { options } = interaction
        if (config.trains.includes(options.getString(opt))) {
            return interaction.reply({content: options.getString(opt) + ' is already being tracked!', ephemeral: true});
        } else {
            config.trains.push(options.getString(opt));
            config.trains.sort(); //so it's in numerical order
            return interaction.reply({content: 'Added ' + options.getString(opt) + ' to the tracker. Its status will appear the next time the information board refreshes.' +
                '\nThis bot is now tracking the following trains: ' + config.trains.join(', '), ephemeral: true});
        }
	},
};