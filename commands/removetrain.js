const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
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
        interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }

        const { options } = interaction
        if (config.trains.includes(options.getString(opt))) {
            config.trains.splice(config.trains.indexOf(options.getString(opt)), 1);
            updateConfig(config);
            return interaction.followUp({  // Format strings are amazing.
                content: `${options.getString(opt)} has been removed from the tracking list.\n${''                    
                }This bot is now tracking the following trains: ${config.trains.join(', ')}`,
                ephemeral: true
            });
        } else {
            return interaction.followUp({content: `${options.getString(opt)} is not in the tracking list.`, ephemeral: true});
        }
	},
};