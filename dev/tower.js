module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];
		const spawn = room.find(FIND_MY_SPAWNS)[0];

		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		for (let t = 0; t < towers.length; t++) {
			const tower = towers[t];

			// Attack healers first
			let healer = tower.pos.findInRange(FIND_HOSTILE_CREEPS, spawn.memory.towerAttackRange, {
				filter: c => _.includes(JSON.stringify(c.body), 'heal')
			})[0];
			if (healer != undefined) {
				tower.attack(healer);
				continue;
			}

			// Attack random hostile
			let hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, spawn.memory.towerAttackRange);
			let hostile = hostiles[Math.floor(Math.random() * hostiles.length)];
			if (hostile) {
				tower.attack(hostile);
				continue;
			}

			// Heal my creeps
			let healCreep = tower.pos.findInRange(FIND_MY_CREEPS, spawn.memory.towerHealRange, {
				filter: c => c.hits < c.hitsMax
			})[0];
			if (healCreep) {
				tower.heal(healCreep);
				continue;
			}

		}
	}
}
