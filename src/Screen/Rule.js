import React from 'react';
import { AsyncStorage, View } from 'react-native';
import {
    StyleProvider, Container, Icon, Button, Title, Thumbnail,
    Header, Left, Body, Right, Content, Text,
    ListItem, List
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import SetupDrawer from '../MainChat/SetupDrawer';

export default class RuleScreen extends React.Component {
    static navigationOptions = {
        title: 'Luật chơi',
    };
    constructor(props) {
        super(props);
        this.state = {
            userID: 'fb.com/masoibot',
            name: "Quản trò Ma sói",
            avatar: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png"
        }
        this.load = this.load.bind(this)
    }
    load = async () => {
        let userID = await AsyncStorage.getItem("userID");
        let name = await AsyncStorage.getItem("name");
        let avatar = await AsyncStorage.getItem("avatar")
        this.setState({
            userID: userID,
            name: name,
            avatar: avatar
        })
    }
    componentDidMount() {
        this.load()
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <SetupDrawer setup={{
                    "1": ["duy"],
                    "2": ["duy"],
                    "3": ["duy"],
                    "4": ["duym"],
                    "5": ["duy"],
                    "6": ["duy"],
                    "7": ["duy"],
                    "8": ["duy"],
                    "9": ["duy"],
                    "-3": ["duy"],
                    "-2": ["duy"],
                    "-1": ["duy"]
                }} />
            </StyleProvider>
        );
    }
}