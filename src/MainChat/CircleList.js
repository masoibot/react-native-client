import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Thumbnail, Text, Icon } from 'native-base';
import { isWolf } from './Utils';

class CircleItem extends PureComponent {
    constructor(props) {
        super(props);
        this.renderCount = 0;
    }
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    render() {
        const bdColor = this.props.selected ? "#0074D9" : "white";
        const bgColor = this.props.showWolf && this.props.isWolf ? "#85144b" : (this.props.isCouple ? "#FF4136" : "#2ECC40");
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={{ ...styles.ItemCenter, paddingLeft: 5, paddingRight: 5 }}>
                    <View style={{ ...styles.ItemCenter, borderRadius: 72 / 2, height: 72, width: 72, borderColor: bdColor, borderWidth: 3 }}>
                        <Thumbnail style={{ height: 60, width: 60, borderRadius: 60 / 2 }} source={{ uri: this.props.avatar_url ? this.props.avatar_url : 'https://sites.google.com/site/masoibot/user/user.png' }} />
                        {
                            this.props.voteCount > 0 ? (
                                <View style={{ ...styles.ItemCenter, height: 26, width: 26, borderRadius: 26 / 2, borderColor: 'white', borderWidth: 3, backgroundColor: bgColor, bottom: -3, right: -3, position: 'absolute' }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>{this.props.voteCount}</Text>
                                </View>
                            ) : this.props.showWolf || this.props.isCouple ? (
                                <View style={{ ...styles.ItemCenter, height: 26, width: 26, borderRadius: 26 / 2, borderColor: 'white', borderWidth: 3, backgroundColor: bgColor, bottom: -3, right: -3, position: 'absolute' }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>{this.props.isCouple ? "❤" : (this.props.showWolf && this.props.isWolf ? "🐺" : "👤")}</Text>
                                </View>
                            ) : null
                        }

                    </View>
                    <View>
                        {
                            this.props.noText ? null : <Text style={{ fontSize: 12 }}>{this.props.name}</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default class CircleList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            choosedItem: {},
            selected: new Map()
        }
        this.renderCount = 0;
        this._onPressItem = this._onPressItem.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.selectCount === nextProps.selectCount && this.props.chatRoomUsers.length === nextProps.chatRoomUsers.length) {
    //         return !this.props.chatRoomUsers.every((u, i) => {
    //             return (u.id == nextProps.chatRoomUsers[i].id)
    //         })
    //     }
    //     return true;
    // }
    _onPressItem = (id) => {
        var selectCount = this.props.selectCount;
        if (selectCount == 0) return;
        var isSubmit = false;
        this.setState((state) => {
            var choosedItem = state.choosedItem;
            var selected = state.selected;
            var choosedCount = Object.keys(choosedItem).length;
            if (choosedCount >= selectCount) {
                choosedCount = 0;
                choosedItem = {};
                selected.forEach((value, key, map) => {
                    value ? map.set(key, false) : null
                })
            }
            choosedItem[id] = true;
            selected.set(id, true);
            if (choosedCount + 1 == selectCount) {
                isSubmit = true;
            }
            return { choosedItem: choosedItem, selected: selected }
        }, () => {
            isSubmit && this.props.onSendAction(Object.keys(this.state.choosedItem));
        });
    };
    _renderItem = ({ item, index }) => (
        <CircleItem
            id={item.id}
            onPressItem={this._onPressItem}
            selected={!!this.state.selected.get(item.id)}
            name={item.name}
            avatar_url={item.avatar_url}
            isWolf={true}
            isCouple={this.props.myCoupleID == item.id}

            voteCount={Object.values(this.props.voteList).filter(uid => uid == item.id).length}
            isWolf={this.props.wolfsID.indexOf(item.id) != -1}
            showWolf={this.props.userIsWolf}
        />
    );
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    horizontal={true}
                    data={this.props.chatRoomUsers}
                    extraData={this.props.voteList}
                    keyExtractor={(m, index) => `CircleItem[${index}]`}
                    renderItem={this._renderItem}
                    style={{ paddingLeft: 5, paddingRight: 5 }}
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopColor: '#e3e3e3',
        marginTop: 5,
        marginBottom: 5,
    },
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowFlex: {
        flexDirection: 'row',
        flex: 1
    }
});
