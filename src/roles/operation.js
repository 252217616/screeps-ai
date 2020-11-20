/**
 * 房间运维相关角色
 */

const roles = {
    /**
     * 采集资源
     */
    harvester:{
        //准备阶段
        /** @param {Creep} creep **/
        prepare:creep=>{
            //准备阶段前往 能量源
            if(creep.memory.sourceId){
                let source = game.getObjectById(creep.memory.sourceId);
                creep.goTo(source);
                if(creep.isNearTo(source)){
                    return true;
                }
            }else{
                return true;
            }
        },
        // 因为 prepare 准备完之后会先执行 source 阶段，所以在这个阶段里对 container 进行维护
        source: creep => {
            return true
        },
        // 采集阶段会无脑采集，过量的能量会掉在 container 上然后被接住存起来
        target: creep => {
            let result = creep.getEngryFrom(Game.getObjectById(creep.memory.sourceId))
            if(result == OK){
                let drop = Game.getObjectById(creep.memory.dropId);
                creep.transfer(drop,RESOURCE_ENERGY);
            }
            return false
        },
        //快死时做的事情
        destroy:creep =>{
            if(creep.ticksToLive<=3){
                let drop = Game.getObjectById(creep.memory.dropId);
                creep.transfer(drop,RESOURCE_ENERGY);
                return false;
            }
            return true;

        },
        bodys: 'harvester'
    },
     /**
     * 升级者
     * 不会采集能量，只会从指定目标获取能量
     * 从指定建筑中获取能量 > 升级 controller
     */
    upgrader:  {
        prepare:creep=>{
            
           return true;
        },
        source: creep => {
            // 因为只会从建筑里拿，所以只要拿到了就去升级
            if (creep.store[RESOURCE_ENERGY] > 0) return true

            const source =  Game.getObjectById(creep.memory.sourceId)

            // 如果来源是 container 的话就等到其中能量大于指定数量再拿（优先满足 filler 的能量需求）
            if (source && source.structureType === STRUCTURE_CONTAINER && source.store[RESOURCE_ENERGY] <= 500) return false

            // 获取能量
             creep.getEngryFrom(source)
            
        },
        target: creep => {
            if (creep.upgrade() === ERR_NOT_ENOUGH_RESOURCES) return true
        },
        //快死时做的事情
        destroy:creep =>{
            if(creep.ticksToLive<=3){
                const source =  Game.getObjectById(creep.memory.sourceId)
                creep.transfer(source,RESOURCE_ENERGY);
                return false;
            }
            return true;
            
        },
        bodys: 'upgrader'
    },
     /**
     * 矿工
     * 从房间的 mineral 中获取资源 > 将资源转移到指定建筑中(默认为 terminal)
     */
    miner:{
        // 检查矿床里是不是还有矿
        isNeed: room => {
            return true;
        },
        prepare: creep => {
           //准备阶段前往 能量源
           if(creep.memory.sourceId){
            let source = game.getObjectById(creep.memory.sourceId);
            creep.goTo(source);
            if(creep.isNearTo(source)){
                return true;
            }
        }else{
            return true;
        }
        },
        source: creep => {
            creep.getEngryFrom(Game.getObjectById(creep.memory.sourceId))
            let drop = Game.getObjectById(creep.memory.dropId);
            creep.transfer(drop,creep.memory.sourceType);
          
            return false
        },
        target: creep => {
            if(creep.memory.dropId){
                creep.transfer(Game.getObjectById(creep.memory.dropId),creep.memory.sourceType);
            }
        },
         //快死时做的事情
         destroy:creep =>{
             if(creep.ticksToLive<=3){
                let drop = Game.getObjectById(creep.memory.dropId);
                creep.transfer(drop,creep.memory.sourceType);
                return false;
             }
             return true;
            
        },
        bodys: 'worker'
    },
        /**
     * 建筑者
     * 只有在有工地时才会生成
     * 从指定结构中获取能量 > 查找建筑工地并建造
     * 
     * @param spawnRoom 出生房间名称
     * @param sourceId 要挖的矿 id
     */
    builder: {
        // 前往工地
        prepare: creep => {
            
            return true
        },
        // 根据 sourceId 对应的能量来源里的剩余能量来自动选择新的能量来源
        source: creep => {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true

            // 从仓库获取能量
            if (creep.getEngryFrom(creep.room.storage) === ERR_FULL ) {
                return true;
            }
        },
        target: creep => {
            // 有新墙就先刷新墙
            if (creep.memory.fillWallId) creep.steadyWall()
            // 没有就建其他工地
            else if (creep.buildStructure() !== ERR_NOT_FOUND) { }
            // 工地也没了就去升级
            else if (creep.upgrade()) { }

            if (creep.store.getUsedCapacity() === 0) return true
        },
        destroy:creep =>{
            //把能量放回
            if(creep.ticksToLive<=30){
                if(creep.transfer(creep.room.storage,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.goTo(creep.room.storage.pos)
                }
                return false;
            }
            return true;
           
       },
        bodys: 'worker'
    },
    /**
     * 运输者
     */
    porter: {
        // 接受任务
        prepare: creep => {
            let tasks = global.taskListMap[creep.room.name];    
            if(!creep.memory.tasking && tasks.length!=0){
                //找到任务最近的
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
                creep.memory.task_id = taskInfo.id;
                creep.memory.task_withdrawId = taskInfo.withdrawId;
                creep.memory.task_transferId = taskInfo.transferId;
                creep.memory.task_sourceType = taskInfo.sourceType;
            }
            return true
        },
        // 根据 sourceId 对应的能量来源里的剩余能量来自动选择新的能量来源
        source: creep => {
            if(creep.memory.tasking){
                let target = Game.getObjectById(creep.memory.task_withdrawId);
                let result = creep.withdraw(target,creep.memory.task_sourceType);
                if(result === ERR_NOT_IN_RANGE){ //从目标拿取能量
                    creep.goTo(target.pos);  
                }
                if(result === ERR_FULL){
                    return true;
                }
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true
            }else{
                //没任务就放回仓库
                if(creep.room.storage){
                    if(creep.transfer(creep.room.storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){ //从目标拿取能量
                        creep.goTo(creep.room.storage);
                    }
                }
                return false;
            }
            
        },
        target: creep => {
            if(creep.memory.tasking){
                let target = Game.getObjectById(creep.memory.task_transferId);
                //运输能量
                if(creep.transfer(target,sourceType) == ERR_NOT_IN_RANGE){ //给能量
                    creep.goTo(target.pos);
                    return false;
                }else{
                    creep.memory.tasking = false;
                    global.taskRecord.get(creep.room.name).set(creep.memory.task_id,false);
                    delete creep.memory.task_withdrawId;
                    delete creep.memory.task_transferId;
                    delete creep.memory.task_sourceType;
                    delete creep.memory.task_id;     
                    return true;
                }
            }
        },
        destroy:creep =>{
            //把能量放回
            if(creep.ticksToLive<=30 && creep.room.storage){
                if(creep.transfer(creep.room.storage,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.goTo(creep.room.storage.pos)
                }
                return false;
            }
            return true;
           
       },
        bodys: 'worker'
    }

}
