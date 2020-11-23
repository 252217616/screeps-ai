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
        if (this.spawning) {
            /**
             * 如果孵化已经开始了，就向物流队列推送任务
             * 不在 mySpawnCreep 返回 OK 时判断是因为：
             * 由于孵化是在 tick 末的行动执行阶段进行的，所以能量在 tick 末期才会从 extension 中扣除
             * 如果返回 OK 就推送任务的话，就会出现任务已经存在了，而 extension 还是满的
             * 而 creep 恰好就是在这段时间里执行的物流任务，就会出现如下错误逻辑：
             * mySpawnCreep 返回 OK > 推送填充任务 > creep 执行任务 > 发现能量都是满的 > **移除任务** > tick 末期开始孵化 > extension 扣除能量
             */
           
            if( this.room.memory[this.id] && this.store[RESOURCE_ENERGY] != 300){
                    global.taskListMap[this.room.name].push(
                        {
                            task_id:this.id,
                            transferId:this.id,
                            sourceType : RESOURCE_ENERGY,
                            x:this.pos.x,
                            y:this.pos.y
                        });
                        this.room.memory[this.id] = true//防止重复发布任务
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

