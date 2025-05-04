'use strict'

global.commands = function () {
    return `Available: attack() claim()`
}

global.attack = function (fromSpawnName = null, targetRoomName = null, objectId = null) {
    if (!fromSpawnName) return `Usage:
Setup attack on room/object   attack(fromSpawnName, targetRoomName, [objectId])
Initiate attack               attack(fromSpawnName, true)
Current setup:
n/a`

    const spawn = Game.spawns[fromSpawnName]
    if (targetRoomName === true) spawn.memory.attackPause = false
    else {
        spawn.memory.attackRoom = targetRoomName
        spawn.memory.attackId = objectId
        spawn.memory.attackPause = true
    }
}

global.claim = function (fromSpawnName = null, targetRoomName = null) {
    if (!fromSpawnName) return `Usage: claim(fromSpawnName, targetRoomName)`
}
