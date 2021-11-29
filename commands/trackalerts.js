const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig, getPrintForEmbed } = require('../utils/utils');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

let name = 'trackalerts', desc = 'Track alerts for a specified line.', opt = 'toadd', optdesc = 'The line to track'

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
        let lineToCheck = "X";
        if ("airport".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Airport";
        }
        else if ("chestnut hill east".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Chestnut Hill East"
        }
        else if ("chestnut hill west".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Chestnut Hill West"
        }
        else if ("cynwyd".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Cynwyd"
        }
        else if ("fox chase".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Fox Chase"
        }
        else if ("lansdale doylestown".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Lansdale\/Doylestown"
        }
        else if ("media elwyn".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Media\/Elwyn"
        }
        else if ("manayunk norristown".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Manayunk\/Norristown"
        }
        else if ("paoli thorndale".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Paoli\/Thorndale"
        }
        else if ("trenton".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Trenton"
        }
        else if ("warminster".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Warminster"
        }
        else if ("west trenton".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "West Trenton"
        }
        else if ("wilmington newark".includes(options.getString(opt).toLowerCase())) {
            lineToCheck = "Wilmington\/Newark"
        }

        if (config.alerts.includes(lineToCheck)) {
            return interaction.followUp({content: `Alerts on ${lineToCheck} is already being tracked!`, ephemeral: true});
        } else {
            if (lineToCheck === "X") {
                return interaction.followUp({content: `${options.getString(opt)} is not a valid line.`, ephemeral: true});
            }
            config.alerts.push(lineToCheck);
            updateConfig(config);

            const embed = new MessageEmbed()
                .setTitle(`Added ${lineToCheck} to the tracker.`)
                .setFooter('This line\'s will appear the next time the information board refreshes.')
                .setColor('GREEN')
            return interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        }
	},
};