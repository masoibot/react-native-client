import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, AsyncStorage, FlatList, Image, Keyboard, Alert } from 'react-native';

import {
    StyleProvider, Container, Button, Icon, Title, Thumbnail, Subtitle,
    Header, Left, Body, Right, Footer,
    Spinner, Text, Drawer
} from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

import { extractUserRole, nextStageArr, isAlive, phe, roleName, stageName, extractUserRoleString, isDay, stageIcons, roleIcons, isWolf } from '../MainChat/Utils';
import { getSelectCount, getSubtitle, getTitle, checkDisableChat, isYesNoAction, getYesNoText, checkReceiveChat } from '../MainChat/ChatUtils';
import { sendRequest, sendAction } from '../MainChat/sendRole';

import ChatInput from '../MainChat/ChatInput';
import SetupDrawer from '../MainChat/SetupDrawer'
import PlayerDrawer from '../MainChat/PlayerDrawer'
import CircleList from '../MainChat/CircleList'
import Clock from '../MainChat/Clock';
import NotifyBar from '../MainChat/NotifyBar';
import Messages from '../MainChat/Messages';
import LightButton from '../Design/Button';
import YesNo from '../MainChat/YesNo';

export default class Chat extends PureComponent {
    constructor(props) {
        super(props);
        this.unmounted = false;
        this.renderCount = 0;
        this.state = {
            // profile
            userID: "", roomID: "20509498", userRole: 4, userAlive: true, ready: false, roleTxt: "",
            //vote status
            yesNo: null, seeDone: false, actionBarOpen: false,
            //room
            playRoomData: {
                setup: {},
                state: {
                    status: 'waiting',
                    dayStage: 'endGame',
                },
                players: {
                    ready: {},
                    names: {}
                },
                roleInfo: {
                    victimID: "",
                    lastDeath: []
                },
                roleTarget: {
                    voteList: {}
                }
            },
            //chatkit
            currentUser: null,
            //showing data
            stageIcon: false,
            title: "Ma Sói",
            subtitle: "Quản trò online",
            myCoupleID: "",
            yesNoText: [],
            hasYesNoAction: "",
            offSendChat: false,
            offReceiveChat: false,
            userIsWolf: false,
            originalSetup: {},
            wolfVoteOn: false, // true nếu cắn, false nếu thực hiện role bình thường


            selectCount: 0,
            chatRoomUsers: [], playUsers: [],
            actionNotify: "Đang chơi...",
        }
        this.sendMessenger = this.sendMessenger.bind(this)
        this.onSendAction = this.onSendAction.bind(this)
        this.onSendYesNoAction = this.onSendYesNoAction.bind(this);

        this.onGetRoom = this.onGetRoom.bind(this)
        this.load = this.load.bind(this)
        this._handleNewRoomState = this._handleNewRoomState.bind(this)
        this._handleVote = this._handleVote.bind(this)

        this._onTogget = this._onTogget.bind(this)
        this._onToggetOff = this._onToggetOff.bind(this)
        this._onLeaveRoom = this._onLeaveRoom.bind(this)
        this._onNewUser = this._onNewUser.bind(this)
        this._onHandleNewRoomState = this._onHandleNewRoomState.bind(this)
        this._onHandleVote = this._onHandleVote.bind(this)
        this._onOpenDrawer = this._onOpenDrawer.bind(this)
        this._onCloseDrawer = this._onCloseDrawer.bind(this)
        this._onCoupleAlert = this._onCoupleAlert.bind(this)
    }
    onSendAction(targets = []) {
        let playRoomData = this.state.playRoomData;
        let userID = this.state.userID;
        let roomID = this.state.roomID;
        let userRole = this.state.userRole;
        switch (playRoomData.state.dayStage) {
            case 'cupid':
                if (userRole == 7) {
                    this.setState({ actionNotify: `${playRoomData.players.names[targets[0]]}💕${playRoomData.players.names[targets[1]]}` });
                    return sendAction(roomID, userID, 'cupid', targets);
                }
            case 'night':
                if (this.state.wolfVoteOn && playRoomData.players.wolfsID.indexOf(userID) != -1) {
                    this.sendMessenger(JSON.stringify([{
                        targetID: targets[0],
                        text: `🎯${playRoomData.players.names[targets[0]]}`
                    }]));
                    this.setState({ actionNotify: `🎯Vote cắn ${playRoomData.players.names[targets[0]]}` });
                    return sendAction(roomID, userID, 'vote', targets);
                } else switch (userRole) {
                    case "1":
                        if (!this.state.seeDone) {
                            Alert.alert("Xác nhận", `Bạn có chắc chắn muốn soi ${playRoomData.players.names[targets[0]]}? Bạn chỉ được soi 1 lần mỗi đêm!`, [
                                { text: 'Hủy', onPress: () => { }, style: 'cancel' },
                                {
                                    text: 'OK', onPress: () => {
                                        let targetRole = extractUserRole(playRoomData, targets[0]);
                                        let actionNotify = ``;
                                        if (targetRole == -1 || targetRole == -3 || targetRole == 8 || targets[0] == playRoomData.roleInfo.superWolfVictimID) { // là sói hoặc người hóa sói
                                            actionNotify = `🐺${playRoomData.players.names[targets[0]]} là PHE SÓI!`;
                                        } else {
                                            actionNotify = `🎅${playRoomData.players.names[targets[0]]} là PHE DÂN!`;
                                        }
                                        this.setState({
                                            actionNotify: actionNotify,
                                            seeDone: true
                                        })
                                        return sendAction(roomID, userID, 'see', targets);
                                    }
                                },
                            ]);
                        } break;
                    case "2":
                        if (playRoomData.roleInfo.lastSaveID != targets[0]) {
                            this.setState({ actionNotify: `Bảo vệ ${playRoomData.players.names[targets[0]]}` });
                            return sendAction(roomID, userID, 'save', targets);
                        } else {
                            alert("Bạn không thể bảo vệ cùng 1 người 2 đêm liên tiếp!");
                        }
                    case "3":
                        if (playRoomData.roleInfo.lastFireID != targets[0]) {
                            this.setState({ actionNotify: `bắn ${playRoomData.players.names[targets[0]]}` });
                            return sendAction(roomID, userID, 'fire', targets);
                        } else {
                            alert("Bạn không thể ghim cùng 1 người 2 đêm liên tiếp!");
                        }
                } break;
            case 'witch': if (playRoomData.roleInfo.witchKillRemain) {
                this.setState({ actionNotify: `Dùng bình giết ${playRoomData.players.names[targets[0]]}` });
                return sendAction(roomID, userID, 'witchKill', targets);
            } break;
            case 'vote':
                this.setState({ actionNotify: `🎯Vote treo cổ ${playRoomData.players.names[targets[0]]}` });
                this.sendMessenger(JSON.stringify([{
                    targetID: targets[0],
                    text: `🎯${playRoomData.players.names[targets[0]]}`
                }]));
                return sendAction(roomID, userID, 'vote', targets);
        }
    }
    onSendYesNoAction(yesOrNo) {
        let playRoomData = this.state.playRoomData;
        let userID = this.state.userID;
        var roomID = this.state.roomID;
        let userRole = this.state.userRole;
        switch (playRoomData.state.dayStage) {
            case 'night':
                if (userRole == 3) { // thợ săn
                    this.setState({ yesNo: yesOrNo });
                    return sendAction(roomID, userID, 'fireToKill', [yesOrNo]);
                }
            case 'witch': if (playRoomData.roleInfo.witchSaveRemain && playRoomData.roleInfo.victimID != '') {
                this.setState({ yesNo: yesOrNo });
                return sendAction(roomID, userID, 'witchSave', [yesOrNo]);
            }
            case 'superwolf': if (playRoomData.roleInfo.victimID != '') {
                this.setState({ yesNo: yesOrNo });
                return sendAction(roomID, userID, 'superWolf', [yesOrNo ? playRoomData.roleInfo.victimID : '']);
            }
            case 'voteYesNo':
                this.setState({ yesNo: yesOrNo });
                this.sendMessenger(JSON.stringify([{
                    targetID: !yesOrNo ? this.state.playRoomData.roleInfo.victimID : "",
                    text: !yesOrNo ? `👎TREO` : `👍THA`
                }]));
                return sendAction(roomID, userID, 'vote', [!yesOrNo ? this.state.playRoomData.roleInfo.victimID : '']);
        }
    }

    onGetRoom = () => {
        var playRoomData;
        this.setState({ isStartingGame: false });
        sendRequest(`/play/${this.state.roomID}/join/${this.state.userID}`).then((res) => {
            if (res.success) {
                sendRequest(`/room/${this.state.roomID}/status`).then(data => {
                    playRoomData = data;
                    sendRequest(`/play/${this.state.roomID}/users`).then(users => {
                        this.setState({
                            chatRoomUsers: users,
                            playUsers: users.filter(u => {
                                return playRoomData ? playRoomData.players.ready[u.id] : true;
                            })
                        })
                    }).catch(error => alert('Kiểm tra kết nối mạng!\nrequest_users_error'))
                    if (!!playRoomData.players.ready[this.state.userID]) {
                        this.setState({ ready: true });
                    }
                    if (data.state.status === 'ingame') {
                        if (Object.keys(data.players.ready).indexOf(this.state.userID) == -1) {
                            this.props.navigation.navigate('App');
                        }
                    }
                    this._handleNewRoomState(data, null, true);
                }).catch(error => { console.log(error); alert('Kiểm tra kết nối mạng!\nrequest_Room_Data_error') })
            } else {
                alert(res.message);
                this.props.navigation.navigate('App');
            }
        });
    }
    load = async () => {
        let userID = await AsyncStorage.getItem("userID");
        var roomID = await AsyncStorage.getItem('roomID');
        this.setState({ userID: userID, roomID: roomID })
    }

    _handleNewRoomState(data, action = "", firstInit = false) {
        this.setState((state) => {
            var newState = { playRoomData: data };
            var userRole = state.userRole, userAlive = state.userAlive, roleTxt = state.roleTxt;

            if (data.state.dayStage == 'night') {
                if (data.roleTarget.seeID != "") {
                    newState = { ...newState, seeDone: true };
                } else {
                    newState = { ...newState, seeDone: false };
                }
            }
            // reload role, check alive
            if (firstInit || data.state.dayStage == 'night' || data.state.dayStage == 'discuss' || data.state.dayStage == 'readyToGame' || action === 'loadRole') {
                userRole = extractUserRole(data, state.userID);
                roleTxt = extractUserRoleString(data, state.userID, userRole)
                userAlive = isAlive(data, state.userID);
                newState = {
                    ...newState,
                    userRole: userRole,
                    roleTxt: roleTxt,
                    userAlive: userAlive
                };
            }
            // setup
            var originalSetup = state.playRoomData.setup;
            if (firstInit || data.state.dayStage == 'readyToGame') {
                originalSetup = data.setup;
            }
            // is Wolf
            var userIsWolf = isWolf(data, state.userID, userRole);
            // selectCount
            let selectCount = getSelectCount(data, userRole, userAlive);
            newState = { ...newState, selectCount: selectCount };
            if (selectCount > 0) {
                newState = { ...newState, actionBarOpen: (data.state.dayStage != 'witch'), actionNotify: `🎯Lựa chọn ${selectCount} người!` };
            } else {
                newState = { ...newState, actionBarOpen: false, actionNotify: "💩Keep calm và chơi ma sói" };
            }
            // show data
            var stageIcon = stageIcons[data.state.dayStage];
            var title = getTitle(data.state);
            var subtitle = getSubtitle(data, userRole, state.roomID, userAlive, roleTxt);
            var yesNoText = getYesNoText(data, userRole);
            var offSendChat = checkDisableChat(data, state.userID, userRole, userAlive);
            var offReceiveChat = checkReceiveChat(data, state.userID, userRole, userAlive);
            var hasYesNoAction = isYesNoAction(data, userAlive, userRole);
            var playUsers = state.playUsers.filter(u => {
                return isAlive(data, u.id);
            })
            // yes/no
            var yesNo = null;
            if (data.state.dayStage == 'voteYesNo') {
                yesNo = data.roleTarget.voteList[state.userID] != data.roleInfo.victimID; // yes là tha / no là treo
            }
            // couple
            let coupleIndex = data.players.coupleID.indexOf(state.userID);
            var myCoupleID = "";
            if (coupleIndex != -1) {
                myCoupleID = `${data.players.coupleID[coupleIndex === 1 ? 0 : 1]}`;
            }
            // update state
            newState = {
                ...newState, title: title, subtitle: subtitle, stageIcon: stageIcon,
                yesNoText: yesNoText, hasYesNoAction: hasYesNoAction,
                offSendChat: offSendChat, offReceiveChat: offReceiveChat,
                playUsers: playUsers,
                yesNo: yesNo,
                userIsWolf: userIsWolf,
                wolfVoteOn: userIsWolf,
                myCoupleID: myCoupleID,
                originalSetup: originalSetup
            };
            return newState;
        })

    }
    _handleVote(senderID, data) {
        // senderID = "duy"
        // data = {targetID:"duym"}
        var dayStage = this.state.playRoomData.state.dayStage;
        if (dayStage == 'night' || dayStage == 'vote' || dayStage == 'voteYesNo') {
            this.setState((prevState) => ({
                playRoomData: {
                    ...prevState.playRoomData,
                    roleTarget: {
                        ...prevState.playRoomData.roleTarget,
                        voteList: {
                            ...prevState.playRoomData.roleTarget.voteList,
                            [senderID]: data.targetID
                        }
                    }
                }
            }));
        }
    }
    async componentDidMount() {
        this.unmounted = false;
        await this.load();
        this.onGetRoom();
    }
    sendMessenger(message) {
        if (message && this.state.currentUser) {
            return this.state.currentUser.sendMessage({
                text: message,
                roomId: this.state.roomID
            }).catch(err => {
                alert('Không gửi được tin nhắn!');
                // console.log(`send_Message_error ${err}`);
            })
        } else {
            return new Promise(resolve => resolve());
        }
    }
    _onTogget = () => this.setState({ actionBarOpen: !this.state.actionBarOpen })
    _onToggetOff = () => this.setState({ actionBarOpen: false })
    _onLeaveRoom = () => this.props.navigation.navigate('App')
    _onNewUser = (user) => {
        if (this.state.chatRoomUsers.indexOf(user) != -1) {
            this.setState(prevState => ({
                chatRoomUsers: [...prevState.chatRoomUsers, user]
            }))
        }
    }
    _onInitMessages = (currentUser) => this.setState({ currentUser: currentUser })
    _onHandleNewRoomState = (data, action, firstInit) => this._handleNewRoomState(data, action, firstInit)
    _onHandleVote = (senderID, data) => this._handleVote(senderID, data)
    _onOpenDrawer = () => this.drawer._root.open()
    _onCloseDrawer = () => this.drawer._root.close()
    _onCoupleAlert = () => alert(`Bạn đang cặp đôi với ${this.state.playRoomData.players.names[this.state.myCoupleID]}! 2 bạn sống chết cùng nhau! Nếu 2 người ở 2 phe khác nhau, 2 người trở thành phe thứ 3!`)
    _onWolfVoteTogget = () => this.setState((prevState) => ({ wolfVoteOn: !prevState.wolfVoteOn }));
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Drawer
                    ref={(ref) => { this.drawer = ref; }}
                    content={
                        this.state.playRoomData.state.status == "ingame" ?
                            (<SetupDrawer isDrawer setup={this.state.originalSetup} onClose={this._onCloseDrawer} />) :
                            (<PlayerDrawer players={this.state.chatRoomUsers.filter(u => !this.state.playRoomData.players.ready[u.id])} onClose={this._onCloseDrawer} />)}
                    onClose={this._onCloseDrawer}
                    side='right'
                    styles={{ shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 0 }}>
                    <Container>
                        <Header>
                            {/* Nút back */}
                            <Left>
                                {
                                    (this.state.playRoomData.state.status === 'waiting') ?
                                        (<Button transparent onPress={() => { this.props.navigation.navigate('App') }}>
                                            <Icon name="arrow-back" />
                                        </Button>) : (
                                            <LightButton iconName={this.state.stageIcon[1]} iconType={this.state.stageIcon[0]}
                                                onPress={() => Alert.alert("Xác nhận", `Trở về sảnh?\nTrò chơi vẫn tiếp tục khi bạn trở về sảnh! Hãy sớm quay lại!`, [
                                                    { text: 'Hủy', onPress: () => { }, style: 'cancel' },
                                                    {
                                                        text: 'OK', onPress: () => {
                                                            this.props.navigation.navigate('App')
                                                        }
                                                    },
                                                ])}
                                                text={"Ngày " + this.state.playRoomData.state.day} vertical={true}
                                            />
                                        )
                                }

                            </Left>
                            {/* Phòng chờ / Thảo luận 2 / Đêm 2 */}
                            <Body>
                                <Title style={{ color: 'black' }}>{this.state.title}</Title>
                                <Subtitle style={{ color: 'black' }}>{this.state.subtitle}</Subtitle>
                            </Body>
                            {/* Số người chơi / Đếm giờ */}
                            <Right>{
                                (this.state.playRoomData.state.status === 'waiting') ?
                                    (
                                        <LightButton color="#85144b" iconName="ios-contacts" vertical={true}
                                            onPress={this._onOpenDrawer}
                                            text={Object.values(this.state.playRoomData.players.ready).filter(ready => ready).length + "/" + Object.keys(this.state.playRoomData.players.ready).length}
                                        />
                                    )
                                    : (
                                        <View style={styles.rowFlex}>
                                            <Clock stageEnd={this.state.playRoomData.state.stageEnd} />
                                            {
                                                this.state.myCoupleID != "" ? (
                                                    <LightButton iconName="heart" iconType="Feather"
                                                        color="#FF4136"
                                                        vertical={true}
                                                        onPress={this._onCoupleAlert}
                                                        text={"ĐÔI"}
                                                    />
                                                ) : null
                                            }
                                            <LightButton iconName={roleIcons[this.state.userRole][1]} iconType={roleIcons[this.state.userRole][0]}
                                                color="#001f3f"
                                                vertical={true}
                                                onPress={this._onOpenDrawer}
                                                text={roleName[this.state.userRole]}
                                            />
                                        </View>
                                    )

                            }</Right>
                        </Header>
                        {/* GoStage BAR*/}
                        <View style={{
                            ...styles.ItemCenter, backgroundColor: "#f5f5f5", shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 1,
                            paddingTop: 10, paddingBottom: 10
                        }}>
                            <NotifyBar
                                roomID={this.state.roomID}
                                userID={this.state.userID}
                                userRole={this.state.userRole}
                                roomState={this.state.playRoomData.state}
                                setup={this.state.playRoomData.setup}
                                names={this.state.playRoomData.players.names}
                                victimID={this.state.playRoomData.roleInfo.victimID}
                                voteList={this.state.playRoomData.roleTarget.voteList}
                                lastDeath={this.state.playRoomData.roleInfo.lastDeath}
                                readyInitValue={this.state.ready}
                                actionNotify={this.state.actionNotify}
                                yesNoText={this.state.yesNoText}
                                yesNoTextIndex={this.state.yesNo === true ? 0 : this.state.yesNo === false ? 1 : 2}
                            />
                        </View>
                        {/* Các tin nhắn  */}
                        <Messages
                            handleNewRoomState={this._onHandleNewRoomState}
                            handleVote={this._onHandleVote}
                            canReceiveChat={this.state.offReceiveChat}
                            onLeaveRoom={this._onLeaveRoom}
                            onNewUser={this._onNewUser}
                            onInit={this._onInitMessages}
                        />
                        {/* Form nhập tin nhắn */}
                        <Footer><Body>
                            <ChatInput
                                disabled={this.state.offSendChat}
                                sendMessenger={this.sendMessenger}
                                onToggle={this._onTogget}
                                hasYesNoAction={this.state.hasYesNoAction}
                                hideCircleList={this._onToggetOff}
                                onSendYesNoAction={this.onSendYesNoAction}
                                yesNo={this.state.yesNo}
                            />
                        </Body></Footer>
                        {/* Yes No */}
                        {
                            this.state.hasYesNoAction ? (<YesNo
                                voteList={this.state.playRoomData.roleTarget.voteList}
                                victimID={this.state.playRoomData.roleInfo.victimID}
                                onSendYesNoAction={this.onSendYesNoAction}
                                yesNo={this.state.yesNo}
                                yesNoText={this.state.yesNoText}
                            />) : null
                        }
                        {
                            this.state.playRoomData.roleInfo.superWolfVictimID == this.state.userID ? (
                                <LightButton onPress={this._onWolfVoteTogget} text={"Chuyển hóa"} iconName={this.state.wolfVoteOn ? "gitlab" : roleIcons[this.state.userRole][1]} iconType={this.state.wolfVoteOn ? "Feather" : roleIcons[this.state.userRole][0]} />
                            ) : null
                        }
                        {/* ActionBar */}
                        {
                            this.state.actionBarOpen ?
                                <CircleList
                                    selectCount={this.state.selectCount}
                                    voteList={this.state.playRoomData.roleTarget.voteList}
                                    chatRoomUsers={this.state.playRoomData.state.status === 'ingame' ? this.state.playUsers : this.state.chatRoomUsers.filter(u => this.state.playRoomData.players.ready[u.id])}
                                    onSendAction={this.onSendAction}
                                    myCoupleID={this.state.myCoupleID}
                                    userIsWolf={this.state.userIsWolf}
                                    wolfsID={this.state.playRoomData.players.wolfsID}
                                /> : null
                        }
                    </Container>
                </Drawer>
            </StyleProvider >
        );
    }
}

const styles = StyleSheet.create({
    rowFlex: {
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2
    },
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
