'use strict'

module.exports = function () {

    // Iterate spawns
    spawnloop:
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const room = spawn.room
        const controllerLevel = room.controller.level
        const energyBuffer = (controllerLevel + 1) * 1000

        // Setup spawn memory defaults
        // Creep counts
        if (spawn.memory.attackers == undefined) spawn.memory.attackers = 5
        if (spawn.memory.builders == undefined) spawn.memory.builders = 2
        if (spawn.memory.claimers == undefined) spawn.memory.claimers = 3
        if (spawn.memory.guards == undefined) spawn.memory.guards = 2
        if (spawn.memory.guardHealers == undefined) spawn.memory.guardHealers = 1
        if (spawn.memory.repairers == undefined) spawn.memory.repairers = 1
        if (spawn.memory.transporters == undefined) spawn.memory.transporters = 2
        if (spawn.memory.wallRepairers == undefined) spawn.memory.wallRepairers = 2
        // Structure settings
        if (spawn.memory.observeRoom == undefined) spawn.memory.observeRoom = null
        if (spawn.memory.towerAttackRange == undefined) spawn.memory.towerAttackRange = 50
        if (spawn.memory.towerHealRange == undefined) spawn.memory.towerHealRange = 10
        // Room settings
        spawn.memory.guardBounds = room.getFlagBounds(COLOR_GREY)
            || [{ x: 0, y: 0 }, { x: 49, y: 49 }]
        // Instructions
        if (spawn.memory.attackId == undefined) spawn.memory.attackId = null
        if (spawn.memory.attackRoom == undefined) spawn.memory.attackRoom = null
        if (spawn.memory.attackPause == undefined) spawn.memory.attackPause = true
        if (spawn.memory.claimRoom == undefined) spawn.memory.claimRoom = null
        if (spawn.memory.remoteHarvestRooms == undefined) spawn.memory.remoteHarvestRooms = null
        // Statistics
        if (spawn.memory.roomEnergyProduction == undefined)
            spawn.memory.roomEnergyProduction = room.energyProduction()
        if (spawn.memory.roomSourceSpots == undefined)
            spawn.memory.roomSourceSpots = room.sourceSpots()
        if (!(Game.time % 100)) {
            let wallsStrength = room.wallsStrength()
            if (spawn.memory.wallsStrength != wallsStrength) {
                spawn.memory.wallsStrength = wallsStrength
                info(`RCL: ${room.controllerLevel()} Build walls to: ${shortNumber(wallsStrength)}`)
            }
        }

        // Skip when spawning
        if (spawn.spawning) continue

        // Skip 9/10 ticks
        if (Game.time % 10) continue

        // Max energy per RCL: 1:300 2:550 3:800 4:1300 5:1800 6:2300 7:5300 8:12300
        // MOVE:50 WORK:100 CARRY:50 ATTACK:80 RANGED_ATTACK:150 HEAL:250 CLAIM:600 TOUGH:10

        // Harvester
        let roomHarvesters = room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'harvester'
        })
        let energyHarvesting = 0
        roomHarvesters.forEach(c => energyHarvesting += c.getActiveBodyparts(WORK) * 2)
        let roomEnergyProduction = spawn.memory.roomEnergyProduction
        let roomSourceSpots = spawn.memory.roomSourceSpots
        if (energyHarvesting < roomEnergyProduction && roomHarvesters.length < roomSourceSpots) {
            const type = 'harvester'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },      // 250
                { tier: 2, parts: [[3, WORK], CARRY, [4, MOVE]] }, // 550
                { tier: 3, parts: [[4, WORK], CARRY, [5, MOVE]] }  // 700
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body)) continue
        }

        // Transporter
        const transportersNeeded = spawn.memory.transporters
        if (room.countCreeps('transporter') < transportersNeeded) {
            const type = 'transporter'
            const bodies = [
                { tier: 1, parts: [[3, CARRY], [3, MOVE]] }, // 300
                { tier: 2, parts: [[5, CARRY], [5, MOVE]] }, // 500
                { tier: 3, parts: [[8, CARRY], [8, MOVE]] }  // 800
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body)) continue
        }

        // Upgrader
        if (room.countCreeps('upgrader') < 1) {
            const type = 'upgrader'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }  // 750
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            let buildCreep = spawn.buildCreep(type, body)
            if (buildCreep == 1) spawn.memory.lastUpgraderBuilt = Game.time
            if (buildCreep) continue
        }

        // Guard healer
        let guardHealersNeeded = spawn.memory.guardHealers
        if (room.countCreeps('guardHealer') < guardHealersNeeded) {
            const type = 'guardHealer'
            const bodies = [
                { tier: 1, parts: [MOVE, HEAL] },                       // 300
                { tier: 2, parts: [[2, MOVE], [2, HEAL]] },             // 600
                { tier: 3, parts: [[4, MOVE], [4, HEAL]] },             // 1200
                { tier: 4, parts: [[5, MOVE], [5, HEAL]] },             // 1500
                { tier: 5, parts: [[6, MOVE], [6, HEAL]] },             // 1800
                { tier: 6, parts: [[3, TOUGH], [10, MOVE], [7, HEAL]] } // 2280
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body, { guardRoom: room.name, dontFlee: true }, 'GH')) continue
        }

        // Guard
        let guardsNeeded = spawn.memory.guards
        // Extra guard when hostiles in room
        if (room.find(FIND_HOSTILE_CREEPS, {
            filter: c => c.countActiveParts([ATTACK, RANGED_ATTACK, HEAL])
        }).length) guardsNeeded += 1
        if (room.countCreeps('guard') < guardsNeeded) {
            const type = 'guard'
            const bodies = [
                { tier: 1, parts: [[2, MOVE], [2, ATTACK]] },                                             // 260
                { tier: 2, parts: [[3, MOVE], [2, ATTACK], RANGED_ATTACK] },                              // 460
                { tier: 3, parts: [[4, MOVE], [2, ATTACK], RANGED_ATTACK, HEAL] },                        // 760
                { tier: 4, parts: [[7, MOVE], [3, ATTACK], [3, RANGED_ATTACK], HEAL] },                   // 1290
                { tier: 5, parts: [[2, TOUGH], [11, MOVE], [4, ATTACK], [4, RANGED_ATTACK], HEAL] },      // 1740
                { tier: 6, parts: [[0, TOUGH], [12, MOVE], [5, ATTACK], [5, RANGED_ATTACK], [2, HEAL]] }  // 2250
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body, { guardRoom: room.name, dontFlee: true })) continue
        }

        // Builder
        let buildersNeeded = spawn.memory.builders
        if (room.getUsedCapacity(RESOURCE_ENERGY, true) < 100) buildersNeeded = 0
        const sites = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s => !s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
        }).length
        if (sites && room.countCreeps('builder') < buildersNeeded) {
            const type = 'builder'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }  // 750
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body)) continue
        }

        // Repairer
        const repairersNeeded = spawn.memory.repairers
        const repairs = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType.isInList(
                STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE
                , STRUCTURE_LINK, STRUCTURE_TOWER
            ) && s.hits < s.hitsMax
        }).length
        if (repairs && room.countCreeps('repairer') < repairersNeeded) {
            const type = 'repairer'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }  // 750
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body)) continue
        }

        // Wall repairer
        let need = spawn.memory.wallRepairers
        const wallBuilds = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
        }).length
        const wallRepairs = room.find(FIND_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_WALL, STRUCTURE_RAMPART)
                && s.hits < room.wallsStrength()
        }).length
        if (wallBuilds + wallRepairs < 5) need = 1
        if ((wallRepairs || wallBuilds) && room.countCreeps('wallRepairer') < need) {
            const type = 'wallRepairer'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }  // 750
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body)) continue
        }

        // Attacker
        const attackersNeeded = spawn.memory.attackers
        const countAttackers = _.filter(Game.creeps, c =>
            c.memory.type == 'attacker'
            && c.memory.spawnRoom == room.name
        ).length
        if (spawn.memory.attackRoom && countAttackers < attackersNeeded) {
            const type = 'attacker'
            const bodies = [
                { tier: 1, parts: [[1, MOVE], [1, RANGED_ATTACK]] },            // 300
                { tier: 2, parts: [[2, MOVE], [2, RANGED_ATTACK]] },            // 400
                { tier: 3, parts: [[4, MOVE], [4, RANGED_ATTACK]] },            // 800
                { tier: 4, parts: [[6, MOVE], [5, RANGED_ATTACK], [1, HEAL]] }, // 1300
                { tier: 5, parts: [[8, MOVE], [6, RANGED_ATTACK], [2, HEAL]] }, // 1800
                { tier: 6, parts: [[10, MOVE], [7, RANGED_ATTACK], [3, HEAL]] } // 2300
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            if (spawn.buildCreep(type, body, { dontFlee: true })) continue
        }

        // Remote harvester
        if (spawn.memory.remoteHarvestRooms) {
            // Check for local energy storage capacity
            const availableEnergyStorage = room.getFreeCapacity()
            if (availableEnergyStorage < 500) continue

            // Check for hostiles (source room)
            if (spawn.room.hasDanger()) {
                info('⛔ ' + room.name + ' has hostiles, not spawing remote harvester')
                continue
            }

            // Iterate remote rooms
            const remoteHarvestRooms = spawn.memory.remoteHarvestRooms.split(',')
            for (let remoteHarvestRoom of remoteHarvestRooms) {
                remoteHarvestRoom = remoteHarvestRoom.trim()
                if (!remoteHarvestRoom.length) continue

                // Check for hostiles (visible remote room)
                if (Game.rooms[remoteHarvestRoom] && Game.rooms[remoteHarvestRoom].hasDanger()) {
                    let thisRoom = room.name
                    let remoteRoom = remoteHarvestRoom
                    info(`⛔ ${thisRoom} ${remoteRoom} has hostiles, not spawing remote harvester`)
                    continue
                }

                // Count remote harvesters for remote room
                let remoteHarvesters = _.filter(Game.creeps, c =>
                    c.memory.type == 'remoteHarvester'
                    && c.memory.spawnRoom == room.name
                    && c.memory.remoteRoom == remoteHarvestRoom
                )

                // Get remote harvesting capability / production
                let energyHarvesting = 0
                remoteHarvesters.forEach(c => energyHarvesting += c.getActiveBodyparts(WORK) * 2)
                let roomEnergyProduction = 1
                let sourceSpots = 1
                if (Game.rooms[remoteHarvestRoom]) {
                    roomEnergyProduction = Game.rooms[remoteHarvestRoom].energyProduction()
                    sourceSpots = Game.rooms[remoteHarvestRoom].sourceSpots()
                }

                // Spawn remote harvester
                if (
                    energyHarvesting < roomEnergyProduction
                    && remoteHarvesters.length < sourceSpots
                ) {
                    const type = 'remoteHarvester'
                    const bodies = [
                        { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                        { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                        { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }, // 750
                        { tier: 4, parts: [[5, WORK], [5, CARRY], [10, MOVE]] } // 1250
                    ]
                    let body = null
                    bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
                    const memory = { remoteRoom: remoteHarvestRoom, fleeRange: 15 }
                    if (spawn.buildCreep(type, body, memory, 'RH')) continue spawnloop
                }

            }
        }

        // Claimer
        const claimersNeeded = spawn.memory.claimers
        if (spawn.memory.claimRoom) {
            const type = 'claimer'
            const room = Game.rooms[spawn.memory.claimRoom]
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }, // 750
                { tier: 4, parts: [[5, WORK], [5, CARRY], [10, MOVE]] } // 1250
            ]
            let body = null

            // Room visible
            if (room) {

                // Check/stop if room is fully claimed (has owned spawn)
                if (room.find(FIND_MY_SPAWNS).length) {
                    spawn.memory.claimRoom = null
                    continue
                }

                // Check max claimers
                let claimers = _.filter(Game.creeps, c =>
                    c.memory.type == type && c.memory.spawnRoom == room.name
                ).length
                if (claimers >= claimersNeeded) {
                    continue
                }

                // Check for danger
                if (room.hasDanger()) continue

                // Claimer when room visible but controller not owned
                if (!room.controller.my) {
                    let b = { tier: 2, parts: [CLAIM, WORK, CARRY, [3, MOVE]] } // 900
                    if (spawn.hasCapacity(b)) body = b
                }

                // Claimer supporter when room has no spawn yet
                else {
                    bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
                }
            }

            // Room not visible
            else {
                // Claimer when room not visible (and thus controller not owned)
                let b = { tier: 2, parts: [CLAIM, WORK, CARRY, [3, MOVE]] } // 900
                if (spawn.hasCapacity(b)) body = b
            }

            const memory = { room: spawn.memory.claimRoom, dontFlee: true }
            if (body && spawn.buildCreep(type, body, memory)) continue
        }

        // Extra upgraders
        let extraUpgraderNeeded = true
        if (controllerLevel == 8) extraUpgraderNeeded = false
        else if (room.getUsedCapacity() < energyBuffer) extraUpgraderNeeded = false
        else if (room.find(FIND_MY_CONSTRUCTION_SITES).length) extraUpgraderNeeded = false
        else if (Game.time - spawn.memory.lastUpgraderBuilt < 200) extraUpgraderNeeded = false
        if (extraUpgraderNeeded) {
            const type = 'upgrader'
            const bodies = [
                { tier: 1, parts: [WORK, CARRY, [2, MOVE]] },           // 250
                { tier: 2, parts: [[2, WORK], [2, CARRY], [4, MOVE]] }, // 500
                { tier: 3, parts: [[3, WORK], [3, CARRY], [6, MOVE]] }  // 750
            ]
            let body = null
            bodies.forEach(b => { if (spawn.hasCapacity(b)) body = b })
            let buildCreep = spawn.buildCreep(type, body)
            if (buildCreep == 1) spawn.memory.lastUpgraderBuilt = Game.time
            if (buildCreep) continue
        }

    }

}
