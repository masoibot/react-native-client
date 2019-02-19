import React, { Component } from 'react';
import { Alert, AsyncStorage, StatusBar, View, Linking, BackHandler } from 'react-native';
import { Thumbnail, Spinner } from 'native-base';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import Login from './Screen/Login';
import Chat from './Screen/Chat';
import NavBar from './NavBar';
import Tabs from './MainTab/Tab';

import { sendRequest } from "./MainChat/sendRole";

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      version: "1.0.1f_rc1",
      releaseDate: "2019-02-01T11:47:06.238Z"
    }
    this.onStartApp()
  }
  onStartApp = async () => {
    const userID = await AsyncStorage.getItem('userID');
    this.setState({
      userID: userID,
    })
  }
  _toDateTimeString(date = new Date()) {
    return `${date.toLocaleTimeString("vi-vn")} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  componentDidMount() {
    sendRequest("/app/update").then(res => {
      if (res.version > this.state.version || new Date(res.releaseDate) > new Date(this.state.releaseDate)) {
        Alert.alert(
          'Cập nhật',
          `Đã có phiên bản mới: ${res.version}\nCập nhật: ${this._toDateTimeString(new Date(res.releaseDate))}\nThay đổi:${res.changeLog}\nTải ngay tại: ${res.downloadLink}`,
          [
            { text: 'Bỏ qua', onPress: () => { this.props.navigation.navigate(this.state.userID ? 'App' : 'Auth'); }, style: 'cancel' },
            { text: 'Cập nhật', onPress: () => Linking.openURL(res.downloadLink).catch(err => alert('Không thể mở link!')) },
          ]
        )
      } else {
        // alert("Đã cài bản mới nhất!");
        this.props.navigation.navigate(this.state.userID ? 'App' : 'Auth');
      }
    }).catch(err => {
      alert("Không thể kiểm tra cập nhật!\nKiểm tra kết nối internet!");
    })
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DDDDDD' }}>
        <Thumbnail style={{ height: 100, width: 100 }} source={{ uri: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png" }} />
        <Spinner color="#0074D9" style={{ height: 50, width: 50, marginTop: 100 }} />
        <StatusBar barStyle="default" />
      </View>
    )
    // if (this.state.logged_in) {
    //   if (this.state.chatViewOn) {
    //     return <Chat userID={this.state.id} />
    //   }
    //   return <NavBar userID={this.state.id} chatView={this.changeToChatView} />
    // } else {
    //   // return <Login handleRegSubmit={this.onRegSubmit} handleLogInSubmit={this.onLoginSubmit} />
    //   return <Tabs />
    // }
  }
}
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: Tabs,
    Auth: Login,
    Chat: Chat
  },
  {
    initialRouteName: 'AuthLoading',
  }
));