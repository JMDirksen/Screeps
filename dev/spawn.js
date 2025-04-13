module.exports = function () {

    // Iterate spawns
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];

        // Setup spawn memory
        if (spawn.memory.guards == undefined) spawn.memory.guards = null;
        if (spawn.memory.harvesters == undefined) spawn.memory.harvesters = null;
        if (spawn.memory.upgraders == undefined) spawn.memory.upgraders = null;
        if (spawn.memory.builders == undefined) spawn.memory.builders = null;
        if (spawn.memory.transporters == undefined) spawn.memory.transporters = null;
        if (spawn.memory.repairers == undefined) spawn.memory.repairers = null;
        if (spawn.memory.attackers == undefined) spawn.memory.attackers = null;
        if (spawn.memory.claimers == undefined) spawn.memory.claimers = null;
        if (spawn.memory.attackID == undefined) spawn.memory.attackID = null;
        if (spawn.memory.squadSize == undefined) spawn.memory.squadSize = 3;
        if (spawn.memory.observeRoom == undefined) spawn.memory.observeRoom = null;
        if (spawn.memory.claimRoom == undefined) spawn.memory.claimRoom = null;

        // Skip spawning
        if (spawn.spawning) continue;

        // Harvester
        const harvestersNeeded = spawn.memory.harvesters || 4;
        if (spawn.room.countCreeps('harvester') < harvestersNeeded) {
            const type = 'harvester';
            let body = null;
            if (spawn.energyPossible(850)) body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(700)) body = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(550)) body = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(400)) body = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(250)) body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Transporter
        const transportersNeeded = spawn.memory.transporters || 2;
        if (spawn.room.countCreeps('transporter') < transportersNeeded) {
            const type = 'transporter';
            let body = null;
            if (spawn.energyPossible(800)) body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(700)) body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(600)) body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(500)) body = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(400)) body = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(300)) body = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(200)) body = [CARRY, CARRY, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Upgrader
        let upgradersNeeded = spawn.memory.upgraders || Math.min(spawn.room.controller.level + 1, harvestersNeeded - 1);
        if (spawn.room.controller.level == 8) upgradersNeeded = 1;
        else if (upgradersNeeded > 1) {
            const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
            if (sites) upgradersNeeded = 1;
        }
        if (spawn.room.countCreeps('upgrader') < upgradersNeeded) {
            const type = 'upgrader';
            let body = null;
            if (spawn.energyPossible(850)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(750)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(600)) body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(500)) body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(350)) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(250)) body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Guard
        let guardsNeeded = spawn.memory.guards || 1;
        if (spawn.room.find(FIND_HOSTILE_CREEPS).length) guardsNeeded += 3;
        if (spawn.room.countCreeps('guard') < guardsNeeded) {
            const type = 'guard';
            let body = null;
            if (spawn.energyPossible(780)) body = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(650)) body = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(520)) body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(390)) body = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(260)) body = [ATTACK, ATTACK, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Builder
        const buildersNeeded = spawn.memory.builders || 2;
        const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
        if (sites && spawn.room.countCreeps('builder') < buildersNeeded) {
            const type = 'builder';
            let body = null;
            if (spawn.energyPossible(850)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(750)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(600)) body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(500)) body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(350)) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(250)) body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Repairer
        const repairersNeeded = spawn.memory.repairers || 2;
        const repairs = spawn.room.find(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART)
                && s.hits < s.hitsMax
        }).length;
        if (repairs && spawn.room.countCreeps('repairer') < repairersNeeded) {
            const type = 'repairer';
            let body = null;
            if (spawn.energyPossible(850)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(750)) body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(600)) body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(500)) body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(350)) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(250)) body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.buildCreep(type, body)) continue;
        }

        // Attacker
        const attackersNeeded = spawn.memory.attackers || 5;
        if (spawn.memory.attackID && spawn.room.countCreeps('attackers') < attackersNeeded) {
            const type = 'attacker';
            let body = null;
            if (spawn.energyPossible(780)) body = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(650)) body = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(520)) body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(390)) body = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            else if (spawn.energyPossible(260)) body = [ATTACK, ATTACK, MOVE, MOVE];
            if (spawn.buildCreep(type, body, { attackID: spawn.memory.attackID, pause: true })) continue;
        }

        // Claimer
        const claimersNeeded = spawn.memory.claimers || 1;
        if (spawn.memory.claimRoom && spawn.room.countCreeps('claimer') < claimersNeeded) {
            // Check/stop if room is fully claimed (has spawn)
            if (Game.rooms[spawn.memory.claimRoom]) {
                const claimRoomSpawn = Game.rooms[spawn.memory.claimRoom].find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_SPAWN }
                })[0];
                if (claimRoomSpawn) {
                    spawn.memory.claimRoom = null;
                    continue;
                }
            }
            const type = 'claimer';
            let body = null;
            if (spawn.energyPossible(900)) body = [CLAIM, WORK, CARRY, MOVE, MOVE, MOVE];
            if (spawn.buildCreep(type, body, { room: spawn.memory.claimRoom })) continue;
        }

    }

};
