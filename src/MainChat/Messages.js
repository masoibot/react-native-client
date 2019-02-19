import React, { Component, PureComponent } from 'react';
import { AsyncStorage, StyleSheet, View, Image, FlatList } from 'react-native';
import { Text, Thumbnail, Spinner } from 'native-base';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client/react-native'

class Message extends PureComponent {
    constructor(props) {
        super(props);
        this.renderCount = 0;
    }
    render() {
        if (this.props.message && this.props.message.sender) {
            if (this.props.message.sender.id == this.props.userID) {
                // tin nhắn gửi đi
                return (
                    <View style={{ ...styles.rowFlex, marginRight: 10, marginLeft: 20, marginTop: 2, marginBottom: 2 }} >
                        <View style={{ flex: 1 }}></View>
                        <View style={{ backgroundColor: '#0084ff', borderRadius: 10, paddingTop: 10, paddingBottom: 10, color: 'white' }}>
                            <Text style={{ paddingRight: 10, paddingLeft: 10, color: 'white' }}>{this.props.message.text}</Text>
                        </View>
                    </ View>
                )
            } else {
                // tin nhắn nhận về
                return (
                    <View style={{ ...styles.rowFlex, marginRight: 20, marginLeft: 10, marginTop: 2, marginBottom: 2 }} >

                        {
                            this.props.showAvatar ? (
                                <View style={{ marginRight: 10, marginTop: 10 }}><Thumbnail small source={{ uri: this.props.message.sender.avatarURL ? this.props.message.sender.avatarURL : 'https://sites.google.com/site/masoibot/user/user.png' }} /></View>
                            ) : (
                                    <View style={{ marginLeft: 45 }}></View>
                                )
                        }
                        <View style={{ flex: this.props.message.text.length > 30 ? 1 : 0, backgroundColor: '#f0f0f0', borderRadius: 10, paddingTop: 10, paddingBottom: 10 }}>
                            {
                                this.props.showAvatar ? (
                                    <Text style={{ paddingRight: 10, paddingLeft: 10, fontWeight: 'bold' }}>{this.props.message.sender.name}</Text>
                                ) : null
                            }
                            {
                                this.props.message.attachment && this.props.message.attachment.type === "image" ? (
                                    <View style={{ width: 256, height: 144 }}>
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: this.props.message.attachment.link }}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                ) : (
                                        <Text style={{ paddingRight: 10, paddingLeft: 10 }}>{this.props.message.text}</Text>
                                    )
                            }
                        </View>
                    </View>
                )
            }
        } else {
            return (<Text>Tin nhắn không hợp lệ!</Text>)
        }
    }
}

export default class Messages extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            messages: [],
            currentUser: null, // send outside via props
        }
        this.renderCount = 0;
        this._renderMessage = this._renderMessage.bind(this)
        this._onSrollToEnd = this._onSrollToEnd.bind(this)
        this._keyExtractor = this._keyExtractor.bind(this)
    }
    async load() {
        var userID = await AsyncStorage.getItem("userID");
        var roomID = await AsyncStorage.getItem('roomID');
        var lastRoomMessages = await AsyncStorage.getItem('roomMessages');
        if (lastRoomMessages) {
            lastRoomMessages = JSON.parse(lastRoomMessages);
        }
        this.setState({ userID: userID, roomID: roomID, messages: lastRoomMessages && lastRoomMessages.userID == userID && lastRoomMessages.roomID == roomID ? lastRoomMessages.messages : [] })
    }
    componentWillUnmount() {
        var messageLength = this.state.messages.length;
        let messages = this.state.messages.filter((m, i) => (messageLength - i <= 20)).map(m => {
            return {
                attachment: m.attachment,
                text: m.text,
                sender: m.sender,
                updatedAt: m.updatedAt
            }
        });
        AsyncStorage.setItem("roomMessages", JSON.stringify({ userID: this.state.userID, roomID: this.state.roomID, messages: messages }));
    }
    async componentDidMount() {
        await this.load();
        if (this.state.currentUser) {
            this.state.currentUser.disconnect();
        }
        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:754dee8b-d6c4-41b4-a6d6-7105da589788',
            userId: this.state.userID,
            tokenProvider: new TokenProvider({ url: 'https://masoiapp.herokuapp.com/auth' })
        })
        chatManager.connect({
            onRemovedFromRoom: room => {
                this.props.onLeaveRoom();
            }
        }).then(currentUser => {
            console.log("Kết nối thành công!");
            this.setState({
                connected: true,
                currentUser: currentUser
            })
            this.props.onInit(currentUser);
            currentUser.subscribeToRoom({
                roomId: this.state.roomID,
                hooks: {
                    onMessage: m => {
                        if (m.text[0] === '{' && m.sender.id == 'botquantro') {
                            try {//is JSON
                                let content = JSON.parse(m.text)
                                this.props.handleNewRoomState(content.data, content.action, false);
                                if (content.text != "") {
                                    this.setState(prevState => ({
                                        messages: [...prevState.messages, {
                                            text: content.text,
                                            sender: {
                                                id: m.sender.id,
                                                name: m.sender.name
                                            }
                                        }]
                                    }));
                                }
                            } catch (err) {
                                // console.log("receive_JSON_err", err);
                            }
                        } else if (m.text[0] === '[') {
                            try {//is JSON
                                let content = JSON.parse(m.text)
                                if (this.props.canReceiveChat) {
                                    this.props.handleVote(m.sender.id, content[0]);
                                    this.setState(prevState => ({
                                        messages: [...prevState.messages, {
                                            text: content[0].text,
                                            sender: {
                                                id: m.sender.id,
                                                name: m.sender.name
                                            }
                                        }]
                                    }));
                                }
                            } catch (err) {
                                // console.log("receive_JSON_err", err);
                            }
                        }
                        else {
                            if (this.props.canReceiveChat) {
                                this.setState(prevState => ({
                                    messages: [...prevState.messages, m]
                                }));
                            }
                        }
                    },
                    onUserJoined: user => {
                        this.props.onNewUser(user);
                    },
                    onPresenceChanged: (state, user) => {
                        // console.log(`${user.name} is ${state.current}`)
                    }
                },
                messageLimit: 0
            }).catch(err => {
                alert('Kiểm tra kết nối Internet!\nroom_subscibe_error')
                // console.log('room_subscibe_error', err)
            });
        }).catch(err => {
            alert('Kiểm tra kết nối Internet!\nchat_connect_error')
            // console.log('chatkit_connect_error', err)
        })
    }
    _renderMessage({ item, index }) {
        return (<Message userID={this.state.userID} message={item} mIndex={index} showAvatar={index <= 0 || (index > 0 && this.state.messages[index - 1].sender.id != item.sender.id)} />)
    }
    _onSrollToEnd() {
        this.refs._flatList.scrollToEnd({ animated: true });
    }
    _keyExtractor = (m, index) => `Messages[${index}]`
    render() {
        if (this.state.connected) {
            return (
                <View style={{ flex: 1 }}>
                    <FlatList style={{ flex: 1 }}
                        data={this.state.messages}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderMessage}
                        ref='_flatList'
                        onContentSizeChange={this._onSrollToEnd}
                    />
                </View>
            );
        } else {
            return (
                <View style={{ ...styles.ItemCenter, flex: 1 }}>
                    <Spinner color="#0074D9" />
                </View>
            )
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
