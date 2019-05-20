import React from 'react';
import { Platform, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { createStackNavigator, 
         createAppContainer,
         createBottomTabNavigator } from 'react-navigation';

import Login from './Login.js';
import BuySellPage from './BuySellPage.js';
import Loading from './Loading.js';
import SignUp from './SignUp.js';
import Wallet from './Wallet.js';
import News from './News.js';

const AppNavigator = createStackNavigator(
    {
        Login: { 
          screen: Login, 
          navigationOptions: {
            headerBackTitle: "Login",
          }
        },
        Dashboard: { 
          screen: createBottomTabNavigator({
            News: {
              screen: News,
              navigationOptions: {
                title: 'News',
                headerLeft: null,
              },
            },
            Wallet: {
              screen: createStackNavigator({
                Main: {
                  screen: Wallet,
                  navigationOptions: {
                    title: 'My Wallet',
                    headerLeft: null,
                  }
                },
                Loading: {
                  screen: Loading,
                  navigationOptions: {
                    headerBackTitle: null,
                    headerLeft: null,
                  }
                },
                BuySellPage: {
                  screen: BuySellPage,
                },
              },
              { headerMode: 'none' }
              ),
              navigationOptions: {
                headerMode: 'none',
              }
            },
          }),
          navigationOptions: {
            headerMode: 'none',
            headerLeft: null,
          }
        },
        SignUp: { 
          screen: SignUp, 
        },
    },
    {
        initialRouteName: 'Login',
    }
);

export default createAppContainer(AppNavigator);

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
