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
    if (!body) return false
    const name = this.generateCreepName(type, body.tier, overrideName)
    const memMerge = Object.assign({ type: type, spawnRoom: this.room.name }, memory)
    const r = this.spawnCreep(expandBody(body.parts), name, { memory: memMerge })
    if (r == OK) {
        let extraInfo = ''
        if (memory) extraInfo = JSON.stringify(memory)
        info('🐣 ' + this.room.name + ' spawning ' + type + ' ' + name + ' ' + extraInfo)
        return true
    }
    else if (r == ERR_NOT_ENOUGH_ENERGY) return true
    return false
}

StructureSpawn.prototype.energyPossible = function (amount) {
    if (amount <= 300) return true
    if (this.room.energyCapacityAvailable < amount) return false
    if (!this.room.countCreeps('harvester')) return false
    if (!this.room.countCreeps('transporter')) return false
    return true
}

function expandBody(parts) {
    // Converts [[3, MOVE], [2, ATTACK], RANGED_ATTACK] to [MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK]
    return [].concat(...parts.map(p => {
        if (Array.isArray(p)) return Array(p[0]).fill(p[1])
        else return p
    }))
}
