'use strict'

if (Memory.info == undefined) Memory.info = true
if (Memory.debug == undefined) Memory.debug = false

global.info = function (text) {
    if (!Memory.info) return
    // Stringify object
    if (typeof text === 'object') text = JSON.stringify(text)
    // Room links
    text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    // Game tick (short)
    let tick = Game.time.toString().slice(-3)
    // Prefix
    let prefix = `<font color="Gray">[${tick}]</font> <font color="Cyan">Info:</font> `
    console.log(prefix + text)
}

global.debug = function (text) {
    if (!Memory.debug) return
    // Stringify object
    if (typeof text === 'object') text = JSON.stringify(text)
    // Room links
    text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    // Game tick (short)
    let tick = Game.time.toString().slice(-3)
    // Prefix
    let prefix = `<font color="Gray">[${tick}]</font> <font color="DarkGoldenrod">Debug:</font> `
    console.log(prefix + text)
}

global.creepsWithJob = function (creepType, jobId) {
    return _.filter(Game.creeps, c => c.memory.type == creepType && c.memory.job == jobId)
}
