var rolePorterTrans = {

    /** @param {Creep} creep **/
    run: function(creep) {          
        //是否工作状态  
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            //否 关闭工作状态 去装满自己
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            //是 开启工作状态 去检查 Spawn1 是否装满
        }
        let isOut = false;
        if(!creep.memory.working) {
            //装满自己
            var container = Game.getObjectById ("5f95229ada8b162fd06292bb")//内部桶站
            if(container.store[RESOURCE_ENERGY] <= creep.getFreeCapacity()){
                container = Game.getObjectById ("5f953d250cf4fa9a0a22b5b6") //外部桶站
                isOut = true;
            }
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            //填满tower.pos.findClosestByRange
            var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                var towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.storegetFreeCapacity;
                    }
                });
                if(towers) {
                    if(creep.transfer(towers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                    if(isOut){
                        //给内部仓库传输
                        if(creep.transfer(insideContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(insideContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }else{
                        //帮助建造
                        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                        if(targets.length > 0) {
                            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }else{
                            //没有需要转移的 帮助升级
                            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }
                    }
                   
                }
                
                // var hits = creep.room.find(FIND_STRUCTURES, {
                //     filter: (object) => {
                //         return (object.structureType == STRUCTURE_CONTAINER 
                //             || object.structureType == STRUCTURE_TOWER) &&
                //             object.hits!=object.hitsMax;
                //     }
                // });
                // console.log(hits.length)
                // if(hits.length >0 ){
                //     if(creep.repair(hits[0]) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(hits[0]);
                //     }
                // }
                
            }
        }
    },
    packFull:function(creep){
        //装满自己
        if(creep.store.getUsedCapacity()==0){
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:object=>object.structureType == STRUCTURE_CONTAINER});
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }    
    }
}
module.exports = rolePorter;
