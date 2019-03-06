import React, { PureComponent } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    Container, Button, Icon, Title, Thumbnail,
    Header, Left, Body, Right, Content, List, ListItem, Text
} from 'native-base';

import { roleName, roleDescription, roleIcons } from './Utils';

import LightListItem from '../Design/List';

export default class PlayerDrawer extends PureComponent {
    constructor(props) {
        super(props);
        this.renderCount = 0;
        this._renderItem = this._renderItem.bind(this);
    }
    _renderItem({ item }) {
        return (
            <LightListItem
                key={'UserNotActive' + item.name}
                thumbnail={item.avatar_url ? item.avatar_url : "https://sites.google.com/site/masoibot/user/user.png"}
                title={item.name}
            />
        )
    }
    render() {
        return (
            <Container style={{ backgroundColor: "#DDDDDD" }}>
                <Header style={{ backgroundColor: "#DDDDDD" }}>
                    <Left>
                        <Button transparent onPress={this.props.onClose}>
                            <Icon name="info" type="Feather" />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Vật vờ Team</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <List>
                        {
                            this.props.players.length > 0 ?
                                (<FlatList
                                    style={{ flex: 1 }}
                                    data={this.props.players}
                                    keyExtractor={(item, index) => `playersNotReady[${index}]`}
                                    renderItem={this._renderItem}
                                />) : null
                        }

                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
