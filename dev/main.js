// Load generic functions
require('functions')

// Load prototypes
require('creep.prototype')
require('room.prototype')
require('roomposition.prototype')
require('spawn.prototype')
require('store.prototype')
require('string.prototype')

module.exports.loop = function () {

    // Generate pixel
    if (Memory.generatePixels == undefined) Memory.generatePixels = true
    if (Memory.generatePixels && Game.cpu.bucket >= 10000) {
        let r = Game.cpu.generatePixel()
        if (r == OK) return info('🟩 Generated a pixel')
        else info('🟥 Pixel generation failed')
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
    require('guardHealer')()

    // Run structures
    require('spawn')()
    require('tower')()
    require('link')()
    require('observer')()

    // CPU usage monitoring
    const samples = 100
    if (Memory.cpuAvg == undefined) Memory.cpuAvg = Game.cpu.getUsed()
    Memory.cpuAvg = ((samples - 1) * Memory.cpuAvg + Game.cpu.getUsed()) / samples
    Memory.cpuAvgPct = Math.round(Memory.cpuAvg / Game.cpu.limit * 100) + '%'
    if (!(Game.time % 10) && Memory.cpuAvgPct >= 95) info(`🔥 Average cpu usage: ${Memory.cpuAvgPct}%`)

}
