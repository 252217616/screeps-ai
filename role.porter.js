var rolePorter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let tasks = global.taskList;    
        if(!creep.memory.tasking){ //没有进行任务     
            if(tasks.length >0){//有任务
                let min = {
                    index :0,
                    distance:100
                };
                for(let i = 0;i<tasks.length;i++){
                    let taskInfo = tasks[i];
                    let distance = Math.abs(creep.pos.x-taskInfo.x)+Math.abs(creep.pos.y-taskInfo.y);
                    if(distance == 1){
                        min.index = i;
                        break;
                    }else{
                        min = min.distance>distance?{index:i,distance:distance}:min;
                    }
                }
                let taskInfo = tasks[min.index];
                tasks.splice(min.index,1);
                creep.memory.tasking = true;
                creep.memory.task_type = taskInfo.type;
                creep.memory.task_withdrawId = taskInfo.withdrawId;
                creep.memory.task_transferId = taskInfo.transferId;
                creep.memory.task_sourceType = taskInfo.sourceType;
            }else{
                 //没有任务 帮助升级
                 let target =Game.getObjectById("5f984d130c842a3a5724fcf5");
                    if(creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){ //从目标拿取能量
                        creep.moveTo(target);
                    }
                 
            }
        }
        if(creep.memory.tasking) { //任务进行中
            global.taskMap.get(creep.memory.task_type)(creep,creep.memory.task_withdrawId,creep.memory.task_transferId,creep.memory.task_sourceType);
        }
       
    }
}
module.exports = rolePorter;
