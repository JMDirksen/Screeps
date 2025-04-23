// Load prototypes
require('functions')
require('creep.prototype')
require('room.prototype')
require('roomposition.prototype')
require('spawn.prototype')
require('string.prototype')

module.exports.loop = function () {

    // CPU Bucket check
    if (Game.cpu.bucket < 100) {
        info('🪣 Skipping tick due to low CPU bucket')
        return
    }

    // Clear memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            info('🪦 ' + name + ' died ' + JSON.stringify(_.omit(Memory.creeps[name], ['_move', 'path', 'timer', 'build', 'harvest'])))
            delete Memory.creeps[name]
        }
    }
    for (const name in Memory.spawns) {
        if (!Game.spawns[name]) {
            info('🔥 ' + name + ' is gone')
            delete Memory.spawns[name]
        }
    }

    // Run creep types
    require('harvester')()
    require('remoteHarvester')()
    require('upgrader')()
    require('builder')()
    require('transporter')()
    require('repairer')()
    require('wallRepairer')()
    require('attacker')()
    require('claimer')()
    require('guard')()

    // Run structures
    if (!(Game.time % 10)) require('spawn')()
    require('tower')()
    require('link')()
    require('observer')()

    // CPU usage monitoring
    let samples = 100
    if (Memory.cpuAvg == undefined) Memory.cpuAvg = Game.cpu.getUsed()
    Memory.cpuAvg = ((samples - 1) * Memory.cpuAvg + Game.cpu.getUsed()) / samples
    Memory.cpuAvgPct = Math.round(Memory.cpuAvg / Game.cpu.limit * 100)
    if (!(Game.time % 10) && Memory.cpuAvgPct >= 95) info(`🔥 Average cpu usage: ${Memory.cpuAvgPct}%`)
}
