import React from 'react';
import { Platform, 
         StyleSheet, 
         Text, 
         View, 
         Button, 
         TextInput, 
         TouchableHighlight } from 'react-native';
import { createStackNavigator, 
         createAppContainer,
         createBottomTabNavigator,
         withNavigationFocus,
         HeaderBackButton, } from 'react-navigation';

import Login from './Login.js';
import BuySellPage from './BuySellPage.js';
import SignUp from './SignUp.js';
import Wallet from './Wallet.js';
import News from './News.js';
import Market from './Market.js';
import Settings from './Settings.js';
import Buy from './Buy.js';
import Sell from './Sell.js';

const walletStack = createStackNavigator({
  Main: {
    screen: Wallet,
    navigationOptions: {
      title: 'My Wallet',
      headerLeft: null,
    }
  },
  BuySellPage: {
    screen: BuySellPage,
  },
  Buy: {
    screen: Buy,
  },
  Sell: {
    screen: Sell,
  },
})

const tabs = createBottomTabNavigator({
    News: {
      screen: News,
      navigationOptions: {
        title: 'News',
      },
    },
    Market: {
      screen: Market,
    },
    Wallet: {
      screen: walletStack,
      headerMode: 'none',
      navigationOptions: {
        header: null,
      }
    },
    Settings: {
      screen: Settings,
    }
  },
  {
    initialRouteName: 'News',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      labelStyle: {
        fontSize: 25,
      }
    }
  },
);

const AppNavigator = createStackNavigator(
    {
        Login: { 
          screen: Login, 
          navigationOptions: {
            headerBackTitle: "Login",
            headerMode: 'none',
          }
        },
        Dashboard: { 
          screen: tabs,
          navigationOptions: {
            headerMode: 'none',
            headerLeft: null,
          },
          tabBarOptions: {
            fontSize: 10,
          },
        },
        SignUp: { 
          screen: SignUp, 
          navigationOptions: {
            headerMode: 'none',
          }
        },
    },
    {
      initialRouteName: 'Login',
    },
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
