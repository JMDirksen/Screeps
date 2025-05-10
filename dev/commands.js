'use strict'

global.help = `Show available commands with: commands()`
global.commands = `Available commands: attack() claim() stats()`

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

global.stats = function () {
    let output = `Global stats:\n`
    output += `Average CPU usage: ${Memory.cpuAvgPct}\n`
    output += `Room stats:\n`
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]
        const roomName = spawn.room.name
        const rcl = spawn.room.controllerLevel()
        const wallStrength = shortNumber(spawn.memory.wallStrength)
        output += `${roomName} ${spawnName} RCL=${rcl} wallStrength=${wallStrength}\n`
    }
    // Room links
    output = output.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    return output
}
