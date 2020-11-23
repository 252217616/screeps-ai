/**
 * room 原型拓展
 */
const RoomExtension = {
    /**  
     * 发布任务
     * @param {Structure} structure 
     * @todo 能量不足时挂起任务
     */
    pushTransTask(structure,transId,withdrawId = undefined,sourceType = RESOURCE_ENERGY) {
        if( this.memory[structure.id]){
            this.memory.taskList.push(
                {
                    taskId     : structure.id,
                    transferId : transId,
                    withdrawId : withdrawId,
                    sourceType : sourceType,
                    x:structure.pos.x,
                    y:structure.pos.y
                });
                this.memory[structure.id] = true//防止重复发布任务
        }
       
    },
    registerCenterLink(linkId){
        this.memory.centerLink = linkId;
    },
    registerControllerLink(linkId){
        this.memory.controllerLink = linkId;
    }
    
}




module.exports = function () {
    _.assign(Room.prototype, RoomExtension)
}

