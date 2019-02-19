import { stageName } from '../MainChat/Utils';

export function getTitle(roomState) {
    // console.log("getSubtitle");
    if (roomState.status === 'waiting') {
        return `Phòng chờ`
    } else {
        return `${stageName[roomState.dayStage]}`
    }
}
export function getSubtitle(data, userRole, roomID, userAlive, roleTxt) {
    // console.log("getSubtitle");
    if (data.state.status === 'waiting') {
        return `Phòng ${roomID}`;
    } else {
        switch (data.state.dayStage) {
            case 'readyToGame':
                return `Ngẫu nhiên vai trò...`
            case 'cupid':
                if (userRole == 7) {
                    return `Ghép cặp 2 người`
                } else {
                    return `đang ghép cặp...`;
                }
            case 'night': case 'discuss':
                if (userAlive) { // còn sống
                    return `${roleTxt}`
                } else {
                    return `Bạn đã chết!`
                }
            case 'superwolf':
                if (userRole == -3) {
                    return `biến dân hóa sói`
                } else {
                    return `đang quyết định...`
                }
            case 'witch':
                if (userRole == 5) {
                    let hasSave = data.roleInfo.witchSaveRemain;
                    let hasKill = data.roleInfo.witchKillRemain;
                    if (!hasSave && !hasKill) {
                        return `đã dùng hết quyền`;
                    } else {
                        return `${hasSave ? 'còn' : 'hết'} CỨU|${hasKill ? 'còn' : 'hết'} GIẾT`;
                    }
                } else {
                    return `đang phù phép...`;
                }
            case 'vote':
                return `Chọn treo cổ 1 người`
            case 'voteResult': case 'lastWord': case 'voteYesNo':
                if (data.roleInfo.victimID !== "") {
                    return `${data.players.names[data.roleInfo.victimID]}`;
                } else {
                    return `Không ai phải lên giá!`
                }
            case 'voteYesNoResult':
                let listTreo = [];
                let listTha = [];
                let victimID = data.roleInfo.victimID;
                Object.keys(data.roleTarget.voteList).filter((userID, index) => {
                    if (data.roleTarget.voteList[userID] === victimID) {
                        listTreo = [...listTreo, data.players.names[userID]];
                    } else {
                        listTha = [...listTha, data.players.names[userID]];
                    }
                });
                return `${data.players.names[victimID]} ${listTreo.length > listTha.length ? `bị treo!` : `đc tha!`}`
        }
    }
}
export function getSelectCount(playRoomData, userRole, userAlive) {
    // console.log("getSelectCount");
    if (!userAlive) return 0;
    switch (playRoomData.state.dayStage) {
        case 'cupid':
            if (userRole == 7) {
                return 2;
            } else {
                return 0;
            }
        case 'night': switch (userRole) {
            case "-1": case "-3": case "1": case "2": case "3": return 1;
            default: return 0;
        }
        case 'witch': if (userRole == 5 && playRoomData.roleInfo.witchKillRemain) {
            return 1;
        } else {
            return 0;
        }
        case 'vote': return 1;
        default: return 0;
    }
}
export function checkReceiveChat(data, userID, userRole, userAlive) {
    // console.log("checkReceiveChat");
    return !data || (data && data.state.status === 'waiting') || // phòng chờ / vừa join phòng
        !userAlive || // chết rồi :v
        (data && (
            (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) // đêm là sói
            || data.state.dayStage === 'discuss' // thảo luận 
            || data.state.dayStage === 'vote' // vote
            || data.state.dayStage === 'voteYesNo' // vote
            || data.state.dayStage === 'lastWord' // vote
        ))
}
export function checkDisableChat(data, userID, userRole, userAlive) {
    // console.log("checkDisableChat");
    if (!userAlive) return true;
    return !(!data || (data && data.state.status === 'waiting') || // phòng chờ / vừa join phòng
        (data && (
            (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) || // đêm là sói
            data.state.dayStage === 'discuss' || // thảo luận
            (data.state.dayStage === 'lastWord' && userID == data.roleInfo.victimID)// trăn trối / giẫy
        ))
    )

}
export function isYesNoAction(playRoomData, userAlive, userRole) {
    // console.log("isYesNoAction");
    if (!userAlive) return false;
    switch (playRoomData.state.dayStage) {
        case 'night': return (userRole == 3); // thợ săn
        case 'witch': return (userRole == 5 && (!!playRoomData.roleInfo.witchSaveRemain && playRoomData.roleInfo.victimID != '')); // phù thủy còn cứu
        case 'superwolf': return (userRole == -3 && playRoomData.roleInfo.victimID != '' && playRoomData.roleInfo.superWolfVictimID == '');
        case 'voteYesNo': return true; // treo tha
        default: return false;
    }
}
// return ["yes", "no", "default"]
export function getYesNoText(playRoomData, userRole) {
    // console.log("getYesNoText");
    switch (playRoomData.state.dayStage) {
        case 'night': if (userRole == 3) {// thợ săn
            return ["Chủ động", "Bị động", ""]
        } else {
            return ["", "", ""];
        }
        case 'witch': if (userRole == 5) {
            return ['Dùng bình cứu', 'Không cứu', "Không cứu"];
        } else {
            return ["", "", ""];
        }
        case 'superwolf': if (userRole == -3) {
            return ["Nguyền", "Không nguyền", ""];
        } else {
            return ["", "", ""];
        }
        case 'voteYesNo': return ["tha chết", "treo cổ", ""]
        default: return ["", "", ""];
    }
}