const config = require('./config.json');
const Discord = require('discord.js');
const { MessageEmbed, Client, Collection, Intents } = require('discord.js');
const cron = require("cron");
const rp = require('request-promise');
const cheerio = require('cheerio');
const { channelMention } = require('@discordjs/builders');
const fs = require('fs');
const url = 'http://trainview.septa.org/';

const client = new Discord.Client({ 
	partials: ['MESSAGE', 'CHANNEL'],
	intents: [Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES, 
		Intents.FLAGS.GUILD_PRESENCES, 
		Intents.FLAGS.GUILD_MEMBERS]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.login(config.TOKEN);

client.once('ready', () => {
	console.log('ready!');
	main(); //this just instantly updates the embed on launch
    let job = new cron.CronJob('*/2 * * * *', main); //update at every even minute of the hour - approximately every 2 minutes
	job.start();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (interaction.commandName === 'refresh') {
		main();
		return interaction.reply({ content: 'Refreshed!', ephemeral: true });;
	}

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Sorry, an error occured while running this command: ' + error, ephemeral: true });
	}
});

async function main() {
    const result = await rp.get(url);
    const $ = cheerio.load(result);
	
	var iteration = 0, printstring = '', toPrint = [];
	var run = 0; //increment through every cell of the table

	$("table > tbody > tr > td").each((index, element) => { //run through every cell of the table
		iteration = run % 4; //0, 1, 2, or 3
		//iteration 0 is the origin station, which is unused for the purposes of this script
		if (iteration == 1) { //train number
			if (config.trains.indexOf($(element).text()) != -1) {
				printstring = 'Train no. ' + config.trains[config.trains.indexOf($(element).text())] + ' going to ';
			} else {
				printstring = '';
			}
		}
		if (printstring != '') { //continue adding to the string
			if (iteration == 2) { //dest
				printstring += $(element).text() + ' is currently running ';
			}
			else if (iteration == 3) { //delay
				printstring += $(element).text();
				if ($(element).text() != 'On Time') {
					printstring += ' late';
				}
				toPrint.push(printstring);
			}
		}
		run++;
    });

	var today = new Date();
	var hr = convertTime(today.getHours()), min = convertTime(today.getMinutes()), sec = convertTime(today.getSeconds());
	var time = hr + ":" + min + ":" + sec;
	
	for (let i = 0; i < toPrint.length; i++) { //add a new line for every train info
		toPrint[i] += '\n';
	}

	if (toPrint.length == 0) { //no updates
		toPrint = ["No train updates at this time for the services you have specified."];
	}
	if (config.trains.length == 0) { //no updates
		toPrint = ["Hello! This is a feed that tracks the delays of SEPTA services you specify. Please use /addtrain [train number] to start tracking trains. For information on other commands, type in / and then click my profile picture on the left bar."];
	}

	let guild = client.guilds.cache.get(config.GUILD_ID);
	let channel = guild.channels.cache.get(config.SENDTO);

	//this took me way too long to figure out, thanks discord.js update
	channel.messages.fetch({limit: 1}).then(messages => {
		let lm = messages.first()
		if (lm == null || !lm.author.bot) { //no message at all or last message not by bot
			const trainEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('SEPTA Information Board')
				.setDescription(String(toPrint.join('\n')))
				.setFooter('This feed was last updated at: ' + time);
			channel.send({ embeds: [trainEmbed] });
		} else {
			const trainEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('SEPTA Information Board')
					.setDescription(String(toPrint.join('\n')))
					.setFooter('This feed was last updated at: ' + time);
			lm.edit({ embeds: [trainEmbed] });
		}
	})
}

function convertTime(time) {
	if (time < 10) {
		return "0" + time;
	}
	return time;
}