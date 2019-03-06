import React from 'react';
import { AsyncStorage, View } from 'react-native';
import {
    StyleProvider, Container, Icon, Button, Title, Thumbnail,
    Header, Left, Body, Right, Content, Text,
    ListItem, List
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

export default class AccountScreen extends React.Component {
    static navigationOptions = {
        title: 'Tài khoản',
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
    onLogout = async () => {
        await AsyncStorage.removeItem('userID');
        this.props.navigation.navigate('Auth');
    }
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Thumbnail small source={{ uri: 'https://sites.google.com/site/masoibot/user/MaSoiLogo.png' }} />
                        </Left>
                        <Body>
                            <Title style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Tài khoản</Title>
                        </Body>
                        <Right>
                            <Button transparent iconLeft onPress={() => this.onLogout()}>
                                <Icon name='ios-log-out' />
                                <Text>Thoát</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 15 }}>
                            <Thumbnail style={{ height: 150, width: 150, borderRadius: 150 / 2 }} source={{ uri: this.state.avatar }} />
                            <Text style={{ fontWeight: 'bold', fontSize: 28, paddingTop: 10 }}>{this.state.name}</Text>
                            <Text style={{ fontSize: 15 }}>{this.state.userID}</Text>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            {/* <List>
                                <ListItem icon noBorder>
                                    <Left>
                                        <Button style={{ backgroundColor: "#ff294d"}}>
                                            <Icon active name="md-trophy" />
                                        </Button>
                                    </Left>
                                    <Body>
                                        <Text>[show_achievement_btn]</Text>
                                    </Body>
                                </ListItem>
                                <ListItem icon noBorder>
                                    <Left>
                                        <Button style={{ backgroundColor: "#0084ff"}}>
                                            <Icon active name="md-contact" />
                                        </Button>
                                    </Left>
                                    <Body>
                                        <Text>[edit_profile_btn]</Text>
                                    </Body>
                                </ListItem>
                                <ListItem icon noBorder onPress={this.onLogout}>
                                    <Left>
                                        <Button style={{ backgroundColor: "#773aff"}}>
                                            <Icon active name="md-log-in" />
                                        </Button>
                                    </Left>
                                    <Body>
                                        <Text>Đăng xuất</Text>
                                    </Body>
                                </ListItem>
                            </List> */}
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}