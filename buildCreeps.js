var c = require('config');
var f = require('functions');

module.exports = function() {
	for (let spawnName in Game.spawns) {
		let spawn = Game.spawns[spawnName];
		if (spawn.spawning) return;
		let energyCapacity = spawn.room.energyCapacityAvailable;
		if(!_.filter(Memory.creeps,{role:'harvester'}).length) energyCapacity = 300;
		if(!_.filter(Memory.creeps,{role:'transporter'}).length) energyCapacity = 300;
		let energyAvailable = spawn.room.energyAvailable;
		if(energyAvailable < energyCapacity) return;
		
		for(let roleName in c.creep.role) {
			let role = c.creep.role[roleName];
			// Check if build enough already
			let currentCount = spawn.room.find(FIND_MY_CREEPS,{
				filter: c => c.memory.role == roleName
			}).length;
			let toBuildCount = role.count;
			if(currentCount >= toBuildCount) continue;
			// Claimer only when claim is set
			if(roleName == 'claimer' && !spawn.memory.claim) continue;
			// Get body
			let body = getBody(role.creepType, energyCapacity);
			if(!body) continue;
			let name = generateName(roleName);
			let memory = {memory:{role:roleName}};
			// Claimer memory.target
			if(roleName == 'claimer') memory = {memory:{role:roleName, target:spawn.memory.claim}};
			// Build creep
			let r = spawn.spawnCreep(body, name, memory);
			if(r) f.error('spawn.spawnCreep '+r);
			else {
				// Claimer reset spawn memory
				if(roleName == 'claimer') spawn.memory.claim = null;
				f.debug('Creep spawning '+name);
				return;
			}
		}
	}
}

function generateName(role) {
	let r = role.charAt(0).toUpperCase();
	for(let i = 1; i<=100; i++) {
		let name = r+i;
		if(!Game.creeps[name]) {
			return name;
		}
	}
	f.error('Name generation failed ('+type+')');
}

function getBody(type, energy) {
	let bodies = c.creep.type[type];
	for(let i = bodies.length-1; i >= 0; i-- ) {
		let body = c.creep.type[type][i];
		if(body.cost <= energy) return body.body;
	}
}