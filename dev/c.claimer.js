'use strict'

module.exports = function (creep) {
    // Got shot at
    if (creep.hits < creep.hitsMax) {
        const spawnRoomSpawn = Game.rooms[creep.memory.spawnRoom].spawn()
        const claimRoom = spawnRoomSpawn.memory.claimRoom
        if (claimRoom) {
            spawnRoomSpawn.memory.claimRoom = null
            info(`❌ Claimer ${creep.name} got shot, claiming ${claimRoom} canceled`)
        }
    }

    // Claim
    if (creep.getActiveBodyparts(CLAIM)) {
        const controller = creep.room.controller
        if (controller && !controller.my) {
            let r = creep.claimController(controller)
            if (r == OK) return
            else if (r == ERR_NOT_IN_RANGE) if (creep.goTo(controller, 1)) return
            else if (r == ERR_INVALID_TARGET) {
                let r = creep.attackController(controller)
                if (r == OK) return
                else if (r == ERR_NOT_IN_RANGE) if (creep.goTo(controller, 1)) return
                else return creep.say(r)
            }
            else return creep.say(r)
        }
    }

    // Harvest
    if (creep.isEmpty()) creep.memory.harvest = true
    if (creep.isFull()) creep.memory.harvest = false
    if (creep.memory.harvest) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.goTo(source, 1)
        return
    }

    // Build spawn
    const spawnSite = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_SPAWN }
    })[0]
    if (spawnSite) {
        if (creep.build(spawnSite) == ERR_NOT_IN_RANGE) creep.goTo(spawnSite, 3)
        return
    }

    // Supply spawn
    const spawn = creep.room.find(FIND_MY_SPAWNS, { filter: s => s.store.getFreeCapacity(RESOURCE_ENERGY) })[0]
    if (spawn) {
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(spawn, 1)
        return
    }

    // Upgrade controller
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.goTo(creep.room.controller, 3)

}
