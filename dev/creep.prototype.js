// goTo
if (Memory.reusePath == undefined) Memory.reusePath = 5
Creep.prototype.goTo = function (target, inRange = 0, maxRooms = 1) {
    let r = this.moveTo(target, {
        visualizePathStyle: {},
        reusePath: Memory.reusePath,
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
    return this.store.getUsedCapacity() == 0
}

// isFull
Creep.prototype.isFull = function () {
    return this.store.getFreeCapacity() == 0
}

// getEnergy
Creep.prototype.getEnergy = function (opts = {}) {
    if (opts.fromStorage === undefined) opts.fromStorage = true
    if (opts.minAmount === undefined) opts.minAmount = 50
    if (opts.preferredAmount === undefined) opts.preferredAmount = this.store.getFreeCapacity()
    if (opts.structureMinPercentFull === undefined) opts.structureMinPercentFull = 0

    // Structures
    let energySources = this.room.find(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_LINK)
            && s.store[RESOURCE_ENERGY] >= opts.minAmount
            && s.store[RESOURCE_ENERGY] / s.store.getCapacity(RESOURCE_ENERGY) * 100 >= opts.structureMinPercentFull
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

    // Check for preferred amount
    if (opts.preferredAmount > opts.minAmount) {
        let withPreferredAmount = _.filter(energySources, s =>
            (s.store && s.store[RESOURCE_ENERGY] >= opts.preferredAmount)
            || (s.amount >= opts.preferredAmount)
        )
        if (withPreferredAmount.length) energySources = withPreferredAmount
    }

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
Creep.prototype.idle = function (flagColor = COLOR_WHITE) {
    const idleFlag = this.pos.findClosestByPath(FIND_FLAGS, { filter: { color: flagColor } })
    const spawn = this.room.spawn()

    // Move towards idle flag
    if (idleFlag && !this.pos.inRangeTo(idleFlag, 2)) this.goTo(idleFlag, 2)

    // Move towards spawn
    else if (!idleFlag && spawn && !this.pos.inRangeTo(spawn, 2)) this.goTo(spawn, 2)

    // Move towards controller
    else if (!idleFlag && !spawn && !this.pos.inRangeTo(this.room.controller, 2)) this.goTo(this.room.controller, 2)

    // Move random direction
    else {
        for (i = 1; i <= 10; i++) {
            // Get random direction
            direction = Math.floor(Math.random() * 8) + 1
            // Check for plain
            if (this.pos.lookForInDirection(direction, LOOK_TERRAIN)[0] == 'plain') break
        }
        this.move(direction)
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
        // Check if on rampart
        if (_.filter(this.pos.look(LOOK_STRUCTURES),
            s => s.type == 'structure' && s.structure.structureType == STRUCTURE_RAMPART
        ).length) return false

        // Check for hostiles
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
            info('🆘 ' + this.room.name + ' ' + this.name + ' is fleeing')
        }
        this.say('🆘')

        // Return to spawn room
        if (this.room.name != this.memory.spawnRoom) {
            this.memory.room = this.memory.spawnRoom
            this.switchRoom()
        }

        // Flee to safe flag (green)
        else {
            this.idle(COLOR_GREEN)
        }

        return true
    }
    return false
}

// CountActiveParts
Creep.prototype.countActiveParts = function (types = []) {
    let count = 0
    for (const type of types) {
        count += this.getActiveBodyparts(type)
    }
    return count
}

// CountParts
Creep.prototype.countParts = function (types = []) {
    let count = 0
    for (const type of types) {
        count += this.body.reduce((n, part) => n + (part.type == type), 0)
    }
    return count
}

// Renew
if (Memory.renewCreeps == undefined) Memory.renewCreeps = true
Creep.prototype.renew = function () {
    if (!Memory.renewCreeps) return false
    if (!this.memory.renew && this.ticksToLive > 30) return false
    const spawn = this.room.spawn()
    if (spawn.store[RESOURCE_ENERGY] < 150) return false
    if (!this.memory.renew) this.memory.renew = true
    if (this.ticksToLive > 1490) delete this.memory.renew
    if (this.pos.inRangeTo(spawn, 1)) return true
    return this.goTo(spawn, 1)
}
