'use strict'

module.exports = function () {
	// Iterate spawns
	for (const spawnName in Game.spawns) {
		const spawn = Game.spawns[spawnName]

		// Get links in room
		let links = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_LINK
		})
		if (links.length < 2) continue

		// Get links data
		links = _.sortBy(links, s => s.store.getUsedCapacity(RESOURCE_ENERGY))
		const totalEnergy = _.sum(links, s => s.store.getUsedCapacity(RESOURCE_ENERGY))
		const lowest = links[0]
		const highest = links[links.length - 1]

		// Transfer amount from highest to lowest
		const amount = highest.store.getUsedCapacity(RESOURCE_ENERGY) - totalEnergy / links.length
		if (amount >= 100) highest.transferEnergy(lowest, amount)
	}
}
