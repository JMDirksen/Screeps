// Load prototypes
require('creep.prototype')
require('spawn.prototype')
require('room.prototype')
require('string.prototype')
require('functions')

module.exports.loop = function () {

    // CPU Bucket check
    if (Game.cpu.bucket < 100) {
        console.log('Skipping tick due to low CPU bucket')
        return;
    }

    // Clear memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            verbose(name + ' died ' + JSON.stringify(_.omit(Memory.creeps[name], ['_move', 'path'])) + '...')
            delete Memory.creeps[name]
        }
    }
    for (const name in Memory.spawns) {
        if (!Game.spawns[name]) {
            verbose(name + ' is gone...')
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

}
