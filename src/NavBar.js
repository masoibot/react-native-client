import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    TextInput
} from 'react-native';

import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import {
    StyleProvider, Container, Button, Icon, Title, Thumbnail,
    Header, Left, Body, Right, Content,
    Footer, FooterTab,
    Form, Item, Input, Label, Text
} from 'native-base';

import ChatList from './Screen/ChatList';

export default class NavBar extends Component {
    state = {
        id: null,
        logged_in: false,
        token: null,
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <ChatList chatView={this.props.chatView}/>
                    <Footer>
                        <FooterTab>
                            <Button vertical active>
                                <Icon name="ios-chatbubbles" />
                                <Text>Chat</Text>
                            </Button>
                            <Button vertical>
                                <Icon active name="ios-people" />
                                <Text>Team</Text>
                            </Button>
                            <Button vertical>
                                <Icon name="apps" />
                                <Text>Contact</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        )
    }
}
