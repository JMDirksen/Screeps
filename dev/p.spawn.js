'use strict'

StructureSpawn.prototype.generateCreepName = function (type, tier = null, overrideName = null) {
    const t = overrideName ? overrideName : type.charAt(0).toUpperCase()
    for (let i = 1; i <= 100; i++) {
        const name = t + tier + i;
        if (!Game.creeps[name]) {
            return name;
        }
    }
}

StructureSpawn.prototype.buildCreep = function (type, body, memory = null, overrideName = null) {
    if (!body) return 0
    const name = this.generateCreepName(type, body.tier, overrideName)
    const memMerge = Object.assign({ type: type, spawnRoom: this.room.name }, memory)
    const r = this.spawnCreep(expandParts(body.parts), name, { memory: memMerge })
    if (r == OK) {
        let extraInfo = ''
        if (memory) extraInfo = JSON.stringify(memory)
        info('🐣 ' + this.room.name + ' spawning ' + type + ' ' + name + ' ' + extraInfo)
        return 1
    }
    else if (r == ERR_NOT_ENOUGH_ENERGY) return 2
    return 0
}

StructureSpawn.prototype.hasCapacity = function (body) {
    let parts = expandParts(body.parts)
    let cost = partsCost(parts)
    if (cost <= 300) return true
    if (this.room.energyCapacityAvailable < cost) return false
    if (!this.room.countCreeps('harvester')) return false
    if (!this.room.countCreeps('transporter')) return false
    return true
}
