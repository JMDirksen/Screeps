var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Room switch
	if(creep.memory.target && creep.memory.target != creep.room.name) {
		return creep.goTo(Game.rooms[creep.memory.target].controller);
	}
	
	// Check if empty
	if(creep.memory.transport && creep.isEmpty()) {
		creep.memory.transport = false;
	}
	// Check if full
	if(!creep.memory.transport && creep.isFull()) {
		creep.memory.transport = true;
	}
	
	// Transport
	if(creep.memory.transport) {
		
		// Supply spawn/extensions
		let spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
			filter: s => (
				s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION
			) && s.energy < s.energyCapacity
		});
		if(spawn) {
			let r = creep.transfer(spawn, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(spawn);
			else if (r) f.error('creep.transfer '+r);
			return;
		}

		// Supply tower
		let tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
			filter: s => (
				s.structureType == STRUCTURE_TOWER
			) && s.energy < s.energyCapacity
		});
		if(tower) {
			let r = creep.transfer(tower, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(tower);
			else if (r) f.error('creep.transfer '+r);
			return;
		}
		
		// goIdle
		creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}