## About
![Discord_U2Zsawo5Lm](https://user-images.githubusercontent.com/58154576/138178535-8f4f1ac3-ea68-4982-a1d2-9173d5599bcd.png)

This is a Discord bot that scrapes the SEPTA API at regular intervals and returns delays, last recorded location, and train consist information for user-inputted train services (3 or 4 digit numbers) in the form of a rich embed. Its feed updates automatically every two minutes.

The bot can optionally also track the estimated arrival time of tracked trains at a certain station, specified by the user, using the /addstation command.

This bot is intended to be used in one server per host, posting messages to a locked channel, so as it is the only user that can post in the channel. *Using this bot in a public channel or one that is unlocked to various people may be problematic.*

## Setup
Once you have downloaded the source, follow these instructions. (Most of these are things you'd do when setting up any Discord bot; it is assumed you have Discord developer mode turned on in settings)

*Please note you will require an installation of node.js to run the bot*

1. A file named 'config-template.json' is included in this download. Rename this to 'config.json'.
2. Go to your [Discord developer portal](https://discord.com/developers/applications) and create a new application.
3. Enter the Bot tab and set up the bot. At this point, a token field will be present. Press the Copy button below it, and paste it into the config file, replacing "YOUR_BOT_TOKEN". (Keep the double quotes for this, and for all copy-pastes into the config file)
4. Replace "YOUR_BOT_ID" with the Application ID, found in the General Information section with a Copy button below it.
5. Replace "YOUR_SERVER_ID" with the ID of the server you will add the bot to.
6. Replace "YOUR_CHANNEL_ID" with the ID of the channel you would like the bot to send messages to. (Refer to the About section for important info on this)
- 6.5. (OPTIONAL) Replace "["YOUR TRAINS HERE", "EACH SERVICE NUMBER", "SEPARATED BY COMMAS"]" with an array of train numbers you would like tracked right when the bot launches. Keep the double quotes AND the square brackets. Remember that this is not required as you can modify this list through bot commands. **Note that this updates with every train added so the list does not clear if the bot goes down.**
7. To add the bot to the server, go to the OAuth2 section of the developer's page. Scroll to the bottom. Under Scopes, you must tick 'bot' and 'applications.commands'. Under Bot Permissions, tick 'Administrator'. Also ensure you enable BOTH privileged intents under the Bots section.
8. This gives you a link to add the bot to any server you manage. Follow Discord's on screen instructions after copying this link into your browser.
9. Run 'startbot.bat' and the bot should go online. As it stands, if a crash occurs, the bot will return to an online state with all train information and settings preserved.

## Commands List
### /addtrain [train]
This will add a train to the tracker. By default, no station will be associated with this train, meaning that no ETA will be tracked for it. (See /addstation below for more info)

Parameters: [train] is the train number of the service to be tracked.

### /removetrain [train]
This will remove a specified train service from the tracker. If applicable, its associated station will also be removed.

Parameters: [train] is the train number of the service to be removed. This MUST be a train that is currently being tracked.

### /cleartrains
This will remove every train that is currently in the tracker, as well as all associated stations.

### /refresh
Forces a refresh of the SEPTA Information Board. *This will take a few seconds to update.*

### /toggleconsists
Switches between full consist information (i.e. specific car numbers) and basic consist information (# of coaches, train type) being displayed.

### /viewtrains
Displays the full list of trains being tracked, along with their associated stations.

### /addstation [train] [station]
This command adds a station to a train being tracked that will have its ETA shown. For example /addstation 1234 Wilmington will check the estimated arrival time of Train #1234 at Wilmington if it is currently running. In this case, the ETA for #1234 at Wilmington will be shown BEFORE it arrives at Wilmington; after it departs, no ETA will be shown even if the train is still running.

Parameters
- [train] is the train number to add the station to. This MUST be a train already being tracked.
- [station] is the station to track the ETA of this train for. This MUST be a station the [train] serves. *Please note that this also accounts for punctuation in the name. (See the below section for more info)*

## Stations for Trains
One core feature of this bot is that for any train being tracked, the estimated arrival time at a user-specified station can also be tracked. This command is described in detail above. However, one thing to be noted is that shortened station names (for some stations) CAN be used and do work.

As an example, entering "30th St" as the station parameter for a train will track the train's ETA at 30th Street Station. Additionally, typing in just "Temple" for the station will track the train's ETA at Temple University. However, it is always best to type in as full of the station name as possible to avoid ambiguity.

HOWEVER, proper punctuation for the station is required for the station to be detected and tracked. For example, "St Davids" will not be found as a valid station if the train serves St. Davids.

## Utilized Libraries
- [discord.js](https://discord.js.org/#/)
- [cron](https://www.npmjs.com/package/cron)
- [fs](https://nodejs.org/api/fs.html)
- [cheerio](https://cheerio.js.org/)
- request-promise (currently deprecated, a future update will replace this with a more up-to-date library)

## Acknowledgements
Massive thanks to the team behind [SageV2](https://github.com/ud-cis-discord/SageV2) for their continued assistance and encouragement for development.

Got any bugs to report? Feature suggestions? Toss them in the issues section.
