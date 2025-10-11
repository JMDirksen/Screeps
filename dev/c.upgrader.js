'use strict'

module.exports = function (creep) {
    // Check if empty/full
    if (creep.memory.upgrade && creep.isEmpty()) {
        creep.memory.upgrade = false
    }
    if (!creep.memory.upgrade && !creep.isEmpty()) {
        creep.memory.upgrade = true
    }

    // Upgrade
    if (creep.memory.upgrade) {
        const controller = creep.room.controller

        // Sign controller
        const sign = '🤖 Mine mine mine...'
        if (!controller.sign || controller.sign.username != creep.owner.username || controller.sign.text != sign) {
            if (creep.signController(controller, sign) == ERR_NOT_IN_RANGE)
                return creep.goTo(controller, 1)
        }

        // Check if upgrade needed
        if (controller.level == 8 && controller.ticksToDowngrade > 150000 - 100)
            return creep.idle({ inPlace: true })

        // Upgrade controller
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE)
            return creep.goTo(controller, 3)
    }

    // Get energy
    else if (!creep.getEnergy()) return creep.idle()

}
