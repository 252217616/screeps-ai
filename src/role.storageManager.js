var roleStorageManager = {

    /** @param {Creep} creep **/
    run: function(creep) {    
        
        
        let link = Game.getObjectById("5f996614a5e90b7fdf7291ca");
        if(link.store.getFreeCapacity(RESOURCE_ENERGY)<100){
            link.transferEnergy(Game.getObjectById("5f996e78adf5162a0c4642ea"));
        }
        let controllerLink = Game.getObjectById("5fa39211301d3842112d39a7");
        
        //是否工作状态  
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            //否 关闭工作状态 去装满自己
        }
        if(!creep.memory.working && creep.store.getUsedCapacity() != 0) {
            creep.memory.working = true;
            //是 开启工作状态 去检查 Spawn1 是否装满
        }
       let linkFlag = false;
        if(controllerLink.store.getFreeCapacity(RESOURCE_ENERGY)<700){
            //运送
            linkFlag = true;
        }

        if(!creep.memory.working) {
            //装满自己
            let link ;
            if(!linkFlag){
                link = Game.getObjectById("5f984d130c842a3a5724fcf5");
            }else{
                link = Game.getObjectById("5f996e78adf5162a0c4642ea");
            }
            if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(link);
            }
        } else {
            if(!linkFlag){
                let storage = Game.getObjectById("5f996e78adf5162a0c4642ea");
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                storage.transferEnergy(Game.getObjectById("5fa39211301d3842112d39a7"));

            }else{
                let storage = Game.getObjectById("5f984d130c842a3a5724fcf5");
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            
        }
    }
}
module.exports = roleStorageManager;
