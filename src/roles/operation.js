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

}
