'use strict'

module.exports = function () {
    if (Game.time % 25) return
    const terminals = _.filter(Game.structures, { structureType: STRUCTURE_TERMINAL })
    for (const terminal of terminals) {
        const roomName = terminal.room.name
        const roomMineral = terminal.room.find(FIND_MINERALS)[0]
        const roomMineralType = roomMineral ? roomMineral.mineralType : null

        // Create sell order
        if (roomMineralType) {
            // Check if order not exists
            const existingOrder = _.filter(Game.market.orders, {
                roomName: roomName, type: 'sell', resourceType: roomMineralType
            })[0]
            //debug(`existingOrder: ${JSON.stringify(existingOrder)}`)
            if (!existingOrder) {
                let r = Game.market.createOrder({
                    type: ORDER_SELL,
                    resourceType: roomMineralType,
                    price: 1,
                    totalAmount: 1,
                    roomName: roomName
                })
                if (r == OK) info(`Sell order created`)
                else if (r == ERR_NOT_ENOUGH_RESOURCES) info(`Not enough credits to create order`)
                else info(`Create sell order failed: ${r}`)
            }
        }
    }
}
