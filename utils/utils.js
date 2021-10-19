const { writeFileSync } = require('fs');
const { join } = require('path');
const config = require('../config.json');

module.exports = {
	async isOwner(user) {
		const app = user.client.application;
		await app.fetch();
		// console.log(client);
		if (app.owner?.ownerId) {
			return app.owner.members.has(user.id);
		}
		return app.owner.id === user.id;
	},

	updateConfig(config) {
		writeFileSync(join(__dirname, '..', 'config.json'), JSON.stringify(config, null, '\t'));
		delete require.cache[require.resolve('../config.json')];
	},

	getPrintForEmbed() {
		var toprint = [];
		for (var i = 0; i < config.trains.length; i++) {
			if (config.stations[i] != null) { //a valid station is also being tracked for this train
				toprint.push(config.trains[i] + ' (ETA is being tracked at ' + config.stations[i] + ')');
			} else {
				toprint.push(config.trains[i])
			}
		}
		return toprint;
	}
}