'use strict'

module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName]
		const spawn = room.find(FIND_MY_SPAWNS)[0]
		if (!spawn) continue
		const attackRange = spawn.memory.towerAttackRange
		const healRange = spawn.memory.towerHealRange
		const guardBounds = spawn.memory.guardBounds
		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		})

		// Iterate towers
		for (let t = 0; t < towers.length; t++) {
			const tower = towers[t]

			// Weakest hostile in range/bounds
			const hostile = _.sortBy(tower.pos.findInRange(FIND_HOSTILE_CREEPS, attackRange, {
				filter: c => c.countParts([WORK, ATTACK, RANGED_ATTACK, HEAL])
					&& c.pos.isInBounds(guardBounds)
			}), 'hits')[0]

			// My damaged creeps in range
			const healCreep = tower.pos.findInRange(FIND_MY_CREEPS, healRange, {
				filter: c => c.hits < c.hitsMax
			})[0]

			// Damaged guards ignoring range
			const healGuard = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: c => c.memory.type.isInList('guard', 'guardHealer') && c.hits < c.hitsMax
			})

			// Switch back and forth between attack/heal
			if (hostile && (healCreep || healGuard)) {
				if (!(Game.time % 2)) tower.attack(hostile)
				else if (healGuard) tower.heal(healGuard)
				else if (healCreep) tower.heal(healCreep)
				continue
			}

			// Attack / Heal
			if (hostile) tower.attack(hostile)
			else if (healGuard) tower.heal(healGuard)
			else if (healCreep) tower.heal(healCreep)

		}
	}
}
