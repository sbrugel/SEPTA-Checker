# SEPTA-Checker
This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.txt). This basically means you can redistribute this product with modification, for patent or private use, as long as you accredit all contributors and keep the license on your derivation of the project. You may NOT distribute the code as closed-source. Please follow the aforementioned link for more information.

## About
![Discord_ifgEFGqQBX](https://user-images.githubusercontent.com/58154576/136670970-471818c9-f134-44a7-a2c1-159716abf084.png)

This is a Discord bot that scrapes [SEPTA's TrainView](http://trainview.septa.org/) at regular intervals and returns delays for user-inputted train services (3 or 4 digit numbers) in the form of a rich embed. Its feed updates automatically every two minutes.

This bot is intended to be used in one server per host, posting messages to a locked channel, so as it is the only user that can post in the channel. *Using this bot in a public channel or one that is unlocked to various people may be problematic.*

## Setup
Once you have downloaded the source, follow these instructions. (Most of these are things you'd do when setting up any Discord bot; it is assumed you have Discord developer mode turned on in settings)

1. A file named 'config-template.json' is included in this download. Rename this to 'config.json'.
2. Go to your [Discord developer portal](https://discord.com/developers/applications) and create a new application.
3. Enter the Bot tab and set up the bot. At this point, a token field will be present. Press the Copy button below it, and paste it into the config file, replacing "YOUR_BOT_TOKEN". (Keep the double quotes for this, and for all copy-pastes into the config file)
4. Replace "YOUR_BOT_ID" with the Application ID, found in the General Information section with a Copy button below it.
5. Replace "YOUR_SERVER_ID" with the ID of the server you will add the bot to.
6. Replace "YOUR_CHANNEL_ID" with the ID of the channel you would like the bot to send messages to. (Refer to the About section for important info on this)
- 6.5. (OPTIONAL) Replace "["YOUR TRAINS HERE", "EACH SERVICE NUMBER", "SEPARATED BY COMMAS"]" with an array of train numbers you would like tracked right when the bot launches. Keep the double quotes AND the square brackets. Remember that this is not required as you can modify this list through bot commands. **Note that this updates with every train added so the list does not clear if the bot goes down.
7. To add the bot to the server, go to the OAuth2 section of the developer's page. Scroll to the bottom. Under Scopes, you must tick 'bot' and 'applications.commands'. Under Bot Permissions, tick 'Administrator'. Also ensure you enable BOTH privileged intents under the Bots section.
8. This gives you a link to add the bot to any server you manage. Follow Discord's on screen instructions after copying this link into your browser.
9. Run 'startbot.bat' and the bot should go online.

## Utilized Libraries
- [discord.js](https://discord.js.org/#/)
- [cron](https://www.npmjs.com/package/cron)
- [fs](https://nodejs.org/api/fs.html)
- [cheerio](https://cheerio.js.org/)
- request-promise (currently deprecated, a future update will replace this with a more up-to-date library)

## Acknowledgements
Massive thanks to the team behind [SageV2](https://github.com/ud-cis-discord/SageV2), notably Ren Ross and Ben Segal, for their continued assistance and encouragement for development.

Got any bugs to report? Feature suggestions? Toss them in the issues section.
