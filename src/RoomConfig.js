/**
 * 房间运维相关角色
 */

const roomConfig = {
    E6S41:{
        porter:{
            bodys:{ [WORK]: 0, [CARRY]: 20, [MOVE]: 10 },
            amount:2,
            memory: {memory: {role: 'porter'}}
        },
        harvester:{
            bodys:{ [WORK]: 5, [CARRY]: 1, [MOVE]: 3 },
            amount:1,
            memory: {memory: {role: 'harvester',sourceId:"5bbcad4a9099fc012e6370ed",dropId:"5fb7df771b8bb4445307fbc4"}}
        },
        harvester_out:{
            bodys:{ [WORK]: 5, [CARRY]: 1, [MOVE]: 3 },
            amount:1,
            memory: {memory: {role: 'harvester',sourceId:"5bbcad4a9099fc012e6370eb",dropId:"5f996614a5e90b7fdf7291ca"}}
        },
        storageManager:{
            bodys:{ [WORK]: 0, [CARRY]: 8, [MOVE]: 1 },
            amount:1,
            memory: {memory: {role: 'storageManager'}}
        },
        upgrader:{
            bodys:{ [WORK]: 7, [CARRY]: 1, [MOVE]: 1 },
            amount:2,
            memory: {memory: {role: 'upgrader'}}
        },
        builder:{
            bodys:{ [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
            amount:2,
            memory: {memory: {role: 'builder'}}
        }

   }

}
export default roomConfig