/**
 * Extension 原型拓展
 */
const extension = {
    /**  
     * extension 主要工作
     * @todo 能量不足时发送物流任务
     */
    work() {
        if( this.room.memory[this.id] && this.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
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
    }
}




module.exports = function () {
    _.assign(StructureExtension.prototype, extension)
}

