// goTo
Creep.prototype.goTo = function(target, maxRooms = 1) {
    let r = this.moveTo(target,{
        visualizePathStyle: {},
        reusePath: 5,
        maxRooms: maxRooms
    });
    switch(r) {
        case OK:
            return true;
            break;
        case ERR_TIRED:
            this.say('.');
            return true;
            break;
        case ERR_NO_PATH:
            this.say('?');
            break;
        case ERR_INVALID_TARGET:
            this.say('??');
            break;
        default:
            this.say(r);
    }
    return false;
}

// isEmpty
Creep.prototype.isEmpty = function() {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function() {
    return _.sum(this.carry) == this.carryCapacity;
}

// getEnergy
Creep.prototype.getEnergy = function(fromStorage = true) {
    // Structures
    let energySources = this.room.find(FIND_STRUCTURES, {
        filter: s => (
            s.structureType == STRUCTURE_CONTAINER
            || s.structureType == STRUCTURE_LINK
        ) && s.store[RESOURCE_ENERGY]
    });
    // Storage
    if (fromStorage) {
        energySources = energySources.concat(this.room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY]
        }));
    }
    // Tombstones
    energySources = energySources.concat(this.room.find(FIND_TOMBSTONES, {
        filter: t => t.store[RESOURCE_ENERGY]
    }));    
    // Ruins
    energySources = energySources.concat(this.room.find(FIND_RUINS, {
        filter: r => r.store[RESOURCE_ENERGY]
    }));
    // Dropped energy
    energySources = energySources.concat(this.room.find(FIND_DROPPED_RESOURCES, {
            filter: { resourceType: RESOURCE_ENERGY }
    }));
    if(energySources.length) {
        let energy = this.pos.findClosestByPath(energySources);
        let r = this.withdraw(energy, RESOURCE_ENERGY);
        if (r == ERR_INVALID_TARGET) r = this.pickup(energy);
        if (r == ERR_INVALID_TARGET) return false;
        if (r == ERR_NOT_IN_RANGE) {
            this.goTo(energy);
            return true;
        }
        if (r == OK) return true;
        else {
            this.say(r);
            return false;
        }
    }
    
}

// Idle
Creep.prototype.idle = function() {
    let spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS);
    // Move towards spawn
    if(spawn && !this.pos.inRangeTo(spawn, 3)) this.goTo(spawn);
    // Move random
    else this.move(Math.floor(Math.random() * 8) + 1);
}

// switchRoom
Creep.prototype.switchRoom = function() {
    let roomName = this.memory.room;
    if(roomName) {
        let room = Game.rooms[roomName];
        // Room visible
        if(room) {
            if(this.pos.inRangeTo(new RoomPosition(25, 25, roomName), 20)) this.memory.room = null;
            this.moveTo(new RoomPosition(25, 25, roomName), {range: 15, visualizePathStyle: {}});
            return true;
        }
        // Room not visible yet
        else {
            let exit = this.pos.findClosestByPath(
                this.room.findExitTo(roomName)
            );
            this.goTo(exit);
            return true;
        }
    }
    return false;
}
