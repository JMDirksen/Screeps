global.info = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.info) console.log('<font color="Cyan">Info: </font>' + text)
}

global.debug = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.debug) console.log('<font color="DarkGoldenrod">Debug: </font>' + text)
}

global.creepsWithJob = function (creepType, jobId) {
    return _.filter(Game.creeps, c => c.memory.type == creepType && c.memory.job == jobId)
}
