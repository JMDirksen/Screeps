Store.prototype.getUsedPercentage = function (resource = null) {
    return Math.round(this.getUsedCapacity(resource) / this.getCapacity(resource) * 100)
}
