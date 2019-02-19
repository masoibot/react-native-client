import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';

export default class LightButton extends PureComponent {
    render() {
        const direction = this.props.vertical ? (
            this.props.reverse ? styles.colReverse : styles.colFlex
        ) : (
                this.props.reverse ? styles.rowReverse : styles.rowFlex
            )
        return (
            <TouchableOpacity style={{ ...this.props.style, marginLeft: 2, marginRight: 2 }} onPress={this.props.onPress}>
                <View style={{ ...direction, ...styles.ItemCenter }}>
                    <Icon type={this.props.iconType} name={this.props.iconName} style={{ color: this.props.color, marginRight: this.props.vertical ? 0 : 5 }} />
                    <Text style={{ color: this.props.color }}>{this.props.text}</Text>
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
