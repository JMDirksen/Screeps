module.exports = function () {
	for (const spawnName in Game.spawns) {
		const spawn = Game.spawns[spawnName]
		const links = _.sortBy(spawn.room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_LINK
		}), 'store')
		if (!links.length) continue
		const totalEnergy = _.sum(links, 'store')
		const lowest = links[0]
		const highest = links[links.length - 1]

		const amount = highest.store - totalEnergy / links.length
		if (amount < 50) continue
		highest.transferEnergy(lowest, amount)
	}
}
