/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Text,
  View
} from 'react-native';



import Login from './Screen/Login';
import Chat from './Screen/Chat';
import Tabs from './MainTab/Tab';
import ChatList from './Screen/ChatList'
// import NavBar from './NavBar';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeName: 'Auth'
    }
    this.onStartApp()
    this.stateNavigation = {
      navigate: function (routeName) {
        this.setState({
          routeName: routeName
        })
      }
    }
    this.stateNavigation.navigate = this.stateNavigation.navigate.bind(this);
    this.renderRoute = this.renderRoute.bind(this);
  }
  onStartApp = async () => {
    await AsyncStorage.setItem('userID', 'duy');
    await AsyncStorage.setItem('avatar', 'https://sites.google.com/site/masoibot/user/user.png');
    await AsyncStorage.setItem('name', 'Khách');
    // const userID = await AsyncStorage.getItem('userID');
    // this.stateNavigation.navigate(userID ? 'App' : 'Auth');
  }
  renderRoute() {

  }

  render() {
    switch (this.state.routeName) {
      // case 'App': return <Tabs/>;
      case 'App': return <ChatList navigation={this.stateNavigation} />
      case 'AuthLoading': return <View><Text>AuthLoadingScreen</Text></View>;
      case 'Auth': return <Login navigation={this.stateNavigation} />;
      case 'Chat': return <Chat navigation={this.stateNavigation} />;
      default: return <View><Text>default route</Text></View>;
    }
  }
}
export default AuthLoadingScreen