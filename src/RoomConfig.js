const RoomConfig = {
    E6S41:{
        role:{
            porter:{
                bodys:[
            
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE
                ],
                memory: {memory: {role: 'porter'}}
            },
            harvester:{
                bodys:[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE],
                memory:{memory: {role: 'harvester',sourceId:"5bbcad4a9099fc012e6370ed",dropId:"5fafc93bf9b2ca0ffaa822b5"}}
            },
            harvester_outSide:{
                bodys:[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE],
                memory:{memory: {role: 'harvester',sourceId:"5bbcad4a9099fc012e6370eb",dropId:"5f996614a5e90b7fdf7291ca"}}
            }
        }
    }

}


module.exports =  RoomConfig;