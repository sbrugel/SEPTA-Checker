const { writeFileSync } = require('fs');
const { join } = require('path');

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
	}
}