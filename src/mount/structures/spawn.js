import roomConfig from '../../roomConfig'
/**
 * Spawn 原型拓展
 */
const SpawnExtension = {
    /**  
     * spawn 主要工作
     * @todo 能量不足时挂起任务
     */
    work() {
        if (this.spawning  ) {
            if(this.store.getUsedCapacity(RESOURCE_ENERGY)>0){
                this.room.pushTransTask(this,this.id)
            }
                // if (
                //     // 非战争状态下直接发布 power 填 extension 任务
                //     !this.room.memory.war ||
                //     // 战争模式时，剩余能量掉至 50% 以下再发布 power 任务，防止 power 效果被浪费
                //     (this.room.energyAvailable / this.room.energyCapacityAvailable <= 0.5)
                // ) this.room.addPowerTask(PWR_OPERATE_EXTENSION, 1)
            return
        } else {
            //非生产中
            //检查数量
            for( role in roomConfig){
                if(this.room.memory[role] != roomConfig[role].amount){
                    //生产
                    let result = this.spawnCreep(roomConfig[role].bodys,role+Game.time,roomConfig[role].memory);
                    if(result === OK){
                        //生产成功 增加数量
                        this.room.memory[role] = this.room.memory[role]+1;
                    }
                    break;
                }
            }
            

        }
       
    }
}




module.exports = function () {
    _.assign(StructureSpawn.prototype, SpawnExtension)
}

