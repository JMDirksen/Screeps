'use strict'

module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'transporter') run(creep)
    }
}

function run(creep) {
    if (creep.spawning) return

    // Flee
    if (creep.flee()) return

    // Switch room
    if (creep.switchRoom()) return

    // Renew
    if (creep.renew()) return

    // Check if empty/full
    if (creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false
        debug(`${creep.name} empty`)
    }
    if (!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true
        debug(`${creep.name} full`)
    }

    // Get job
    if (!creep.memory.job) {
        let job = getTransportJob(creep)
        debug(`${creep.name} ${job}`)
        if (job) creep.memory.job = job
        else return creep.idle({ inPlace: true })
    }

    // Emergency tower supply
    if (creep.memory.job == 'etower') {
        const eTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
        })
        if (!eTowers.length) return creep.memory.job = false
        const eTower = _.sortBy(eTowers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0]
        if (creep.memory.transport) {
            creep.say('❗')
            const r = creep.transfer(eTower, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) if (creep.goTo(eTower, 1)) return
        }
        else {
            creep.say('❗')
            if (creep.getEnergy()) return
        }
    }

    // Spawn/Extension
    else if (creep.memory.job == 'spawn') {
        const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
                && s.store.getFreeCapacity(RESOURCE_ENERGY)
        })
        if (!spawn) return creep.memory.job = false
        if (creep.memory.transport) {
            const r = creep.transfer(spawn, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) if (creep.goTo(spawn, 1)) return
        }
        else {
            if (creep.getEnergy()) return
        }
    }

    // Tower
    else if (creep.memory.job == 'tower') {
        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY)
        })
        if (!towers.length) return creep.memory.job = false
        const tower = _.sortBy(towers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0]
        if (creep.memory.transport) {
            const r = creep.transfer(tower, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) if (creep.goTo(tower, 1)) return
        }
        else {
            if (creep.getEnergy()) return
        }
    }

    // Links
    else if (creep.memory.job == 'link') {
        const link = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_LINK
        })
        if (link.store.getUsedPercentage() >= 75) return creep.memory.job = false
        if (!link) return creep.memory.job = false
        if (creep.memory.transport) {
            const r = creep.transfer(link, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) if (creep.goTo(link, 1)) return
            if (r == OK) return creep.memory.job = false
        }
        else {
            if (creep.getEnergy({ fromLinks: false, fromStorage: false })) return
        }
    }

    // Storage
    else if (creep.memory.job == 'storage') {
        const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_STORAGE
                && s.store.getFreeCapacity(RESOURCE_ENERGY)
        })
        if (!storage) return creep.memory.job = false
        if (creep.memory.transport) {
            const r = creep.transfer(storage, RESOURCE_ENERGY)
            if (r == ERR_NOT_IN_RANGE) if (creep.goTo(storage, 1)) return
            if (r == OK) return creep.memory.job = false
        }
        else {
            if (creep.getEnergy({ fromStorage: false, structureMinPercentFull: 50 })) return
        }
    }

    // Idle
    creep.idle({ inPlace: true })

}

function getTransportJob(creep) {

    // Emergency tower supply
    if (creep.room.hasDanger()) {
        const eTowers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
        })
        if (eTowers.length) return 'etower'
    }

    // Spawn/Extension
    const spawns = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    if (spawns.length) return 'spawn'

    // Link
    const links = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_LINK
            && s.store.getUsedPercentage() < 75
    })
    if (links.length) return 'link'

    // Tower
    const towers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_TOWER
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    if (towers.length) return 'tower'

    // Storage
    const storage = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_STORAGE
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
    })
    if (storage.length) return 'storage'

    return false
}
