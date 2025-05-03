'use strict'

module.exports = function (creep) {
    // Check if empty/full
    if (creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false
        creep.memory.job = false
        //debug(`${creep.name} empty`)
    }
    if (!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true
        //debug(`${creep.name} full`)
    }

    // Check if job done (target full)
    if (creep.memory.job) {
        let target = Game.getObjectById(creep.memory.job)
        if (target && target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) creep.memory.job = false
    }

    // Get job
    if (!creep.memory.job) {
        let job = getTransportJob(creep)
        //debug(`${creep.name} ${job}`)
        if (job) creep.memory.job = job
        else return creep.idle({ inPlace: true })
    }

    // Do job
    let target = Game.getObjectById(creep.memory.job)
    if (!target) {
        creep.memory.job = false
        return creep.say('❓')
    }
    // Deliver energy
    if (creep.memory.transport) {
        const r = creep.transfer(target, RESOURCE_ENERGY)
        if (r == OK) return
        if (r == ERR_NOT_IN_RANGE) if (creep.goTo(target, 1)) return
    }
    // Get energy
    else {
        let opts = {}
        if (target.structureType == STRUCTURE_LINK) opts = {
            fromLinks: false, fromStorage: false
        }
        else if (target.structureType == STRUCTURE_STORAGE) opts = {
            fromStorage: false, structureMinPercentFull: 50
        }
        if (creep.getEnergy(opts)) return
        else creep.memory.job = false
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
                && !creepsWithJob('transporter', s.id).length
        })
        if (eTowers.length) {
            creep.say('❗')
            return _.sortBy(eTowers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0].id
        }
    }

    // Spawn/Extension
    const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
            && !creepsWithJob('transporter', s.id).length
    })
    if (spawn) return spawn.id

    // Link
    const linksFullPercent = creep.room.linksUsedPercentage()
    if (linksFullPercent !== false && linksFullPercent < 75) {
        const link = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_LINK
        })
        if (
            link.store.getFreeCapacity(RESOURCE_ENERGY)
            && !creepsWithJob('transporter', link.id).length
        ) return link.id
    }

    // Tower
    const towers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_TOWER
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
            && !creepsWithJob('transporter', s.id).length
    })
    if (towers.length) return _.sortBy(towers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0].id

    // Storage
    const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            s.structureType == STRUCTURE_STORAGE
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
            && !creepsWithJob('transporter', s.id).length
    })
    if (storage) return storage.id

    return false
}
