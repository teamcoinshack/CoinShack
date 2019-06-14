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

import Login from './screens/Login.js';
import BuySellPage from './screens/BuySellPage.js';
import SignUp from './screens/SignUp.js';
import Wallet from './screens/Wallet.js';
import News from './screens/News.js';
import Market from './screens/Market.js';
import Settings from './screens/Settings.js';
import Buy from './screens/Buy.js';
import Sell from './screens/Sell.js';
import InternalWebpage from './screens/InternalWebpage.js';

const background = '#373b48';

const walletStack = createStackNavigator({
  Main: {
    screen: Wallet,
    navigationOptions: {
      title: 'My Wallet',
      headerLeft: null,
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      },
      headerBackTitle: null,
      headerTintColor: '#ffffff',
    }
  },
  BuySellPage: {
    screen: BuySellPage,
    navigationOptions: {
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      }
    },
  },
  Buy: {
    screen: Buy,
    navigationOptions: {
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      }
    }
  },
  Sell: {
    screen: Sell,
    navigationOptions: {
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      }
    }
  }},
  {
    initialRouteName: 'Main',
  }
)

const newsStack = createStackNavigator(
  {
    News: {
      screen: News,
      navigationOptions: {
        title: 'News',
        headerStyle: {
          backgroundColor: background,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontSize: 20,
        }
      }
    },
    InternalWebpage: {
      screen: InternalWebpage,
      navigationOptions: {
        title: 'News',
        headerStyle: {
          backgroundColor: background,
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontSize: 20,
        }
      }
    },
  },
  {
    navigationOptions: {
      header: {
        style: {
          elevation: 0,
          shadowOpacity: 0,
        },
      },
    },
  }
)

const marketStack = createStackNavigator({
  Market: {
    screen: Market,
    navigationOptions: {
      title: 'Market',
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      }
    }
  },
})

const settingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      }
    }
  },
})

const tabs = createBottomTabNavigator({
    News: {
      screen: newsStack,
      navigationOptions: {
        title: 'News',
      },
    },
    Market: {
      screen: marketStack,
      navigationOptions: {
        title: 'Market',
      },
    },
    Wallet: {
      screen: walletStack,
      navigationOptions: {
        title: 'Wallet',
      },
    },
    Settings: {
      screen: settingsStack,
      navigationOptions: {
        title: 'Settings',
      },
    }
  },
  {
    initialRouteName: 'News',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#ffffff',
      inactiveTintColot: '#a8a8a8',
      activeBackgroundColor: background,
      inactiveBackgroundColor: '#000000',
      labelStyle: {
        fontSize: 15,
        justifyContent: 'center',
        paddingBottom: 15,
      },
      safeAreaInset: {
        bottom: 'never',
        top: 'never',
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
