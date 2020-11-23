var mountWork = require('./mount');
var utils = require('./utils');

//房间数据

module.exports.loop = function () {

    //挂载原型
    mountWork();
    //检查死亡creep
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            //在creep 数量中减少;
            let creep = Memory.creeps[name];
            let roleMap = global.myRooms.get(creep.room.name);
            roleMap.set(creep.memory.role,roleMap.get(creep.memory.role)-1);
            delete Memory.creeps[name];
            // console.log('Clearing non-existing creep memory:', name);
        }
    }
    //各房间运营
    utils.doing(Game.structures,Game.creeps);
}