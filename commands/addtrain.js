const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

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
        interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }

        const { options } = interaction
        if (config.trains.includes(options.getString(opt))) {
            return interaction.followUp({content: `Train no. ${options.getString(opt)} is already being tracked!`, ephemeral: true});
        } else {
            config.trains.push(options.getString(opt));
            config.trains.sort(); //so it's in numerical order
            const embed = new MessageEmbed()
                .setTitle(`Added ${options.getString(opt)} to the tracker.`)
                .setFooter('Your new train\'s status will appear the next time the information board refreshes.')
                .setColor('GREEN')
                .addField(
                    'Currently tracked trains',
                    config.trains.join(', '),
                    false
                );
            return interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        }
	},
};