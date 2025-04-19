if (Memory.info == undefined) Memory.info = true
if (Memory.debug == undefined) Memory.debug = false

global.info = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    if (Memory.info) console.log('<font color="Cyan">Info: </font>' + text)
}

global.debug = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    text = text.replace(/(?:W|E)\d{1,2}(?:N|S)\d{1,2}/g, '<a href="#!/room/$&">$&</a>')
    if (Memory.debug) console.log('<font color="DarkGoldenrod">Debug: </font>' + text)
}

global.creepsWithJob = function (creepType, jobId) {
    return _.filter(Game.creeps, c => c.memory.type == creepType && c.memory.job == jobId)
}
