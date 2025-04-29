'use strict'

module.exports = function () {
    if (Game.time % 100) return

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        let list = spawn.memory.autoBuildRoadsList
        
        // Look for road to build
        const highestCount = _.sortByOrder(list, ['count'], ['desc'])[0]
        debug(`${spawn.room.name} roadBuilder: ${JSON.stringify(list)}`)
        // Build road
        if (highestCount && highestCount.count >= 5) {
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
