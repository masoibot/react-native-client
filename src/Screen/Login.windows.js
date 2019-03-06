import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Button } from 'react-native';
import { Form, Item, Input, Text, Thumbnail, StyleProvider, Spinner } from 'native-base';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

import getTheme from '../../native-base-theme/components';
import white from '../../native-base-theme/variables/white';

import { sendRequest } from '../MainChat/sendRole'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            pass: '',
            avatar: "https://sites.google.com/site/masoibot/user/user.png",
            dangkiview: false,
            sending: false,
            isFetchingFB: false
        }
        this.initFBUser = this.initFBUser.bind(this);
    }
    onRegSubmit = user => {
        sendRequest("/reg", "POST", user).then(async res => {
            this.setState({ sending: false });
            if (res.success) {
                alert(`Đăng kí thành công!\nMời bạn đăng nhập!`)
                this.setState({ dangkiview: false });
            } else {
                alert(res.message);
            }
        }).catch(error => {
            this.setState({ sending: false });
            alert('Kiểm tra kết nối internet!\nreg_network_error');
        })
    }
    onLoginSubmit = user => {
        sendRequest(`/login?user_id=${user.id}`).then(async res => {
            this.setState({ sending: false });
            if (!res.success) {
                alert(res.message);
            } else {
                await AsyncStorage.setItem("userID", user.id);
                await AsyncStorage.setItem("name", res.data.name);
                await AsyncStorage.setItem("avatar", res.data.avatar_url ? res.data.avatar_url : "https://sites.google.com/site/masoibot/user/user.png");
                this.props.navigation.navigate('App');
            }
        }).catch(error => {
            this.setState({ sending: false });
            alert('Kiểm tra kết nối internet!\nlogin_network_error');
        })
    }
    handleRegSubmit = () => {
        if (!this.state.sending) {
            this.setState({ sending: true });
            this.onRegSubmit({
                id: this.state.id,
                name: this.state.name,
                avatar: this.state.avatar
            })
        }
    }
    handleLogInSubmit = () => {
        if (!this.state.sending) {
            this.setState({ sending: true });
            this.onLoginSubmit({ id: this.state.id })
        }
    }

    handleChangeID = text => {
        this.setState({ id: text })
    }
    handleChangeName = text => {
        this.setState({ name: text })
    }
    initAvatar(fb_uid) {
        return fetch(`https://graph.facebook.com/${fb_uid}/picture?width=150&height=150&redirect=false`).then((res) => res.json())
            .then(res => { console.log(res); return res; })
            .then((res) => res.data.url)
    }
    initFBUser(token) {
        return fetch('https://graph.facebook.com/v3.2/me?access_token=' + token).then((res) => res.json())
            .then((data) => {
                this.initAvatar(data.id).then(avatar_url => {
                    this.setState({
                        name: data.name,
                        avatar: avatar_url,
                        isFetchingFB: 'done'
                    })
                }).catch(() => {
                    this.setState({ isFetchingFB: false });
                    alert('Lỗi kết nối!\nget_avatar_error')
                })
            }).catch((err) => {
                this.setState({ isFetchingFB: false });
                alert('Lỗi kết nối!\nget_name_err', err)
            })
    }
    render() {
        return (
            <StyleProvider style={getTheme(white)}>
                <View style={styles.container}>
                    <Thumbnail style={{ height: 150, width: 150, borderRadius: 150 / 2, marginBottom: 15 }} source={{ uri: this.state.dangkiview ? this.state.avatar : "https://sites.google.com/site/masoibot/user/MaSoiLogo.png" }} />
                    {
                        !this.state.dangkiview ? (
                            <View style={{ width: '80%' }}>
                                <Item>
                                    <Input
                                        placeholder="Nhập tên đăng nhập"
                                        value={this.state.id}
                                        onChangeText={(text) => { this.setState({ id: text }) }}
                                        style={{ textAlign: 'center' }}
                                        onSubmitEditing={this.handleLogInSubmit}
                                    />
                                </Item>
                                <Button style={{ marginTop: 50 }} onPress={this.handleLogInSubmit}
                                    title={this.state.sending ? "Đang đăng nhập..." : "Đăng nhập"}
                                />
                                <Button style={{ marginTop: 10 }} onPress={() => this.setState({ dangkiview: true })}
                                    title={"Chưa có tài khoản?"}
                                />
                            </View>
                        ) : (
                                <View style={{ width: '80%' }}>
                                    <Item>
                                        <Input
                                            placeholder="Nhập tên đăng nhập"
                                            value={this.state.id}
                                            onChangeText={(text) => { this.setState({ id: text }) }}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </Item>
                                    <Item>
                                        <Input
                                            placeholder="Nhập tên hiển thị"
                                            value={this.state.name}
                                            onChangeText={(text) => { this.setState({ name: text }) }}
                                            style={{ textAlign: 'center' }}
                                            onSubmitEditing={this.handleRegSubmit}
                                        />
                                    </Item>
                                    <Button style={{ marginTop: 50 }} onPress={this.handleRegSubmit}
                                        title={this.state.sending ? "Đang đăng kí..." : "Đăng kí"}
                                    />
                                    <Button style={{ marginTop: 10 }} onPress={() => this.setState({ dangkiview: false })}
                                        title={"Đã có tài khoản?"}
                                    />
                                </View>
                            )
                    }
                </View>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        alignItems: 'center',
    },
});
