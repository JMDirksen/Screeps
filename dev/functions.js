global.verbose = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.verbose) console.log('<font color="Cyan">Verbose: </font>' + text)
}

global.debug = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.verbose) console.log('<font color="DarkGoldenrod">Debug: </font>' + text)
}
