const { SlashCommandBuilder } = require('@discordjs/builders');
const { isOwner, updateConfig } = require('../utils/utils');
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
        interaction.deferReply({ ephemeral: true }); // Sometimes it takes a sec to reply

        if (!(await isOwner(interaction.member))) {
            return interaction.followUp({content:'You don\'t have permission to do this.', ephemeral: true});
        }

        const { options } = interaction
        if (config.trains.includes(options.getString(opt))) {
            return interaction.followUp({content: `${options.getString(opt)} is already being tracked!`, ephemeral: true});
        } else {
            config.trains.push(options.getString(opt));
            config.stations.push(null);
            updateConfig(config);
            return interaction.followUp({
                content: `Added ${options.getString(opt)} to the tracker. Its status will appear the next time the information board refreshes.${''
                }\nThis bot is now tracking the following trains: ${config.trains.sort().join(', ')}`,
                ephemeral: true
            });
        }
	},
};