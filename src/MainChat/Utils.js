export function extractUserRole(data, userID) {
    let setup = data.setup;
    let ret = 0;
    Object.keys(setup).every((roleCode) => {
        if (setup[roleCode].indexOf(userID) != -1) {
            ret = roleCode;
            return false;
        }
        return true;
    })
    return ret;
}
export function extractUserRoleString(data, userID, userRole) {
    let roleTxt = ``;
    if (data.roleInfo.superWolfVictimID == userID) { // dân bị sói cắn và nguyền
        roleTxt += "🐺SÓI (sau bị nguyền)";
    } else {
        roleTxt += `${roleName[userRole]}`;
        if (userRole == 6) { // già làng
            roleTxt += `(${data.roleInfo.oldManLive}💙)`
        }
    }
    // let coupleIndex = data.players.coupleID.indexOf(userID);
    // if (coupleIndex != -1) {
    //     roleTxt += `💕${data.players.names[data.players.coupleID[coupleIndex === 1 ? 0 : 1]]}`;
    // }
    return roleTxt;
}
export function isAlive(data, userID) {
    return data.roleInfo.deathList.indexOf(userID) == -1;
}
export function isDay(data) {
    var dayStage = data.state.dayStage;
    return Object.keys(nextStageArr).indexOf(dayStage) >= Object.keys(nextStageArr).indexOf('discuss');
}
export function isWolf(data, userID, userRole) {
    return userRole < 0 || userID == data.roleInfo.superWolfVictimID;
}
export const stageIcons = {
    "readyToGame": ["Feather", "compass"],
    "cupid": ["Feather", "heart"],
    "night": ["Feather", "moon"],
    "superwolf": ["Feather", "gitlab"],
    "witch": ["Feather", "github"],
    "discuss": ["Feather", "message-circle"],
    "vote": ["Feather", "bar-chart-2"],
    "voteResult": ["Feather", "bar-chart"],
    "lastWord": ["Feather", "feather"],
    "voteYesNo": ["Feather", "thumbs-up"],
    "voteYesNoResult": ["Feather", "info"]
}
export const nextStageArr = {
    "readyToGame": "cupid",
    "cupid": "night",
    "night": "superwolf",
    "superwolf": "witch",
    "witch": "discuss",
    "discuss": "vote",
    "vote": "voteResult",
    "voteResult": "lastWord",
    "lastWord": "voteYesNo",
    "voteYesNo": "voteYesNoResult",
    "voteYesNoResult": "cupid"
}
export const stageName = {
    "readyToGame": "Bắt đầu",
    "cupid": "Thần tình yêu",
    "night": "Nửa đêm",
    "superwolf": "Sói nguyền",
    "witch": "Phù thủy",
    "discuss": "Bàn luận",
    "vote": "Bình chọn",
    "voteResult": "Ai đáng nghi?",
    "lastWord": "Thanh minh",
    "voteYesNo": "Treo hay tha",
    "voteYesNoResult": "Kết quả"
}
export const phe = {
    "9": "Thiên sứ",
    "3": "Cặp đôi",
    "-1": "Sói",
    "1": "DÂN",
}
export const roleName = {
    // PHE SÓI
    "-1": 'SÓI', //🐺
    "-2": 'BÁN SÓI', //🐺
    "-3": 'SÓI NGUYỀN',//🐺

    // PHE DÂN
    "1": 'TIÊN TRI', //👁
    "2": 'BẢO VỆ', //🛡
    "3": 'THỢ SĂN', //🏹
    "4": 'DÂN', //🎅
    "5": 'PHÙ THỦY',//🧙‍
    "6": 'GIÀ LÀNG', //👴
    "7": 'CUPID',//👼
    "8": 'NG HÓA SÓI', //👽
    "9": 'THIÊN SỨ', //🧚‍
}
export const roleIcons = {
    // PHE SÓI
    "-1": ["Feather", "gitlab"],
    "-2": ["Feather", "percent"],
    "-3": ["Feather", "gitlab"],

    // PHE DÂN
    "1": ["Feather", "eye"],
    "2": ["Feather", "shield"],
    "3": ["Feather", "crosshair"],
    "4": ["Feather", "user"],
    "5": ["Feather", "github"],
    "6": ["Feather", "award"],
    "7": ["Feather", "heart"],
    "8": ["Feather", "user-x"],
    "9": ["Feather", "twitter"],
}
export const roleDescription = {
    // PHE SÓI
    "-1": 'Mỗi đêm thức dậy chọn một người để cắn!', //🐺
    "-2": 'Bạn vẫn là dân thường cho đến khi bị cắn bởi sói!', //🐺
    "-3": 'Được quyền 1 lần/1 game để nguyền người bị cắn đêm hôm đó. Người bị nguyền sẽ trở thành sói thay vì chết!',//🐺

    // PHE DÂN
    "1": 'Mỗi đêm kiểm tra 1 người là phe sói hay phe dân!', //👁
    "2": 'Mỗi đêm bảo vệ 1 người, người đó bị sói cắn sẽ không chết! Nhưng không thể bảo vệ cùng 1 người 2 đêm liên tiếp!', //🛡
    "3": 'Mỗi đêm được chọn 1 người để ngắm! Nếu chủ động bắn, người bị bắn sẽ chết, bắn trúng sói thì thợ săn thành dân, còn không thợ săn phải đền mạng! Nếu bị động bắn, khi thợ săn bị cắn sẽ kéo theo người đó!', //🏹
    "4": 'Quyết định người bị treo cổ vào sáng hôm sau', //🎅
    "5": 'Được quyền cứu 1 người bị cắn và giết 1 người',//🧙‍
    "6": 'Có 2 mạng, già mà khỏe', //👴
    "7": 'Đêm đầu tiên ghép đôi 2 người, 2 người sẽ sống chết cùng nhau, nếu 2 người thuộc 2 phe thì sẽ trở thành phe thứ 3!',//👼
    "8": 'Là DÂN nhưng bị tiên tri soi nhầm thành sói, oan ức :v', //👽
    "9": 'Chết vào ngày đầu tiên sẽ thắng!', //🧚‍
}