global.verbose = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.verbose) console.log('Verbose: ' + text)
}

global.debug = function (text) {
    if (typeof text === 'object') text = JSON.stringify(text)
    if (Memory.verbose) console.log('Debug: ' + text)
}
