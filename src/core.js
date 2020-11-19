/**
 * 房间运营
 */
var RoomManager = {

    /** @param {Creep} creep **/
    run: function(roomName) {
        
        

        //生产creep

        //检查建筑 发布任务

        //能量补充

        //能量运输 

        //link

        //tower

        //creep 执行任务

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(!creep.memory.building) {
            //就近寻找
            let target =Game.getObjectById("5fafc93bf9b2ca0ffaa822b5");
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){ //从目标拿取能量
                creep.moveTo(target);
            }
        } else {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = RoomManager;