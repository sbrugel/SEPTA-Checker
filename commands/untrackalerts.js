const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig, getPrintForEmbed } = require('../utils/utils');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

let name = 'untrackalerts', desc = 'Stop tracking alerts for a line', opt = 'toremove', optdesc = 'The line to remove'

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
            config.alerts.splice(config.alerts.indexOf(lineToCheck), 1);
			updateConfig(config);

            const embed = new MessageEmbed()
                .setTitle(`Removed ${lineToCheck} from the tracker.`)
                .setFooter('This line\'s will not appear the next time the information board refreshes.')
                .setColor('RED')
            return interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
        } else {
			return interaction.followUp({content: `Alerts on ${lineToCheck} are not being tracked!`, ephemeral: true});
        }
	},
};