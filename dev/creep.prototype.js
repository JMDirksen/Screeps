// goTo
Creep.prototype.goTo = function (target, inRange = 0, maxRooms = 1) {
    let r = this.moveTo(target, {
        visualizePathStyle: {},
        reusePath: 5,
        maxRooms: maxRooms,
        range: inRange
    });
    switch (r) {
        case OK:
            return true
            break
        case ERR_TIRED:
            this.say('💤')
            return true
            break
        case ERR_NO_PATH:
            this.say('⛔')
            break
        case ERR_INVALID_TARGET:
            this.say('🎯')
            break
        case ERR_NO_BODYPART:
            this.say('💔')
            break
        default:
            this.say(r)
    }
    return false
}

// isEmpty
Creep.prototype.isEmpty = function () {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function () {
    return _.sum(this.carry) == this.carryCapacity;
}

// getEnergy
Creep.prototype.getEnergy = function (opts = {}) {
    if (opts.fromStorage === undefined) opts.fromStorage = true
    if (opts.minAmount === undefined) opts.minAmount = 50

    // Structures
    let energySources = this.room.find(FIND_STRUCTURES, {
        filter: s => (
            s.structureType == STRUCTURE_CONTAINER
            || s.structureType == STRUCTURE_LINK
        ) && s.store[RESOURCE_ENERGY] >= opts.minAmount
    })
    // Storage
    if (opts.fromStorage) {
        energySources = energySources.concat(this.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] >= opts.minAmount
        }))
    }
    // Tombstones
    energySources = energySources.concat(this.room.find(FIND_TOMBSTONES, {
        filter: t => t.store[RESOURCE_ENERGY] >= opts.minAmount
    }))
    // Ruins
    energySources = energySources.concat(this.room.find(FIND_RUINS, {
        filter: r => r.store[RESOURCE_ENERGY] >= opts.minAmount
    }))

    // Dropped energy
    energySources = energySources.concat(this.room.find(FIND_DROPPED_RESOURCES, {
        filter: r => r.resourceType == RESOURCE_ENERGY && r.amount >= opts.minAmount
    }))

    // Go fetch closest
    if (energySources.length) {
        let energy = this.pos.findClosestByPath(energySources)
        let r = this.withdraw(energy, RESOURCE_ENERGY)
        if (r == ERR_INVALID_TARGET) r = this.pickup(energy)
        if (r == ERR_INVALID_TARGET) return false
        if (r == ERR_NOT_IN_RANGE) {
            this.goTo(energy, 1)
            return true
        }
        if (r == OK) return true
        else {
            this.say(r)
            return false
        }
    }
    else return false
}

// Idle
Creep.prototype.idle = function () {
    const idleFlag = this.pos.findClosestByPath(FIND_FLAGS, { filter: { color: COLOR_WHITE } })
    const spawn = this.room.spawn()

    // Move towards idle flag
    if (idleFlag && !this.pos.inRangeTo(idleFlag, 2)) this.goTo(idleFlag, 2)

    // Move towards spawn
    else if (!idleFlag && spawn && !this.pos.inRangeTo(spawn, 2)) this.goTo(spawn, 2)

    // Move towards controller
    else if (!idleFlag && !spawn && !this.pos.inRangeTo(this.room.controller, 2)) this.goTo(this.room.controller, 2)

    // Move random
    else {
        this.move(Math.floor(Math.random() * 8) + 1)
        // Cancel flee mode
        if (this.memory.flee) delete this.memory.flee
    }
}

// switchRoom
Creep.prototype.switchRoom = function () {
    let roomName = this.memory.room
    if (roomName) {
        let room = Game.rooms[roomName]
        // Room visible
        if (room) {
            let roomMidPoint = new RoomPosition(25, 25, roomName)
            if (this.pos.inRangeTo(roomMidPoint, 23)) this.memory.room = null
            this.goTo(roomMidPoint, 15, 16)
            return true
        }
        // Room not visible yet
        else {
            let exit = this.pos.findClosestByPath(
                this.room.findExitTo(roomName)
            );
            this.goTo(exit)
            return true
        }
    }
    return false
}

// Flee
Creep.prototype.flee = function (range = 4) {
    let hostiles = 0
    if (!this.memory.flee) {
        hostiles = this.pos.findInRange(FIND_HOSTILE_CREEPS, range, {
            filter: c => c.countActiveParts([ATTACK, RANGED_ATTACK])
        }).length
    }

    if (this.memory.flee || hostiles) {
        // Set flee mode
        if (!this.memory.flee) {
            this.memory.flee = true
            delete this.memory.job
            delete this.memory.harvest
            info(this.room.name + ' ' + this.name + ' is fleeing 🆘')
        }
        this.say('🆘')

        // Return to spawn room
        if (this.room.name != this.memory.spawnRoom) {
            this.memory.room = this.memory.spawnRoom
            this.switchRoom()
        }

        // Flee to idle flag
        else {
            this.idle()
        }

        return true
    }
    return false
}

// CountParts
Creep.prototype.countActiveParts = function (types = []) {
    let count = 0
    for (const type of types) {
        count += this.getActiveBodyparts(type)
    }
    return count
}
