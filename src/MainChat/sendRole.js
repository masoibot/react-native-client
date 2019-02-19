const serverHost = 'https://masoiapp.herokuapp.com';
// const serverHost = 'http://localhost:3001'

export function sendRequest(url, method = 'GET', body = {}) {
    if (Object.keys(body).length == 0) {
        return fetch(`${serverHost + url}`, {
            method: method, headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json());
    }
    return fetch(`${serverHost + url}`, {
        method: method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then((res) => res.json());
}
export function sendAction(roomID, userID, actionName, targets) {
    var action = '';
    if (targets.length <= 0) {
        return false;
    }
    switch (actionName) {
        case 'cupid':
            if (targets.length == 2) {
                action = `{"roleTarget.coupleList":["${targets[0]}","${targets[1]}"]}`;
                break;
            } else {
                return false;
            }
        case 'vote': action = `{"roleTarget.voteList.${userID}":"${targets[0]}"}`; break;
        case 'see': action = `{"roleTarget.seeID":"${targets[0]}"}`; break;
        case 'save': action = `{"roleTarget.saveID":"${targets[0]}"}`; break;
        case 'fire': action = `{"roleTarget.fireID": "${targets[0]}"}`; break;
        case 'fireToKill': action = `{"roleTarget.fireToKill":${targets[0]}}`; break;
        case 'witchSave': action = `{"roleTarget.witchUseSave":${targets[0]}}`; break;
        case 'witchKill': action = `{"roleTarget.witchKillID":"${targets[0]}"}`; break;
        case 'superWolf': action = `{"roleTarget.superWolfVictimID":"${targets[0]}"}`; break;
    }
    return sendRequest(`/play/${roomID}/do?action=${action}`)
        .catch(error => console.error('error', error))
}