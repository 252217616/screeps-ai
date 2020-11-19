var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolePorter = require('role.porter');
var roleStorageManager = require('role.storageManager');

global.taskList = [];
global.taskRecord = new Map();
global.taskMap =  require('taskMap');
let buildMap = new Map();
buildMap.set("energy",[]);
buildMap.set("tower",[]);
buildMap.set("link",[]);


module.exports.loop = function () {

    //挂载原型

    //检查死亡creep

    //各房间运营


    // console.log(global.taskList.length)
    // for(let i in global.taskList){
    //     console.log(global.taskList[i].transferId)
    // }
    //发布任务
    /** @param {Structure} structure **/
    let releaseTask = function(structure,withdrawId){
       
        if((!global.taskRecord.has(structure.id) || !global.taskRecord.get(structure.id)) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 ){
            // console.log(structure.id+"发布任务 "+ structure.store.getFreeCapacity(RESOURCE_ENERGY) )
            global.taskList.push(
                {
                    type:"trans",
                    withdrawId:withdrawId,//仓库的id
                    transferId:structure.id,
                    sourceType : RESOURCE_ENERGY,
                    x:structure.pos.x,
                    y:structure.pos.y
                });
            global.taskRecord.set(structure.id,true);//防止重复发布任务
        }
    }

    //缓存一些数据
    //所有建筑
    if(buildMap.get("energy").length == 0){
        console.log("重新载入id")
        let ids =  Game.rooms["E6S41"].find(FIND_MY_STRUCTURES);
        for(let i in ids){
            let structure = ids[i];
             //补充能量任务
            if((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN )){
                buildMap.get("energy").push(structure.id);
            }
            if(structure.structureType == STRUCTURE_TOWER){
                buildMap.get("tower").push(structure.id);
            }
            if(structure.structureType == STRUCTURE_LINK){
                buildMap.get("link").push(structure.id);
            }
        }
    }

    let eneryContainer = Game.getObjectById("5fafc93bf9b2ca0ffaa822b5");
    if((!global.taskRecord.has(eneryContainer.id) || !global.taskRecord.get(eneryContainer.id)) && eneryContainer.store.getUsedCapacity(RESOURCE_ENERGY)>=1000){
        // console.log("eneryContainer 发布任务")
        global.taskList.push(
            {
                type:"withdraw",
                withdrawId:eneryContainer.id,
                transferId:"5f984d130c842a3a5724fcf5",
                sourceType : RESOURCE_ENERGY,
                x:eneryContainer.pos.x,
                y:eneryContainer.pos.y
            });
        global.taskRecord.set(eneryContainer.id,true);//防止重复发布任务
    }
    

    
   

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            // console.log('Clearing non-existing creep memory:', name);
        }
    }
    //建造队列
    let roleMap = new Map();
    var creeps = Game.creeps;
    for( let name in creeps){
        if(!roleMap.has(creeps[name].memory.role)){
            roleMap.set(creeps[name].memory.role,1);
        }else{
            roleMap.set(creeps[name].memory.role,roleMap.get(creeps[name].memory.role)+1);
        }
    }
    if(!roleMap.has("porter")  ||  roleMap.get("porter") < 2) {
        var newName = 'Porter' + Game.time;
        // console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([
            
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE
        ], newName,
            {memory: {role: 'porter'}});

    }else  if(!roleMap.has("harvester")  ||  roleMap.get("harvester") < 1) {
        var newName = 'Harvester' + Game.time;     
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], newName,
        {memory: {role: 'harvester',workId:"5bbcad4a9099fc012e6370ed",x:19,y:22}});

    }else  if(!roleMap.has("harvester_outSide")  ||  roleMap.get("harvester_outSide") < 1) {
        var newName = 'Harvester' + Game.time;     
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
        {memory: {role: 'harvester_outSide',workId:"5bbcad4a9099fc012e6370eb",x:34,y:3}});
    
    }else  if(!roleMap.has("storageManager")  ||  roleMap.get("storageManager") < 1) {
        var newName = 'StorageM' + Game.time;
        // console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE], newName,
            {memory: {role: 'storageManager'}});

    }else if(!roleMap.has("upgrader")  ||  roleMap.get("upgrader") < 2) {
        var newName = 'Upgrader' + Game.time;
        // console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});

    }
    //  else if(!roleMap.has("builder")  ||  roleMap.get("builder") < 0) {
    //     var newName = 'Builder' + Game.time;
    //     // console.log('Spawning new harvester: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
    //         {memory: {role: 'builder'}});
    // } 
    else if(!roleMap.has("harvester_M")  ||  roleMap.get("harvester_M") < 1) {
        var newName = 'harvester_M' + Game.time;
        // console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'harvester_M',workId:"5bbcb30540062e4259e93ff3",x:45,y:22}});
    }


   
    //建造中 发布补充能量任务
    if(Game.spawns["Spawn1"].spawning){
        let energys = buildMap.get("energy");
        for(let i in energys){
            //建筑发布任务
            let structure = Game.getObjectById(energys[i]);
            //补充能量任务
            if(structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                releaseTask(structure);
            }
            
        }
    }




    var towers =buildMap.get("tower");
    for(let i in towers){
        let tower = Game.getObjectById(towers[i]);
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
        //发布能量补充任务
        if(tower.store.getFreeCapacity(RESOURCE_ENERGY) > 150){
            releaseTask(tower);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    let clear = true;//任务做完
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role.startsWith('harvester') ) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'porter') {
            rolePorter.run(creep);
            if(creep.memory.tasking){
                clear = false;
            }
        }
        if(creep.memory.role == 'storageManager') {
            roleStorageManager.run(creep);
        }
    }
    let time = Game.time;

    //自动任务
    if(time%500 == 0){
        if(global.taskList.length == 0 && clear){
            console.log("任务全部完成，清除记录")
            global.taskRecord = new Map();
        }
        let energys = buildMap.get("energy");
        for(let i in energys){
            //建筑发布任务
            let structure = Game.getObjectById(energys[i]);
            //补充能量任务
            if(structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                releaseTask(structure);
            }
            
        }
    }

    
}