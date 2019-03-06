import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Icon, Thumbnail } from 'native-base'

export default class LightListItem extends PureComponent {
    render() {
        return (
            <TouchableOpacity style={{ ...this.props.style }} onPress={this.props.onPress}>
                <View style={{...styles.rowFlex, marginLeft: 10, marginRight: 10}}>
                    {
                        this.props.iconName ? (<Icon name={this.props.iconName} type={this.props.iconType} />) : null
                    }
                    {
                        this.props.thumbnail ? (<Thumbnail small source={{ uri: this.props.thumbnail }} />) : null
                    }
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <View><Text>{this.props.title}</Text></View>
                        <View><Text>{this.props.subTitle}</Text></View>
                    </View>
                    <View>
                        <View><Text>{this.props.moreTitle}</Text></View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    rowFlex: {
        flexDirection: 'row',
    },
    rowReverse: {
        flexDirection: 'row-reverse',
    },
    colFlex: {
        flexDirection: 'column'
    },
    colReverse: {
        flexDirection: 'column-reverse'
    },
    ItemCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
