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
// import Chat from './Screen/Chat';
import ChatList from './Screen/ChatList';
// import NavBar from './NavBar';
// import Tabs from './MainTab/Tab';

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
    // await AsyncStorage.setItem('userID', 'duyd');
    // await AsyncStorage.setItem('roomID', '25093309');
    const userID = await AsyncStorage.getItem('userID');
    // this.stateNavigation.navigate(userID ? 'App' : 'Auth');
  }
  renderRoute() {
    switch (this.state.routeName) {
      case 'App': return <ChatList navigation={this.stateNavigation} />;
      case 'AuthLoading': return <Text>AuthLoadingScreen</Text>;
      case 'Auth': return <Login navigation={this.stateNavigation} />;
      case 'Chat': return <Text>Chat</Text>;
      default: return <Text>default route</Text>;
    }
  }

  render() {
    return (
      <View>
        {
          this.renderRoute()
        }
      </View>
    )
  }
}
export default AuthLoadingScreen