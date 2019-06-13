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
import InternalWebpage from './InternalWebpage.js';

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
  }},
  {
    initialRouteName: 'Main',
  }
)

const newsStack = createStackNavigator({
  News: {
    screen: News,
    navigationOptions: {
      title: 'News',
      headerStyle: {
        backgroundColor: '#212121',
      },
      headerTitleStyle: {
        color: '#ffffff',
      }
    }
  },
  InternalWebpage: {
    screen: InternalWebpage,
    navigationOptions: {
      title: 'News',
      headerStyle: {
        backgroundColor: '#212121',
      },
      headerTitleStyle: {
        color: '#ffffff',
      }
    }
  }
})

const marketStack = createStackNavigator({
  Market: {
    screen: Market,
    navigationOptions: {
      title: 'Market'
    }
  },
})

const settingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings'
    }
  },
})

const tabs = createBottomTabNavigator({
    News: {
      screen: newsStack,
      navigationOptions: {
        title: 'News',
        headerLeft: null,
      },
    },
    Market: {
      screen: marketStack,
      navigationOptions: {
        title: 'Market',
        headerLeft: null,
      },
    },
    Wallet: {
      screen: walletStack,
      navigationOptions: {
        title: 'Wallet',
        headerVisible: false,
      },
    },
    Settings: {
      screen: settingsStack,
      navigationOptions: {
        title: 'Settings',
        headerLeft: null,
      },
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
            header: null,
          }
        },
        Dashboard: { 
          screen: tabs,
          tabBarOptions: {
            fontSize: 10,
          },
        },
        SignUp: { 
          screen: SignUp, 
          navigationOptions: {
            header: null,
          }
        },
    },
    {
      headerMode: 'none',
      initialRouteName: 'Login',
    },
);

export default createAppContainer(AppNavigator);
