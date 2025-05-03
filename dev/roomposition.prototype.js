'use strict'

RoomPosition.prototype.lookForInDirection = function (direction, type) {
    let pos = this.getPosInDirection(direction)
    if (pos) return pos.lookFor(type)
    else return false
}

RoomPosition.prototype.getPosInDirection = function (direction) {
    let rp = new RoomPosition(this.x, this.y, this.roomName)
    try {
        if (direction == LEFT)         return rp.x -= 1, rp
        if (direction == RIGHT)        return rp.x += 1, rp
        if (direction == TOP)          return rp.y -= 1, rp
        if (direction == BOTTOM)       return rp.y += 1, rp
        if (direction == TOP_LEFT)     return rp.x -= 1, rp.y -= 1, rp
        if (direction == BOTTOM_RIGHT) return rp.x += 1, rp.y += 1, rp
        if (direction == BOTTOM_LEFT)  return rp.x -= 1, rp.y += 1, rp
        if (direction == TOP_RIGHT)    return rp.x += 1, rp.y -= 1, rp
    } catch (error) {
        return false
    }
    return false
}

RoomPosition.prototype.isInBounds = function (bounds) {
    // Bounds: [{ x: 0, y: 0 }, { x: 49, y: 49 }]
    return this.x >= bounds[0].x
        && this.y >= bounds[0].y
        && this.x <= bounds[1].x
        && this.y <= bounds[1].y
}

RoomPosition.prototype.registerBuildRoad = function () {
    const spawn = Game.rooms[this.roomName].spawn()
    if (!spawn) return
    if (spawn.memory.autoBuildRoads == undefined) spawn.memory.autoBuildRoads = true
    if (!spawn.memory.autoBuildRoads) return
    if (spawn.memory.autoBuildRoadsList == undefined) spawn.memory.autoBuildRoadsList = []
    if (this.lookFor(LOOK_TERRAIN)[0] != 'swamp') return
    if (this.lookFor(LOOK_CONSTRUCTION_SITES)[0]) return
    let list = spawn.memory.autoBuildRoadsList
    let listPos = _.filter(list, { 'x': this.x, 'y': this.y })[0]
    if (listPos) {
        listPos.count++
    }
    else {
        list.push({ 'x': this.x, 'y': this.y, 'count': 1 })
    }
    //debug(`registerBuildRoad: ${this.x} ${this.y}`)
}
