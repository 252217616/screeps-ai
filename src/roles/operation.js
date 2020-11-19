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
            //规定了 x y 坐标的 准备阶段前往位置。
            if(creep.memory.x && creep.memory.y && creep.pos.x != creep.memory.x && creep.pos.y!= creep.memory.y){
                creep.goTo(RoomPosition.constructor(creep.memory.x,creep.memory.y,creep.room.name) , {reusePath: 20, ignoreCreeps: true});
                return false;
            }else{
                return true;
            }
        },
        // 因为 prepare 准备完之后会先执行 source 阶段，所以在这个阶段里对 container 进行维护
        source: creep => {
            creep.say('🚧')
            // 没有能量就进行采集，因为是维护阶段，所以允许采集一下工作一下
            if (creep.store[RESOURCE_ENERGY] <= 0) {
                creep.getEngryFrom(Game.getObjectById(data.sourceId))
                return false
            }
            
            // 获取 prepare 阶段中保存的 dropId 
            if(creep.memory.dropId){
                // 存在 container，把血量修满
                let target = Game.getObjectById<(creep.memory.dropId)
                if (target && target instanceof StructureContainer) {
                    creep.repair(target)
                    // 血修满了就正式进入采集阶段
                    return target.hits >= target.hitsMax
                }
            }

            // 存在 container，把血量修满
            if (target && target instanceof StructureContainer) {
                creep.repair(target)
                // 血修满了就正式进入采集阶段
                return target.hits >= target.hitsMax
            }
                // 还没找到，等下个 tick 会重新新建工地
                return false
        },
        // 采集阶段会无脑采集，过量的能量会掉在 container 上然后被接住存起来
        target: creep => {
            creep.getEngryFrom(Game.getObjectById(creep.memory.sourceId))
            // 快死了就把身上的能量丢出去，这样就会存到下面的 container 里，否则变成墓碑后能量无法被 container 自动回收
            if (creep.ticksToLive < 2) creep.drop(RESOURCE_ENERGY)
            return false
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
            const result = creep.getEngryFrom(source)
            // 但如果是 Container 或者 Link 里获取能量的话，就不会重新运行规划
            // if (
            //     (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_INVALID_TARGET) &&
            //     (source instanceof StructureTerminal || source instanceof StructureStorage)
            // ) {
            //     // 如果发现能量来源（建筑）里没有能量了，就自杀并重新运行 upgrader 发布规划
            //     creep.room.releaseCreep('upgrader')
            //     creep.suicide()
            // }
        },
        target: creep => {
            if (creep.upgrade() === ERR_NOT_ENOUGH_RESOURCES) return true
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
            // 房间中的矿床是否还有剩余产量
            if (room.mineral.mineralAmount <= 0) {
                room.memory.mineralCooldown = Game.time + MINERAL_REGEN_TIME
                return false
            }

            // 再检查下终端存储是否已经太多了, 如果太多了就休眠一段时间再出来看看
            if (!room.terminal || room.terminal.store.getUsedCapacity() >= minerHervesteLimit) {
                room.memory.mineralCooldown = Game.time + 10000
                return false
            }
            
            return true
        },
        prepare: creep => {
            creep.goTo(creep.room.mineral.pos)

            // 如果移动到了就准备完成并保存移动时间
            if (creep.pos.isNearTo(creep.room.mineral.pos)) {
                creep.memory.travelTime = CREEP_LIFE_TIME - creep.ticksToLive
                return true
            }

            return false
        },
        source: creep => {
            if (creep.ticksToLive <= creep.memory.travelTime + 30) return true
            else if (creep.store.getFreeCapacity() === 0) return true

            // 采矿
            const harvestResult = creep.harvest(creep.room.mineral)

            
            if (harvestResult === ERR_NOT_IN_RANGE) creep.goTo(creep.room.mineral.pos)
        },
        target: creep => {
            if(creep.memory.dropId){
                creep.transfer(Game.getObjectById(creep.memory.dropId),creep.memory,sourceType);
            }
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
        // 工地都建完就就使命完成
        isNeed: room => {
            const targets = room.find(FIND_MY_CONSTRUCTION_SITES)
            return targets.length > 0 ? true : false
        },
        // 把 data 里的 sourceId 挪到外边方便修改
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
        bodys: 'worker'
    },

}
