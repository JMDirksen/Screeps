module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
		
		const receiver = spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_LINK
		});

		const links = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_LINK && s.store[RESOURCE_ENERGY]
		});
		for (const i in links) {
		    const link = links[i];
		    if (link.id == receiver.id) continue;
            link.transferEnergy(receiver);
		}
	}
}
