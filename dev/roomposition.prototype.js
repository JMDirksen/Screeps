RoomPosition.prototype.lookInDirection = function (direction) {
    switch (direction) {
        case TOP:
            return this.y -= 1, this.look()
        case TOP_RIGHT:
            return this.x += 1, this.y -= 1, this.look()
        case RIGHT:
            return this.x += 1, this.look()
        case BOTTOM_RIGHT:
            return this.x += 1, this.y += 1, this.look()
        case BOTTOM:
            return this.y += 1, this.look()
        case BOTTOM_LEFT:
            return this.x -= 1, this.y += 1, this.look()
        case LEFT:
            return this.x -= 1, this.look()
        case TOP_LEFT:
            return this.x -= 1, this.y -= 1, this.look()
        default:
            return false
    }
}

RoomPosition.prototype.lookForInDirection = function (direction, type) {
    switch (direction) {
        case TOP:
            return this.y -= 1, this.lookFor(type)
        case TOP_RIGHT:
            return this.x += 1, this.y -= 1, this.lookFor(type)
        case RIGHT:
            return this.x += 1, this.lookFor(type)
        case BOTTOM_RIGHT:
            return this.x += 1, this.y += 1, this.lookFor(type)
        case BOTTOM:
            return this.y += 1, this.lookFor(type)
        case BOTTOM_LEFT:
            return this.x -= 1, this.y += 1, this.lookFor(type)
        case LEFT:
            return this.x -= 1, this.lookFor(type)
        case TOP_LEFT:
            return this.x -= 1, this.y -= 1, this.lookFor(type)
        default:
            return false
    }
}
