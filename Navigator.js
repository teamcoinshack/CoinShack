import React from 'react';
import { Platform, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Login from './Login.js';
import BuySellPage from './BuySellPage.js';
import Loading from './Loading.js';

const AppNavigator = createStackNavigator(
    {
        Login: { screen: Login },
        BuySellPage: { screen: BuySellPage },
        Loading: { screen: Loading },
    },
    {
        intialRouteName: 'Loading',
    }
);

const Navigator = createAppContainer(AppNavigator);

/*
export default class Navigator extends React.Component {
    render() {
        return (
            <AppNavigator />
        );
    }
}
*/

export default Navigator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    textBox: {
        fontSize: 20,
    },
});
