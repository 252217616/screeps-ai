/**
 * Creep原型拓展
 */
const creepExtension = {
    //基础执行
    work(){
        //获取能量
        //执行任务
    },

    // 自定义敌人检测
    checkEnemy() { 
        // 代码实现...
    },
    // 填充所有 spawn 和 extension
    fillSpawnEngry() { 
        // 代码实现...
    },
    // 填充所有 tower
    fillTower() {
        // 代码实现...
    },
    // 其他更多自定义拓展
}




module.exports = function () {
    _.assign(Creep.prototype, creepExtension)
}