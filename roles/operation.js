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
                creep.moveTo(creep.memory.x,creep.memory.y, {reusePath: 20, ignoreCreeps: true});
                return false;
            }else{
                return true;
            }
        }
    }
}
