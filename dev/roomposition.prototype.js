RoomPosition.prototype.lookForInDirection = function (direction, type) {
    return this.getPosInDirection(direction).lookFor(type)
}

RoomPosition.prototype.getPosInDirection = function (direction) {
    let rp = new RoomPosition(this.x, this.y, this.roomName)
    if (direction == LEFT)         return rp.x -= 1, rp
    if (direction == RIGHT)        return rp.x += 1, rp
    if (direction == TOP)          return rp.y -= 1, rp
    if (direction == BOTTOM)       return rp.y += 1, rp
    if (direction == TOP_LEFT)     return rp.x -= 1, rp.y -= 1, rp
    if (direction == BOTTOM_RIGHT) return rp.x += 1, rp.y += 1, rp
    if (direction == BOTTOM_LEFT)  return rp.x -= 1, rp.y += 1, rp
    if (direction == TOP_RIGHT)    return rp.x += 1, rp.y -= 1, rp
    return false
}

RoomPosition.prototype.isInBounds = function (bounds) {
    // Bounds: [{ x: 0, y: 0 }, { x: 49, y: 49 }]
    return this.x >= bounds[0].x
        && this.y >= bounds[0].y
        && this.x <= bounds[1].x
        && this.y <= bounds[1].y
}
