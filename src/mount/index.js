import mountCreep from './creep/creepExtension'
import mountExtension from './structures/extension'
import mountRoom from './structures/room'
import mountSpawn from './structures/spawn'
import mountTower from './structures/tower'

/**
 * 挂载所有的属性和方法
 */
export default function () {
    if (!global.hasExtension) {
        console.log('[mount] 重新挂载拓展')

        // 存储的兜底工作
        initStorage()

        // 挂载全部拓展
        mountExtension()
        mountRoom()
        mountSpawn()
        mountTower()
        mountCreep()
        global.hasExtension = true
    }
}

function initStorage(){

    if (!Memory.rooms) Memory.rooms = {}
    else delete Memory.rooms.undefined

    let creeps = Game.creeps;
    //装载creep角色数量 //todo 无限增加
    for( let name in creeps){
        let room = creeps[name].room;
        if(room.memory.taskList === undefined) room.memory.taskList = [];
        let rolenum = room.memory[creeps[name].memory.role];
        if(rolenum){
            room.memory[creeps[name].memory.role] = rolenum+1;
        }else{
            room.memory[creeps[name].memory.role] = 1;
        }
    }
}