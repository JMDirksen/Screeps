'use strict'

module.exports = function () {
    if (Game.time % 25) return
    const terminals = _.filter(Game.structures, { structureType: STRUCTURE_TERMINAL })
    for (const terminal of terminals) {
        const roomName = terminal.room.name
        const roomMineral = terminal.room.find(FIND_MINERALS)[0]
        const roomMineralType = roomMineral ? roomMineral.mineralType : null
        const roomMineralAmount = terminal.store.getUsedCapacity(roomMineralType)

        // Sell roomMineralType to buy order
        if (roomMineralType && roomMineralAmount > 500) {
            const buyOrder = _.sortByOrder(Game.market.getAllOrders({
                type: ORDER_BUY, resourceType: roomMineralType
            }), ['price'], ['desc'])[0]
            if (buyOrder) {
                const amount = Math.min(buyOrder.amount, terminal.store.getUsedCapacity(roomMineralType))
                const cost = Game.market.calcTransactionCost(amount, roomName, buyOrder.roomName)
                let r = Game.market.deal(buyOrder.id, amount, roomName)
                if (r == OK) info(`Sold to buy order`)
                else if (r == ERR_NOT_ENOUGH_RESOURCES) info(`Not enough resources to sell (cost: ${cost})`)
                else info(`Sell to buy order failed: ${r} deal(${buyOrder.id}, ${amount}, ${roomName})`)
            }
        }

    }
}
