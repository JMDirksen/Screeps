'use strict'

if (Memory.info == undefined) Memory.info = true
if (Memory.debug == undefined) Memory.debug = false

global.info = function (text) {
    if (!Memory.info) return
    // Stringify object
    if (typeof text === 'object') text = JSON.stringify(text)
    // Room links
    if (typeof text === 'string') text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
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
    if (typeof text === 'string') text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    // Game tick (short)
    let tick = Game.time.toString().slice(-3)
    // Prefix
    let prefix = `<font color="Gray">[${tick}]</font> <font color="DarkGoldenrod">Debug:</font> `
    console.log(prefix + text)
}

global.creepsWithJob = function (creepType, jobId) {
    return _.filter(Game.creeps, c => c.memory.type == creepType && c.memory.job == jobId)
}

global.round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}

global.expandParts = function (parts) {
    // Converts [[3, MOVE], [2, ATTACK], RANGED_ATTACK] to [MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK]
    if (!parts || !parts.length) return parts
    return [].concat(...parts.map(p => {
        if (Array.isArray(p)) return Array(p[0]).fill(p[1])
        else return p
    }))
}

global.partsCost = function (parts) {
    if (!parts || !parts.length) return 0
    parts = expandParts(parts)
    let cost = 0
    parts.forEach(p => {
        if (p == MOVE) cost += 50
        else if (p == WORK) cost += 100
        else if (p == CARRY) cost += 50
        else if (p == ATTACK) cost += 80
        else if (p == RANGED_ATTACK) cost += 150
        else if (p == HEAL) cost += 250
        else if (p == CLAIM) cost += 600
        else if (p == TOUGH) cost += 10
    })
    return cost
}

global.shortNumber = function (number) {
    if (number >= 100000000) return round(number / 1000000, 0) + 'M'
    if (number >= 10000000) return round(number / 1000000, 1) + 'M'
    if (number >= 100000) return round(number / 1000, 0) + 'K'
    if (number >= 10000) return round(number / 1000, 1) + 'K'
    return number
}
