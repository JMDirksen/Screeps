StructureSpawn.prototype.generateCreepName = function(type) {
    const t = type.charAt(0).toUpperCase();
    for(let i = 1; i<=100; i++) {
        const name = t + i;
        if(!Game.creeps[name]) {
            return name;
        }
    }
}

StructureSpawn.prototype.buildCreep = function (type, body, memory = null) {
    const name = this.generateCreepName(type);
    memory = Object.assign({type: type}, memory);
    const r = this.spawnCreep(body, name, {memory: memory});
    if (r == OK || r == ERR_NOT_ENOUGH_ENERGY) return true;
    return false;
}
