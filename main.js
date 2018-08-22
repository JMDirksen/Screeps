// Load prototypes
require('creep.prototype');

// Load modules
const c = require('config');
const f = require('functions');
const buildCreeps = require('buildCreeps');
const tower = require('tower');
const link = require('link');
const CpuMeter = require('CpuMeter');

// Load roles
var role = [];
for(let roleName in c.creep.role) {
	role[roleName] = require('role.'+roleName);
}

module.exports.loop = function () {
	// CPU Main
	const meterMain = new CpuMeter('main');
	if(f.cpu) meterMain.start();
	
	// CPU Bucket checked
	if(Game.cpu.bucket < 100) {
		f.warning('Skipping tick due to low CPU bucket');
		return;
	}
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(10)) buildCreeps();
	
	// Run creep roles
	for (let creepName in Game.creeps) {
		let creep = Game.creeps[creepName];
		if (creep.spawning) continue;
		// Switch room or do role
		if(!creep.switchRoom()) {
			role[creep.memory.role](creep);
		}
	}
	
	// Tower
	tower();

	// Link
	link();

	// CPU Main
	if(f.cpu) {
		let bucket = Math.round(Game.cpu.bucket/100);
		meterMain.stop();
		f.cpu('main: '+meterMain.getAverage(1)+', bucket: '+bucket+'%');
	}
	
}

function thisTick(everyThisTicks) {
	return !(Game.time % everyThisTicks);
}

function clearMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		f.debug('Creep died ' + name);
		delete Memory.creeps[name];
	}
}
