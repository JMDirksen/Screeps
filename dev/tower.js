module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName]
		const spawn = room.find(FIND_MY_SPAWNS)[0]
		const attackRange = spawn.memory.towerAttackRange
		const healRange = spawn.memory.towerHealRange

		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		})

		// Iterate towers
		for (let t = 0; t < towers.length; t++) {
			const tower = towers[t]
			const pos = tower.pos

			// Attack weakest hostile in range
			const hostile = _.sortBy(pos.findInRange(FIND_HOSTILE_CREEPS, attackRange, {
				filter: c => c.countParts([ATTACK, RANGED_ATTACK, HEAL])
			}), 'hits')[0]
			if (hostile) {
				tower.attack(hostile)
				continue
			}

			// Heal my creeps in range
			let healCreep = pos.findInRange(FIND_MY_CREEPS, healRange, {
				filter: c => c.hits < c.hitsMax
			})[0]
			if (healCreep) {
				tower.heal(healCreep)
				continue
			}

			// Heal guards ignoring range
			let healGuard = pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: c => c.memory.type == 'guard' && c.hits < c.hitsMax
			})
			if (healGuard) {
				tower.heal(healGuard)
				continue
			}

		}
	}
}
