/**
 * Tower 原型拓展
 */
const TowerExtension = {
    /**  
     * spawn 主要工作
     * @todo 能量不足时挂起任务
     */
    work() {
        //攻击
        if(!this.room.memory.attackId){
            const closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                this.attack(closestHostile);
                this.room.memory.attackId = closestHostile.id;
            }
        }else {
            let target = Game.getObjectById(this.room.memory.attackId);
            if(target){
                this.attack(closestHostile);
            }else{
                delete this.room.memory.attackId;
            }
        }
        //维修
        if(!this.room.memory.repairId){
            //没有缓存
            const damagedStructures = this.room.find(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax &&
                    // 墙壁稍后会单独修
                    s.structureType != STRUCTURE_RAMPART &&
                    s.structureType != STRUCTURE_WALL 
            })
            if(damagedStructures.length>0){
                let target = this.pos.findClosestByRange(damagedStructures);
                this.room.memory.repairId = target.id;
                tower.repair(target);
            }else{
               delete this.room.memory.repairId; 
            }
        }else {
            let target = Game.getObjectById(this.room.memory.repairId);
            if(target.hits < target.hitsMax){
                tower.repair(target);
            }else {
                delete this.room.memory.repairId; 
            }
        }
        //发布能量补充任务
        if(this.store.getFreeCapacity(RESOURCE_ENERGY) > 500){
            this.room.pushTransTask(this,this.id);
        }
    }
}




module.exports = function () {
    _.assign(StructureTower.prototype, TowerExtension)
}

