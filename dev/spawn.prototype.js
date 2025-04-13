StructureSpawn.prototype.generateCreepName = function (type, tier = null) {
    const t = type.charAt(0).toUpperCase();
    for (let i = 1; i <= 100; i++) {
        const name = t + tier + i;
        if (!Game.creeps[name]) {
            return name;
        }
    }
}

StructureSpawn.prototype.buildCreep = function (type, body, memory = null) {
    const name = this.generateCreepName(type, body.tier);
    memory = Object.assign({ type: type }, memory);
    const r = this.spawnCreep(body.parts, name, { memory: memory });
    if (r == OK || r == ERR_NOT_ENOUGH_ENERGY) return true;
    return false;
}

StructureSpawn.prototype.energyPossible = function (amount) {
    if (amount < 300) return true;
    if (this.room.energyCapacityAvailable < amount) return false;
    if (!this.room.countCreeps('harvester')) return false;
    return true;
}
