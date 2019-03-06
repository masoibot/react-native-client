import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
    StyleProvider, Container, Button, Icon, Title, Thumbnail,
    List, ListItem,
    Header, Left, Body, Right, Content, Text, Separator,
    Spinner
} from 'native-base';

import LightListItem from '../Design/List';

import { sendRequest } from '../MainChat/sendRole';
import { stageName } from '../MainChat/Utils';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import LightButton from '../Design/Button';

export default class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: 'https://sites.google.com/site/masoibot/user/user.png',
            name: 'Ma sói',
            roomID: '',
            isRefreshing: false,
            rooms: []
        };
        this.ummounted = false;
        this.refreshRoomList = this.refreshRoomList.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }
    async componentWillMount() {
        let roomID = await AsyncStorage.getItem('roomID');
        let rooms = await AsyncStorage.getItem('rooms');
        let avatar = await AsyncStorage.getItem('avatar');
        let name = await AsyncStorage.getItem('name');
        if (rooms) {
            this.setState({
                rooms: JSON.parse(rooms)
            })
        }
        this.setState({
            roomID: roomID,
            avatar: avatar,
            name: name
        })
    }
    componentDidMount() {
        this.ummounted = false;
        this.refreshRoomList();
        this.interval = setInterval(this.refreshRoomList, 10000);
    }
    componentWillUnmount() {
        this.ummounted = true;
        clearInterval(this.interval);
    }
    refreshRoomList() {
        if (this.state.isRefreshing) return;
        this.setState({ isRefreshing: true });
        sendRequest(`/room`).then(data => {
            if (!this.ummounted) {
                this.setState({
                    rooms: data,
                    isRefreshing: false
                }, () => {
                    AsyncStorage.setItem('rooms', JSON.stringify(this.state.rooms));
                })
            }
        }).catch(err => {
            this.setState({ isRefreshing: false });
        })
    }
    onJoinRoom = async (roomID) => {
        await AsyncStorage.setItem('roomID', roomID).then(() => {
            this.props.navigation.navigate('Chat');
        })
    }
    onLogout = async () => {
        await AsyncStorage.removeItem('userID');
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Thumbnail small source={{ uri: this.state.avatar }} />
                        </Left>
                        <Body>
                            <Title style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>{this.state.name}</Title>
                        </Body>
                        <Right>
                            {this.state.isRefreshing ? (<Spinner color="#0074D9" />)
                                : (
                                    <LightButton color="#0074D9" iconName="refresh" iconType="EvilIcons" onPress={this.refreshRoomList}
                                        text="Làm mới" />)
                            }
                            <LightButton color="#FF0022" iconName="ios-log-out" onPress={this.onLogout}
                                text="Thoát" />
                        </Right>
                    </Header>
                    <Content>
                        <List>
                            <Separator bordered style={{ height: 50 }}>
                                <Text style={{ fontSize: 15 }}>Phòng của bạn</Text>
                            </Separator>
                            {
                                this.state.roomID ? (
                                    <LightListItem
                                        onPress={() => { this.onJoinRoom(this.state.roomID); }}
                                        title={`Phòng ${this.state.roomID}`}
                                        subTitle={`Trở về phòng gần đây...`}
                                        moreTitle={`Tham gia`}
                                    />
                                ) : null
                            }

                            <Separator bordered style={{ height: 50 }}>
                                <Text style={{ fontSize: 15 }}>Phòng có thể tham gia</Text>
                            </Separator>
                            {
                                this.state.rooms.map(r => (
                                    <LightListItem
                                        key={"room" + r.roomChatID}
                                        onPress={() => { this.onJoinRoom(r.roomChatID); }}
                                        title={`Phòng ${r.roomChatID}`}
                                        subTitle={r.state.status === 'waiting' ?
                                            (`${Object.keys(r.players.ready).length} ONLINE `) :
                                            (`${Object.values(r.players.ready).filter(p => p).length}👥| Ngày ${r.state.day}|${stageName[r.state.dayStage]}|${Math.floor((new Date(r.state.stageEnd) - new Date(Date.now())) / 1000)}s`)
                                        }
                                        moreTitle={r.state.status === 'waiting' ? '💤ĐANG CHỜ' : '🎮Gaming'}
                                    />
                                    // <ListItem key={"room" + r.roomChatID} avatar button onPress={() => { this.onJoinRoom(r.roomChatID); }}>
                                    //     <Left>
                                    //         <Thumbnail small source={{ uri: 'https://sites.google.com/site/masoibot/user/MaSoiLogo.png' }} />
                                    //     </Left>
                                    //     <Body>
                                    //         <Text>Phòng {r.roomChatID}</Text>
                                    //         {
                                    //             r.state.status === 'waiting' ? (
                                    //                 <Text note>{Object.keys(r.players.ready).length} ONLINE</Text>
                                    //             ) : (
                                    //                     <Text note>{Object.values(r.players.ready).filter(p => p).length}👥| Ngày {r.state.day}|{stageName[r.state.dayStage]}|{Math.floor((new Date(r.state.stageEnd) - new Date(Date.now())) / 1000)}s</Text>
                                    //                 )
                                    //         }
                                    //     </Body>
                                    //     <Right>
                                    //         <Text note>{r.state.status === 'waiting' ? '💤ĐANG CHỜ' : '🎮Gaming'}</Text>
                                    //     </Right>
                                    // </ListItem>
                                ))
                            }
                        </List>
                    </Content>
                </Container>
            </StyleProvider >
        )
    }
}
