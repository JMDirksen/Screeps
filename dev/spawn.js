module.exports = function () {

    // Iterate spawns
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];

        // Setup spawn memory
        if (spawn.memory.guards == undefined) spawn.memory.guards = null;
        if (spawn.memory.upgraders == undefined) spawn.memory.upgraders = null;
        if (spawn.memory.builders == undefined) spawn.memory.builders = null;
        if (spawn.memory.transporters == undefined) spawn.memory.transporters = null;
        if (spawn.memory.repairers == undefined) spawn.memory.repairers = null;
        if (spawn.memory.wallRepairers == undefined) spawn.memory.wallRepairers = null;
        if (spawn.memory.attackers == undefined) spawn.memory.attackers = null;
        if (spawn.memory.claimers == undefined) spawn.memory.claimers = null;
        if (spawn.memory.attackID == undefined) spawn.memory.attackID = null;
        if (spawn.memory.squadSize == undefined) spawn.memory.squadSize = 3;
        if (spawn.memory.observeRoom == undefined) spawn.memory.observeRoom = null;
        if (spawn.memory.claimRoom == undefined) spawn.memory.claimRoom = null;
        if (spawn.memory.towerAttackRange == undefined) spawn.memory.towerAttackRange = 20;
        if (spawn.memory.towerHealRange == undefined) spawn.memory.towerHealRange = 5;
        if (spawn.memory.roomEnergyProduction == undefined) spawn.memory.roomEnergyProduction = spawn.room.energyProduction()
        if (spawn.memory.remoteHarvestRoom == undefined) spawn.memory.remoteHarvestRoom = null;

        // Skip spawning
        if (spawn.spawning) continue;

        // Max energy per RCL: 1:300 2:550 3:800 4:1300 5:1800 6:2300 7:5300 8:12300

        // Harvester
        let roomHarvesters = spawn.room.find(FIND_MY_CREEPS, { filter: c => c.memory.type == 'harvester' })
        let energyHarvesting = 0
        roomHarvesters.forEach(c => { energyHarvesting += c.countParts('work') * 2 })
        if (energyHarvesting < spawn.memory.roomEnergyProduction) {
            const type = 'harvester';
            let body = null;
            if (spawn.energyPossible(1300)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(700)) body = { tier: 3, parts: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(550)) body = { tier: 2, parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Transporter
        const transportersNeeded = spawn.memory.transporters || 2;
        if (spawn.room.countCreeps('transporter') < transportersNeeded) {
            const type = 'transporter';
            let body = null;
            if (spawn.energyPossible(1300)) body = { tier: 4, parts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(800)) body = { tier: 3, parts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(500)) body = { tier: 2, parts: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(300)) body = { tier: 1, parts: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Upgrader
        let upgradersNeeded = spawn.memory.upgraders || 1
        if (spawn.room.controller.level == 8) upgradersNeeded = 1;
        else if (upgradersNeeded > 1) {
            const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
            if (sites) upgradersNeeded = 1;
        }
        if (spawn.room.countCreeps('upgrader') < upgradersNeeded) {
            const type = 'upgrader';
            let body = null;
            if (spawn.energyPossible(1250)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(750)) body = { tier: 3, parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(500)) body = { tier: 2, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Guard
        let guardsNeeded = spawn.memory.guards || 1;
        if (spawn.room.find(FIND_HOSTILE_CREEPS).length) guardsNeeded += 3;
        if (spawn.room.countCreeps('guard') < guardsNeeded) {
            const type = 'guard';
            let body = null;
            if (spawn.energyPossible(1300)) body = { tier: 4, parts: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(780)) body = { tier: 3, parts: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(520)) body = { tier: 2, parts: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(260)) body = { tier: 1, parts: [ATTACK, ATTACK, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Builder
        const buildersNeeded = spawn.memory.builders || 2;
        const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
        if (sites && spawn.room.countCreeps('builder') < buildersNeeded) {
            const type = 'builder';
            let body = null;
            if (spawn.energyPossible(1250)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(750)) body = { tier: 3, parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(500)) body = { tier: 2, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Repairer
        const repairersNeeded = spawn.memory.repairers || 1;
        const repairs = spawn.room.find(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TOWER)
                && s.hits < s.hitsMax
        }).length;
        if (repairs && spawn.room.countCreeps('repairer') < repairersNeeded) {
            const type = 'repairer';
            let body = null;
            if (spawn.energyPossible(1250)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(750)) body = { tier: 3, parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(500)) body = { tier: 2, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Wall repairer
        const wallRepairersNeeded = spawn.memory.wallRepairers || 1;
        const wallRepairs = spawn.room.find(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
                && s.hits < s.hitsMax
        }).length;
        if (wallRepairs && spawn.room.countCreeps('wallRepairer') < wallRepairersNeeded) {
            const type = 'wallRepairer';
            let body = null;
            if (spawn.energyPossible(1250)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(750)) body = { tier: 3, parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(500)) body = { tier: 2, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
            if (spawn.buildCreep(type, body)) continue;
        }

        // Attacker
        const attackersNeeded = spawn.memory.attackers || 5;
        if (spawn.memory.attackID && spawn.room.countCreeps('attackers') < attackersNeeded) {
            const type = 'attacker';
            let body = null;
            if (spawn.energyPossible(1300)) body = { tier: 4, parts: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(780)) body = { tier: 3, parts: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(520)) body = { tier: 2, parts: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE] };
            else if (spawn.energyPossible(260)) body = { tier: 1, parts: [ATTACK, ATTACK, MOVE, MOVE] };
            if (spawn.buildCreep(type, body, { attackID: spawn.memory.attackID, pause: true })) continue;
        }

        // Claimer
        const claimersNeeded = spawn.memory.claimers || 3;
        if (spawn.memory.claimRoom) {
            const type = 'claimer';
            const room = Game.rooms[spawn.memory.claimRoom];
            let body = null;

            // Room visible
            if (room) {

                // Check/stop if room is fully claimed (has owned spawn)
                if (room.find(FIND_MY_SPAWNS).length) {
                    spawn.memory.claimRoom = null;
                    continue;
                }

                // Check max claimers
                if (room.countCreeps('claimer') >= claimersNeeded) {
                    continue;
                }

                // Claimer when room visible but controller not owned
                if (!room.controller.my) {
                    if (spawn.energyPossible(900)) body = { tier: 2, parts: [CLAIM, WORK, CARRY, MOVE, MOVE, MOVE] };
                }

                // Claimer supporter when room has no spawn yet
                else {
                    if (spawn.energyPossible(750)) body = { tier: 1, parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
                }
            }

            // Room not visible
            else {
                // Claimer when room not visible (and thus controller not owned)
                if (spawn.energyPossible(900)) body = { tier: 2, parts: [CLAIM, WORK, CARRY, MOVE, MOVE, MOVE] };
            }

            if (body && spawn.buildCreep(type, body, { room: spawn.memory.claimRoom })) continue;
        }

        // Remote harvester
        if (spawn.memory.remoteHarvestRoom) {
            let remoteHarvesters = _.filter(Game.creeps, c => c.memory.type == 'remoteHarvester')
            let energyHarvesting = 0
            remoteHarvesters.forEach(c => energyHarvesting += c.countParts('work') * 2)
            let roomEnergyProduction = Game.rooms[spawn.memory.remoteHarvestRoom].energyProduction()
            if (energyHarvesting < roomEnergyProduction) {
                const type = 'remoteHarvester';
                let body = null;
                if (spawn.energyPossible(1300)) body = { tier: 4, parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] };
                else if (spawn.energyPossible(700)) body = { tier: 3, parts: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] };
                else if (spawn.energyPossible(550)) body = { tier: 2, parts: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE] };
                else if (spawn.energyPossible(250)) body = { tier: 1, parts: [WORK, CARRY, MOVE, MOVE] };
                if (spawn.buildCreep(type, body, { sourceRoom: spawn.room.name, remoteRoom: spawn.memory.remoteHarvestRoom })) continue;
            }
        }

    }

};
