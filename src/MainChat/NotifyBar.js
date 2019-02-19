import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import LightButton from '../Design/Button';

import { sendRequest } from './sendRole';
import { roleName } from './Utils';

export default class NotifyBar extends PureComponent {
    constructor(props) {
        super(props);
        this.renderCount = 0;
        this.state = {
            ready: false,
            isSendingReady: false,
            isStartingGame: false
        }
        this.onReady = this.onReady.bind(this);
        this.onStartGame = this.onStartGame.bind(this);
    }
    onReady(isReady) {
        this.setState({ isSendingReady: true });
        return sendRequest(`/play/${this.props.roomID}/${isReady ? 'on' : 'off'}-ready/${this.props.userID}`).then(res => {
            if (res.success) {
                this.setState({ ready: isReady, isSendingReady: false });
            } else {
                this.setState({ isSendingReady: false });
            }
        }).catch(error => {
            this.setState({ isSendingReady: false });
            alert('Kiểm tra kết nối! ready_error');
        })
    }
    onStartGame() {
        Alert.alert("Bắt đầu?", `Bạn có chắc chắc muốn bắt đầu?\nNên nhớ càng đông chơi sẽ càng vui`, [
            { text: 'Thôi', onPress: () => { }, style: 'cancel' },
            {
                text: 'Bắt đầu', onPress: () => {
                    this.setState({ isStartingGame: true });
                    this.onReady(true).then(() => {
                        return sendRequest(`/play/${this.props.roomID}/start`).then(res => {
                            this.setState({ isStartingGame: false });
                        }).catch(error => {
                            this.setState({ isStartingGame: false })
                            alert('Kiểm tra kết nối! start_game_error');
                        })
                    })
                }
            },
        ]);
    }
    componentDidMount() {
        this.setState({ ready: this.props.readyInitValue });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.readyInitValue != prevProps.readyInitValue && this.props.readyInitValue != this.state.ready) {
            this.setState({ ready: true });
        }
    }
    _onPressReady = () => {
        this.onReady(!this.state.ready);
    }
    render() {
        if (this.props.roomState.status === 'waiting') {
            return <View style={styles.rowFlex}>
                <LightButton color="#0074D9" iconName="play-circle" iconType="FontAwesome" onPress={() => !this.state.isStartingGame ? this.onStartGame() : null}
                    text={!this.state.isStartingGame ? "Bắt đầu" : "Đang bắt đầu..."}
                    style={{ marginRight: 15 }}
                />
                <LightButton color="#FF851B" iconName={this.state.ready ? "stars" : "star-border"} iconType="MaterialIcons" onPress={!this.state.isSendingReady ? this._onPressReady : null}
                    text={this.state.isSendingReady ? "Đang gửi..." : this.state.ready ? "Đã sẵn sàng" : "Sẵn sàng"}
                />
            </View>
        }
        switch (this.props.roomState.dayStage) {
            case 'readyToGame':
                let notifySetup = [];
                let setup = this.props.setup;
                Object.keys(setup).forEach(key => {
                    if (setup[key].length > 0) {
                        notifySetup = [...notifySetup, `${setup[key].length} ${roleName[key]}`];
                    }
                });
                return notifySetup.map(text => (<View key={`Setup[${text}]`} style={styles.ItemCenter}><Text>{text}</Text></View>));
            case 'cupid':
                return <View><Text>{this.props.actionNotify}</Text></View>
            case 'night':
                return <View><Text>{this.props.yesNoText[this.props.yesNoTextIndex]} {this.props.actionNotify}</Text></View>
            case 'superwolf':
                if (this.props.userRole == -3) {
                    if (this.props.victimID != "") {
                        return <View><Text>{this.props.yesNoText[this.props.yesNoTextIndex]} {this.props.names[this.props.victimID]}</Text></View>
                    } else {
                        return <View><Text>Không ai chết cả!</Text></View>
                    }
                } else {
                    return <View><Text>{this.props.actionNotify}</Text></View>
                }
            case 'witch':
                return <View>
                    {
                        this.props.userRole == 5 ?
                            this.props.victimID != '' ?
                                (<View><Text>{this.props.yesNoText[this.props.yesNoTextIndex]} {this.props.names[this.props.victimID]} đã chết</Text></View>) :
                                (<View><Text>Đêm nay không ai chết cả!</Text></View>)
                            : null
                    }
                    <View><Text>{this.props.actionNotify}</Text></View>
                </View>
            case 'discuss':
                return (
                    this.props.lastDeath.length > 0 ?
                        this.props.lastDeath.map(uid => {
                            return <View key={"death" + uid + new Date()} style={styles.ItemCenter}><Text>{this.props.names[uid]} đã chết</Text></View>
                        })
                        :
                        <View><Text>Đêm qua không ai chết cả!</Text></View>
                );
            case 'vote':
                return <View><Text>{this.props.actionNotify}</Text></View>
            case 'voteResult':
                let voteArr = {};
                Object.keys(this.props.voteList).forEach((userID, index) => {
                    targetID = this.props.voteList[userID];
                    voteArr[targetID] ? voteArr[targetID]++ : voteArr[targetID] = 1;
                });
                if (Object.keys(voteArr).length > 0) {
                    return Object.keys(voteArr).map((targetID, index) => {
                        return <View key={"voteResut" + targetID + new Date()} style={styles.ItemCenter}>
                            <Text>{index + 1}: {this.props.names[targetID]} ({voteArr[targetID]} phiếu)</Text>
                        </View>;
                    })
                } else {
                    return <View><Text>Không ai bị vote cả!</Text></View>
                }
            case 'lastWord':
                return <View><Text>1 phút thanh minh cho bản thân!</Text></View>
            case 'voteYesNo':
                return <View><Text>Bạn muốn ...{this.props.yesNoText[this.props.yesNoTextIndex]}</Text></View>
            case 'voteYesNoResult':
                let listTreo = [];
                let listTha = [];
                let victimID = this.props.victimID;
                Object.keys(this.props.voteList).filter((userID, index) => {
                    if (this.props.voteList[userID] === victimID) {
                        listTreo = [...listTreo, this.props.names[userID]];
                    } else {
                        listTha = [...listTha, this.props.names[userID]];
                    }
                });
                return <View>
                    <View><Text>{this.props.names[victimID]} {listTreo.length > listTha.length ? `bị treo cổ!` : `được tha!`}</Text></View>
                    <View><Text>👎{listTreo.length} treo: {listTreo.join(', ')}</Text></View>
                    <View><Text>👍{listTha.length} tha: {listTha.join(', ')}</Text></View>
                </View>
        }
    }
}

const styles = StyleSheet.create({
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowFlex: {
        flexDirection: 'row',
    }
});
