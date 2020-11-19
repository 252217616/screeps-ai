Game.rooms.sim.createConstructionSite(18, 24, STRUCTURE_EXTENSION);

if(Game.spawns['Spawn1'].room.createConstructionSite(21, 27, STRUCTURE_EXTENSION) == 0){
    Game.spawns['Spawn1'].room.createConstructionSite(22, 27, STRUCTURE_EXTENSION);
    Game.spawns['Spawn1'].room.createConstructionSite(23, 27, STRUCTURE_EXTENSION);
    Game.spawns['Spawn1'].room.createConstructionSite(24, 27, STRUCTURE_EXTENSION);
    Game.spawns['Spawn1'].room.createConstructionSite(26, 17, STRUCTURE_STORAGE);
}

if(!roleMap.has("harvester_outSide")  ||  roleMap.get("harvester_outSide") < 1) {
    var newName = 'Harvester' + Game.time;     
    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
    {memory: {role: 'harvester_outSide',workId:"5bbcad4a9099fc012e6370eb",x:34,y:3}});

}
let container = Game.getObjectById("5fafc93bf9b2ca0ffaa822b5");
if(container.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
    releaseTask(Game.getObjectById("5f984d130c842a3a5724fcf5"),"5fafc93bf9b2ca0ffaa822b5");
}

Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,{
    filter: (structure) => {
        return structure.structureType == STRUCTURE_TOWER;
    }
});

var rolePorter = {
    

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!roleMap.has("storageM")  ||  roleMap.get("storageM") < 1) {
            var newName = 'StorageM' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'storageManager'}});
        }
        if(creep.memory.role == 'storageManager') {
            roleStorageManager.run(creep);
        }

        if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    var tower1 = Game.getObjectById('5f95465f18ca8871044c3ecf');
    var tower2 = Game.getObjectById('5f9961c5597c15843fade54a');
    var towers = [tower1,tower2];
    for(let tower in towers){
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (object) => {
                return (object.structureType == STRUCTURE_CONTAINER 
                    || object.structureType == STRUCTURE_TOWER
                    || object.structureType == STRUCTURE_ROAD) &&
                    object.hits!=object.hitsMax;
            }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

        
        
        //是否工作状态  
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            //否 关闭工作状态 去装满自己
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            //是 开启工作状态 去检查 Spawn1 是否装满
        }

        if(creep.memory.building) {
            //装满自己
            var container = Game.getObjectById (creep.memory.workId) //桶站
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            //填满
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION 
                        || structure.structureType == STRUCTURE_SPAWN
                        || structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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


};
