const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

var name = 'removetrain', desc = 'Remove a train from the tracker.', opt = 'toremove', optdesc = 'The train to remove'

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
        if (config.trains.includes(options.getString(option))) {
            config.trains.splice(config.trains.indexOf(options.getString(option)), 1)
            return interaction.reply({content: options.getString(option) + ' has been removed from the tracking list.\nThis bot is now tracking the following trains: ' + config.trains.join(', '), ephemeral: true});
        } else {
            return interaction.reply({content: options.getString(option) + ' is not in the tracking list.', ephemeral: true});
        }
	},
};