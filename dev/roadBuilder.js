'use strict'

module.exports = function () {
    if (Game.time % 25) return

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        let list = spawn.memory.autoBuildRoadsList
        //debug(list)

        // Look for road to build
        const highestCount = _.sortByOrder(list, ['count'], ['desc'])[0]
        // Build road
        if (highestCount && highestCount.count >= 10) {
            let roomPos = new RoomPosition(highestCount.x, highestCount.y, spawn.room.name)
            roomPos.createConstructionSite(STRUCTURE_ROAD)
            _.remove(list, i => i.x == highestCount.x && i.y == highestCount.y)
        }

        // Decrease counts
        for (let item of list) {
            item.count--
        }
        _.remove(list, i => i.count < 1)

    }

}
