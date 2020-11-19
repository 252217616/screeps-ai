var taskMap = new Map();


/** @param {Creep} creep **/
var transTask = function (creep,withdrawId,transferId,sourceType){//接收运输任务，从withDrawId 运输到transFerId 
    // console.log( creep.name+"正在执行任务"+ creep.memory.working);
    if(creep.memory.working && creep.store[sourceType] == 0) {
        creep.memory.working = false;//装满自己
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;//运输
    }

    if(!creep.memory.working) {
        //拿取能量
        takeSources(creep,withdrawId,sourceType)
    } else {
        let target = Game.getObjectById(transferId);
        //运输能量
        if(creep.transfer(target,sourceType) == ERR_NOT_IN_RANGE){ //给能量
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            creep.memory.tasking = false;
            creep.memory.task_type = undefined;
            creep.memory.task_withdrawId = undefined;
            creep.memory.task_transferId = undefined;
            creep.memory.task_sourceType = undefined;
            global.taskRecord.set(transferId,false);
        }
    }    
}

/** @param {Creep} creep **/
var withdrawTask = function (creep,withdrawId,transferId,sourceType){//接收运输任务，从withDrawId 运输到transFerId 
    // console.log( creep.name+"正在执行任务"+ creep.memory.working);
    if(creep.memory.working && creep.store[sourceType] == 0) {
        creep.memory.working = false;//装满自己
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;//运输
    }

    if(!creep.memory.working) {
        //拿取能量
        takeSources(creep,withdrawId,sourceType)
    } else {
        let target = Game.getObjectById(transferId);
        //运输能量
        if(creep.transfer(target,sourceType) == ERR_NOT_IN_RANGE){ //给能量
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            creep.memory.tasking = false;
            creep.memory.task_type = undefined;
            creep.memory.task_withdrawId = undefined;
            creep.memory.task_transferId = undefined;
            creep.memory.task_sourceType = undefined;
            global.taskRecord.set(withdrawId,false);
        }
    }    
}


/** @param {Creep} creep **/
var takeSources = function(creep,id,sourceType){
    // 拿取能量
    let targetId = "5f984d130c842a3a5724fcf5" ;
    let target = id == undefined? Game.getObjectById(targetId): Game.getObjectById(id);
    if(creep.withdraw(target,sourceType) == ERR_NOT_IN_RANGE){ //从目标拿取能量
        creep.moveTo(target);  
    }
       
    
    
}

taskMap.set( "trans" , transTask);
taskMap.set( "withdraw" , withdrawTask);

module.exports =taskMap