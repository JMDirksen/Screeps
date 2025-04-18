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
    const name = this.generateCreepName(type, body.tier, overrideName)
    const memMerge = Object.assign({ type: type, spawnRoom: this.room.name }, memory)
    const r = this.spawnCreep(body.parts, name, { memory: memMerge })
    if (r == OK) {
        let extraInfo = ''
        if (memory) extraInfo = JSON.stringify(memory)
        verbose(this.room.name + ' ' + this.name + ' spawning ' + type + ' ' + name + ' ' + extraInfo)
        return true
    }
    else if (r == ERR_NOT_ENOUGH_ENERGY) return true
    return false
}

StructureSpawn.prototype.energyPossible = function (amount) {
    if (amount < 300) return true;
    if (this.room.energyCapacityAvailable < amount) return false;
    if (!this.room.countCreeps('harvester')) return false;
    return true;
}
