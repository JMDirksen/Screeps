module.exports = function () {
	for (const roomName in Game.rooms) {
		const room = Game.rooms[roomName];
		
		const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_TOWER
		});
		for (let t = 0; t < towers.length; t++) {
		    const tower = towers[t];

            /*
			// Attack healers
			let healer = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5, {
				filter: function (hostile) {
					return _.includes(JSON.stringify(hostile.body),'heal');
				}
			})[0];
			if (healer != undefined) {
				tower.attack(healer);
				continue;
			}
			*/
			
			// Attack hostiles
			let hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 20);
			let hostile = hostiles[Math.floor(Math.random() * hostiles.length)];
			if (hostile) {
			    tower.attack(hostile);
			    continue;
			}

			// Heal my creeps
			let healCreep = tower.pos.findInRange(FIND_MY_CREEPS, 5, {
				filter: c => c.hits < c.hitsMax
			})[0];
			if (healCreep) {
			    tower.heal(healCreep);
			    continue;
			}
			
		}
	}
}
