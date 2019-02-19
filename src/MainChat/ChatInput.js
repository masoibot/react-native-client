import React, { Component, PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    AsyncStorage,
    Keyboard
} from 'react-native';
import {
    StyleProvider, Container, Button, Icon, Title, Thumbnail,
    Header, Left, Body, Right, Content,
    Footer, FooterTab,
    Form, Item, Input, Label, Text
} from 'native-base';

import { sendAction } from './sendRole';

class InputForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this._onSendMessage = this._onSendMessage.bind(this);
        this.handleMessageInput = this.handleMessageInput.bind(this);
    }
    handleMessageInput = text => {
        this.setState({ message: text })
    }
    clearInput = () => {
        this.setState({ message: "" })
    }
    _onSendMessage() {
        return this.props.disabled ? null : this.state.message != "" ? this.props.sendMessenger(this.state.message).then(() => this.clearInput()) : null
    }
    render() {
        return (
            <View style={{ ...styles.rowFlex, flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingBottom: 5, paddingTop: 5 }}>
                        <Item rounded style={{backgroundColor:"#f5f5f5"}} >
                            <Input placeholder={`Nhập tin nhắn...`}
                                style={{ height: 35, fontSize: 16, paddingBottom: 2, paddingTop: 2 }}
                                value={this.state.message}
                                onChangeText={(text) => this.handleMessageInput(text)}
                                onSubmitEditing={this._onSendMessage}
                                onFocus={this.props.hideCircleList}
                            />
                        </Item>
                    </View>
                </View>
                <View>
                    {!this.props.disabled ? <Button transparent onPress={this._onSendMessage}><Icon name="md-send" style={{ color: "#001f3f" }}/></Button> : null}
                </View>
            </View>
        )
    }
}

export default class ChatInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.renderCount = 0;
        this._onPressToggle = this._onPressToggle.bind(this);
        this._onYes = this._onYes.bind(this)
        this._onNo = this._onNo.bind(this)
    }
    _onPressToggle() { this.props.onToggle(); Keyboard.dismiss(); }
    _onYes = () => this.props.onSendYesNoAction(true)
    _onNo = () => this.props.onSendYesNoAction(false)
    render() {
        return (
            <View style={{ ...styles.rowFlex, ...styles.ItemCenter }}>
                <View>
                    <Button transparent onPress={this._onPressToggle}>
                        <Icon name="ios-keypad" style={{ color: "#001f3f" }} />
                    </Button>
                </View>
                <View>
                    {this.props.hasYesNoAction ? <Button transparent onPress={this._onYes}>
                        <Icon name="md-thumbs-up" style={{ color: this.props.yesNo === true ? '#2ECC40' : '#000' }} />
                    </Button> : null}
                </View>
                <View>
                    {this.props.hasYesNoAction ? <Button transparent onPress={this._onNo}>
                        <Icon name="md-thumbs-down" style={{ color: this.props.yesNo === false ? '#FF4136' : '#000' }} />
                    </Button> : null}
                </View>
                <InputForm
                    disabled={this.props.disabled}
                    sendMessenger={this.props.sendMessenger}
                    hideCircleList={this.props.hideCircleList}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowFlex: {
        flexDirection: 'row',
        flex: 1
    },
});
