StructureSpawn.prototype.generateCreepName = function(type) {
    const t = type.charAt(0).toUpperCase();
    for(let i = 1; i<=100; i++) {
        const name = t + i;
        if(!Game.creeps[name]) {
            return name;
        }
    }
}
