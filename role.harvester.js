var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {    
        var sources = Game.getObjectById (creep.memory.workId)
        if(creep.pos.x == creep.memory.x &&creep.pos.y == creep.memory.y ){
            creep.harvest(sources)
        }else{
            creep.moveTo(creep.memory.x,creep.memory.y, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        if(creep.memory.x ==34){
            let link = Game.getObjectById("5f996614a5e90b7fdf7291ca");
            creep.transfer(link,RESOURCE_ENERGY);
        }
        if(creep.memory.x == 45){
            //发布运输任务
            let container = Game.getObjectById("5fb4a98e5f6efda67897fca9");
            creep.transfer(container,RESOURCE_ZYNTHIUM);
            if((!global.taskRecord.has(container.id) || !global.taskRecord.get(container.id)) && container.store.getUsedCapacity(RESOURCE_ZYNTHIUM)>=1000){
                taskList.push(
                    {
                        type:"withdraw",
                        withdrawId:container.id,
                        transferId:"5f984d130c842a3a5724fcf5",
                        sourceType : RESOURCE_ZYNTHIUM,
                        x:container.pos.x,
                        y:container.pos.y
                    });
                global.taskRecord.set(container.id,true);//防止重复发布任务
            }
        }
        // creep.drop(RESOURCE_ENERGY)

    }
};

module.exports = roleHarvester;