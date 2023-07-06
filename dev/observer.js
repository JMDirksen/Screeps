module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if(!spawn.memory.observeRoom) continue;

		const observers = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_OBSERVER
		});
		for (const i in observers) {
            const observer = observers[i];
            let r = observer.observeRoom(spawn.memory.observeRoom);
            if(r) console.log(r);
		}
	}
}
