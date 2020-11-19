import roles from '../../roles/operation'
/**
 * Creep原型拓展
 */
const creepExtension = {
    //基础执行
    work(){
        // 检查 creep 内存中的角色是否存在
        if (!(this.memory.role in roles)) {
        this.log(`找不到对应的 creepConfig`, 'yellow')
        this.say('我凉了！')
        return
        }

        // 还没出生就啥都不干
        if (this.spawning) {
            if (this.ticksToLive === CREEP_LIFE_TIME) this._id = this.id // 解决 this creep not exist 问题
            return
        }

        // 快死时的处理
        if (this.ticksToLive <= 3) {
            // 如果还在工作，就释放掉自己的工作位置
        }

        // 获取对应配置项
        const creepConfig = roles[this.memory.role];

        // 没准备的时候就执行准备阶段
        if (!this.memory.ready) {
            // 有准备阶段配置则执行
            if (creepConfig.prepare) this.memory.ready = creepConfig.prepare(this)
            // 没有就直接准备完成
            else this.memory.ready = true
        }

        //　如果执行了 prepare 还没有 ready，就返回等下个 tick 再执行
        if (!this.memory.ready) return 

        // 获取是否工作，没有 source 的话直接执行 target
        const working = creepConfig.source ? this.memory.working : true

        let stateChange = false
        // 执行对应阶段
        // 阶段执行结果返回 true 就说明需要更换 working 状态
        if (working) {
            if (creepConfig.target && creepConfig.target(this)) stateChange = true
        }
        else {
            if (creepConfig.source && creepConfig.source(this)) stateChange = true
        }

        // 状态变化了就释放工作位置
        if (stateChange) {
            this.memory.working = !this.memory.working
        }
    },

    /**
     * 从目标结构获取能量
     * 
     * @param target 提供能量的结构
     * @returns 执行 harvest 或 withdraw 后的返回值
     */
     getEngryFrom(target)  {
        let result;
        // 是建筑就用 withdraw
        if (target instanceof Structure) result = this.withdraw(target, RESOURCE_ENERGY)
        // 不是的话就用 harvest
        else {
            result = this.harvest(target)         
        }

        if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos)

        return result
    },

    /**
     * 无视 Creep 的寻路
     * 
     * @param target 要移动到的位置
     */
    goTo(target) {
        // const baseCost = Game.cpu.getUsed()
        const moveResult = this.moveTo(target, {
            reusePath: 20,
            ignoreCreeps: true,
           })
        return moveResult
    },
    upgrade() {
        const result = this.upgradeController(this.room.controller)

        // 如果刚开始站定工作，就把自己的位置设置为禁止通行点

        if (result == ERR_NOT_IN_RANGE) {
            this.goTo(this.room.controller.pos)
        }
        return result
    },
     /**
     * 稳定新墙
     * 会把内存中 fillWallId 标注的墙声明值刷到定值以上
     */
    steadyWall() {
        const wall = Game.getObjectById(this.memory.fillWallId)
        if (!wall) return ERR_NOT_FOUND

        if (wall.hits < minWallHits) {
            const result = this.repair(wall)
            if (result == ERR_NOT_IN_RANGE) this.goTo(wall.pos)
        }
        else delete this.memory.fillWallId

        return OK
    },
     /**
     * 建设房间内存在的建筑工地
     */
    buildStructure() {
        // 新建目标建筑工地
        let target = undefined
        // 检查是否有缓存
        if (this.room.memory.constructionSiteId) {
            target = Game.getObjectById(this.room.memory.constructionSiteId)
            // 如果缓存中的工地不存在则说明建筑完成
            if (!target) {
                // 获取曾经工地的位置
                const constructionSitePos = new RoomPosition(this.room.memory.constructionSitePos[0], this.room.memory.constructionSitePos[1], this.room.name)
                // 检查上面是否有已经造好的同类型建筑
                const structure = _.find(constructionSitePos.lookFor(LOOK_STRUCTURES), s => s.structureType === this.room.memory.constructionSiteType)
                if (structure) {
                    // 如果刚修好的是墙的话就记住该墙的 id，然后把血量刷高一点（相关逻辑见 builder.target()）
                    if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
                        this.memory.fillWallId = structure.id
                    }
                   
                }

                // 获取下个建筑目标
                target = this._updateConstructionSite()   
            }
        }
        // 没缓存就直接获取
        else target = this._updateConstructionSite()
        if (!target) return ERR_NOT_FOUND
        
        // 建设
        const buildResult = this.build(target)
        if (buildResult == OK) {
            // 如果修好的是 rempart 的话就移除墙壁缓存
            // 让维修单位可以快速发现新 rempart
            if (target.structureType == STRUCTURE_RAMPART) delete this.room.memory.focusWall
        }
        else if (buildResult == ERR_NOT_IN_RANGE) this.goTo(target.pos)
        return buildResult
    },
     /**
     * 获取下一个建筑工地
     * 有的话将其 id 写入自己 memory.constructionSiteId
     * 
     * @returns 下一个建筑工地，或者 null
     */
    _updateConstructionSite() {
        const targets = this.room.find(FIND_MY_CONSTRUCTION_SITES)
        if (targets.length > 0) {
            let target
            // 优先建造 spawn，然后是 extension，想添加新的优先级就在下面的数组里追加即可
            for (const type of [ STRUCTURE_SPAWN, STRUCTURE_EXTENSION ]) {
                target = targets.find(cs => cs.structureType === type)
                if (target) break
            }
            // 优先建造的都完成了，按照距离建造
            if (!target) target = this.pos.findClosestByRange(targets)

            // 缓存工地信息，用于统一建造并在之后验证是否完成建造
            this.room.memory.constructionSiteId = target.id
            this.room.memory.constructionSiteType = target.structureType
            this.room.memory.constructionSitePos = [ target.pos.x, target.pos.y ]
            return target
        }
        else {
            delete this.room.memory.constructionSiteId
            delete this.room.memory.constructionSiteType
            delete this.room.memory.constructionSitePos
            return undefined
        }
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