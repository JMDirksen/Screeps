String.prototype.isInList = function() {
    let value = this.valueOf();
    for (let i = 0, l = arguments.length; i < l; i += 1) {
        if (arguments[i] === value) return true;
    }
    return false;
}
