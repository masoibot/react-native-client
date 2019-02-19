import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
    StyleProvider, Container, Icon, Button, Title, Thumbnail,
    Header, Left, Body, Right, Content,
    Footer, FooterTab,
    Form, Item, Input, Label, Text
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

import ChatList from '../Screen/ChatList'
import Account from '../Screen/Account';
import RuleScreen from '../Screen/Rule';



const TabNavigator = createBottomTabNavigator(
    {
        ChatList: ChatList,
        Rule: RuleScreen,
        Account: Account,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                if (routeName === 'ChatList') {
                    return <Icon name='ios-browsers' size={horizontal ? 20 : 25} color={tintColor} />;
                } else if (routeName === 'Rule') {
                    return <Icon name="gitlab" type="Feather" size={horizontal ? 20 : 25} color={tintColor} />;
                } else if (routeName === 'Account') {
                    return <Icon name={`ios-options${focused ? '' : '-outline'}`} size={horizontal ? 20 : 25} color={tintColor} />;
                }
            },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        tabBarPosition: "bottom",
        swipeEnabled: true,
        tabBarComponent: props => {
            return (
                <StyleProvider style={getTheme(material)}>
                    <Footer>
                        <FooterTab>
                            <Button
                                vertical
                                active={props.navigation.state.index === 0}
                                onPress={() => props.navigation.navigate("ChatList")}>
                                <Icon name="ios-browsers" />
                                <Text>Phòng chơi</Text>
                            </Button>
                            <Button
                                vertical
                                active={props.navigation.state.index === 1}
                                onPress={() => props.navigation.navigate("Rule")}>
                                <Icon name="gitlab" type="Feather" />
                                <Text>Luật chơi</Text>
                            </Button>
                            <Button
                                vertical
                                active={props.navigation.state.index === 2}
                                onPress={() => props.navigation.navigate("Account")}>
                                <Icon name="md-contact" />
                                <Text>Tài khoản</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </StyleProvider>
            );
        }
    });

export default createAppContainer(TabNavigator);