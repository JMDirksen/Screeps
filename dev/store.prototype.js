'use strict'

Store.prototype.getUsedPercentage = function (resource = RESOURCE_ENERGY) {
    return Math.round(this.getUsedCapacity(resource) / this.getCapacity(resource) * 100)
}
