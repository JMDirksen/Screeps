module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName]
        if (creep.memory.type == 'upgrader') run(creep)
    }
};

function run(creep) {

    // Check if empty/full
    if (creep.memory.upgrade && creep.isEmpty()) {
        creep.memory.upgrade = false
    }
    if (!creep.memory.upgrade && creep.isFull()) {
        creep.memory.upgrade = true
    }

    // Upgrade
    if (creep.memory.upgrade) {
        const controller = creep.room.controller

        // Sign controller
        const sign = 'Mine mine mine...'
        if (!controller.sign || controller.sign.username != creep.owner.username || controller.sign.text != sign) {
            if (creep.signController(controller, sign) == ERR_NOT_IN_RANGE)
                return creep.goTo(controller, 1)
        }

        // Upgrade controller
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE)
            return creep.goTo(controller, 3)
    }

    // Get energy
    else if (!creep.getEnergy()) {
        if (creep.store[RESOURCE_ENERGY]) creep.memory.build = true
        return creep.idle()
    }

}
