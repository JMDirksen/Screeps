// Load prototypes
require('creep.prototype')
require('spawn.prototype')
require('room.prototype')
require('string.prototype')
require('functions')

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
    if (Memory.cpuAvg == undefined) Memory.cpuAvg = Game.cpu.getUsed() / Game.cpu.limit * 100
    Memory.cpuAvg = (99 * Memory.cpuAvg + Math.round(Game.cpu.getUsed() / Game.cpu.limit * 100)) / 100
    if (!(Game.time % 10) && Memory.cpuAvg >= 95) info(`🔥 Average cpu usage: ${Math.round(Memory.cpuAvg)}%`)
}
