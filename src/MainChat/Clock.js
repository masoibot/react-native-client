import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import LightButton from '../Design/Button';

export default class Clock extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 0
        }
        this.countdownInterval = null;
        this.countdown = this.countdown.bind(this);
    }
    countdown(stageEnd) {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => {
            var timeLeft = (new Date(stageEnd) - new Date(Date.now())) / 1000;
            timeLeft = Math.floor(timeLeft);
            var minuteLeft = Math.floor(timeLeft / 60);
            var secondLeft = timeLeft % 60;
            var timerView = timeLeft > 0 ? `${minuteLeft > 0 ? minuteLeft + ":" : ""}${secondLeft}` : "Hết giờ";
            this.setState({ timeLeft: timerView });
            if (timeLeft <= 0) {
                clearInterval(this.countdownInterval);
            }
        }, 1000)
    }
    componentDidMount() {
        this.countdown(this.props.stageEnd);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.stageEnd !== this.props.stageEnd) {
            this.countdown(this.props.stageEnd);
        }
    }

    render() {
        return (
            <LightButton color="#85144b" iconName="ios-timer"
                text={this.state.timeLeft}
                vertical={true}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowFlex: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1
    },
});
