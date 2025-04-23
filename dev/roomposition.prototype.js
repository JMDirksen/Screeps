RoomPosition.prototype.lookForInDirection = function (direction, type) {
    return this.getPosInDirection(direction).lookFor(type)
}

RoomPosition.prototype.getPosInDirection = function (direction) {
    let rp = new RoomPosition(this.x, this.y, this.roomName)
    switch (direction) {
        case TOP:
            return rp.y -= 1, rp
        case TOP_RIGHT:
            return rp.x += 1, rp.y -= 1, rp
        case RIGHT:
            return rp.x += 1, rp
        case BOTTOM_RIGHT:
            return rp.x += 1, rp.y += 1, rp
        case BOTTOM:
            return rp.y += 1, rp
        case BOTTOM_LEFT:
            return rp.x -= 1, rp.y += 1, rp
        case LEFT:
            return rp.x -= 1, rp
        case TOP_LEFT:
            return rp.x -= 1, rp.y -= 1, rp
        default:
            return false
    }
}
