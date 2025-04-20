module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];
		const spawn = room.find(FIND_MY_SPAWNS)[0];

		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		for (let t = 0; t < towers.length; t++) {
			const tower = towers[t];

			// Attack healer
			let healer = tower.pos.findInRange(FIND_HOSTILE_CREEPS, spawn.memory.towerAttackRange, {
				filter: c => c.getActiveBodyparts(HEAL)
			})[0]
			if (healer != undefined) {
				tower.attack(healer)
				continue
			}

			// Attack hostile
			let hostile = tower.pos.findInRange(FIND_HOSTILE_CREEPS, spawn.memory.towerAttackRange, {
				filter: c => c.getActiveBodyparts(ATTACK) || c.getActiveBodyparts(RANGED_ATTACK)
			})[0]
			if (hostile) {
				tower.attack(hostile)
				continue
			}

			// Heal my creeps
			let healCreep = tower.pos.findInRange(FIND_MY_CREEPS, spawn.memory.towerHealRange, {
				filter: c => c.hits < c.hitsMax
			})[0]
			if (healCreep) {
				tower.heal(healCreep)
				continue
			}

			// Heal guards
			let healGuard = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: c => c.memory.type == 'guard' && c.hits < c.hitsMax
			})
			if (healGuard) {
				tower.heal(healGuard)
				continue
			}

		}
	}
}
