'use strict'

// Load generic functions
require('functions')

// Load prototypes
require('p.creep')
require('p.room')
require('p.roomposition')
require('p.spawn')
require('p.store')
require('p.string')

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

    // Run creeps
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.spawning) continue
        if (creep.flee()) continue
        if (creep.switchRoom()) continue
        require('c.' + creep.memory.type)(creep)
    }

    // Run structures
    require('s.spawn')()
    require('s.tower')()
    require('s.link')()
    require('s.observer')()

    // Run virtuals
    require('v.roadBuilder')()

    // CPU usage monitoring
    const samples = 100
    if (Memory.cpuAvg == undefined) Memory.cpuAvg = Game.cpu.getUsed()
    Memory.cpuAvg = ((samples - 1) * Memory.cpuAvg + Game.cpu.getUsed()) / samples
    Memory.cpuAvgPct = Math.round(Memory.cpuAvg / Game.cpu.limit * 100) + '%'
    if (!(Game.time % 10) && Memory.cpuAvgPct >= 95) info(`🔥 Average cpu usage: ${Memory.cpuAvgPct}%`)

}
