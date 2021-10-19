const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

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
            const embed = new MessageEmbed()
                .setTitle(`${options.getString(opt)} has been removed from the tracking list.`)
                .setFooter('This update will be visible the next time the information board refreshes.')
                .setColor('RED')
                .addField(
                    'Currently tracked trains',
                    config.trains.join(', '),
                    false
                );
            return interaction.followUp({  // Format strings are amazing.
                embeds: [embed],
                ephemeral: true
            });
        } else {
            return interaction.followUp({content: `Train no. ${options.getString(opt)} is not in the tracking list.`, ephemeral: true});
        }
	},
};