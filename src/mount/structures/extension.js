/**
 * Extension 原型拓展
 */
const extension = {
    /**  
     * extension 主要工作
     * @todo 能量不足时发送物流任务
     */
    work() {
        if(this.store.getUsedCapacity(RESOURCE_ENERGY)>0){
            this.room.pushTransTask(this,this.id);
        }
    }
}




module.exports = function () {
    _.assign(StructureExtension.prototype, extension)
}

