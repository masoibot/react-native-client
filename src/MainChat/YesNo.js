import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import LightButton from '../Design/Button';

export default class YesNo extends PureComponent {
    constructor(props) {
        super(props);
    }
    _onYes = () => this.props.onSendYesNoAction(true)
    _onNo = () => this.props.onSendYesNoAction(false)
    render() {
        return (
            <View style={{ ...styles.rowFlex, ...styles.ItemCenter, marginTop: 5, marginBottom: 5 }}>
                <View style={{ ...styles.ItemCenter, flex: 1 }}>
                    <LightButton iconName="thumb-up" iconType="MaterialIcons" color={this.props.yesNo ? "#2ECC40" : "#000"}
                        vertical={true}
                        onPress={this._onYes}
                        text={Object.values(this.props.voteList).filter(uid => uid != this.props.victimID).length + this.props.yesNoText[0]} />
                </View>
                <View style={{ ...styles.ItemCenter, flex: 1 }}>
                    <LightButton iconName="thumb-down" iconType="MaterialIcons" color={this.props.yesNo ? "#000" : "#FF4136"}
                        vertical={true}
                        reverse={true}
                        onPress={this._onNo}
                        text={Object.values(this.props.voteList).filter(uid => uid == this.props.victimID).length + this.props.yesNoText[1]} />
                </View>

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
    },
});
