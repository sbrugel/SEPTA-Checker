const Discord = require('discord.js');
const cron = require("cron");
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'http://trainview.septa.org/';

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.once('ready', () => {
	main()
    let job = new cron.CronJob('20,50 * * * *', main);

job.start();
});

var trains = ['5205', '5219', '5221', '9241']
client.login('nice try buddy');

async function main() {
    const result = await rp.get(url);
    const $ = cheerio.load(result);
	console.log('hi');
	
	var iteration = 0;
	var run = 0;
	var printflag = false;
	var printstring = '';
	$("table > tbody > tr > td").each((index, element) => {
		iteration = run % 4;
		if (iteration == 0) { //unused
			printflag = false;
		} else if (iteration == 1) { //train number
			if (trains.indexOf($(element).text()) != -1) {
				printflag = true;
				printstring = 'Train no. ' + trains[trains.indexOf($(element).text())] + ' going to ';
			}
		}
		if (printflag) {
			if (iteration == 2) { //dest
				printstring += $(element).text() + ' is currently running ';
			}
			if (iteration == 3) { //delay
				if ($(element).text() != 'On Time') {
					printstring += $(element).text() + ' late';
				} else {
					printstring += $(element).text();
				}
				console.log(printstring);
			}
		}
		run++;
    });
	console.log('bye');
}