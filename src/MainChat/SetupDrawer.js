import React, { PureComponent } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    Container, Button, Icon, Title, Thumbnail,
    Header, Left, Body, Right, Content, List, ListItem, Text
} from 'native-base';

import { roleName, roleDescription, roleIcons } from './Utils';

export default class SetupDrawer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originalSetup: {}
        }
        this.renderCount = 0;
        this._renderItem = this._renderItem.bind(this);
    }
    _renderItem({ item }) {
        const roleID = item;
        return (
            <ListItem avatar key={'setupDrawer' + roleID}>
                <Left>
                    <Icon name={roleIcons[roleID][1]} type={roleIcons[roleID][0]} />
                </Left>
                <Body>
                    <Text>{this.state.originalSetup[roleID].length} {roleName[roleID]}</Text>
                    <Text note>{roleDescription[roleID]}</Text>
                </Body>
                {
                    roleID < 0 ? <Right><Text>🐺</Text></Right> : null
                }
            </ListItem>
        )
    }
    componentDidMount() {
        var setup = this.props.setup
        if (Object.keys(setup).length > 0) {
            this.setState({
                originalSetup: setup
            })
        }
    }
    componentDidUpdate(prevProps, prevState) {
        var setup = this.props.setup;
        if (Object.keys(setup).length > 0) {
            this.setState({
                originalSetup: setup
            })
        }
    }
    render() {
        return (
            <Container style={{ backgroundColor: this.props.isDrawer ? "#DDDDDD" : "#FFF" }}>
                <Header style={{ backgroundColor: this.props.isDrawer ? "#DDDDDD" : "#FFF" }}>
                    <Left>
                        <Button transparent onPress={this.props.onClose}>
                            <Icon name="info" type="Feather" />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Vai trò</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <List>
                        {
                            Object.keys(this.props.setup).length > 0 ?
                                (<FlatList
                                    style={{ flex: 1 }}
                                    data={Object.keys(this.state.originalSetup).filter(role => this.state.originalSetup[role].length > 0)}
                                    keyExtractor={(item, index) => `setupDescription[${index}]`}
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
