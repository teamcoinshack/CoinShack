import React from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight
} from 'react-native';

import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  withNavigationFocus,
  HeaderBackButton,
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
import Info from './screens/Info.js';

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
      },
      headerTintColor: '#ffffff',
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
      },
      headerTintColor: '#ffffff',
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
      },
      headerTintColor: '#ffffff',
    }
  }
},
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
        },
        headerTintColor: '#ffffff',
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
        },
        headerTintColor: '#ffffff',
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
      },
      headerTintColor: '#ffffff',
    }
  },
  Info: {
    screen: Info,
    navigationOptions: {
      title: 'Market',
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      },
      headerTintColor: '#ffffff',
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
      },
      headerTintColor: '#ffffff',
    }
  },
})

const tabs = createBottomTabNavigator(
  {
    News: {
      screen: newsStack,
      navigationOptions: {
        title: 'News',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="newspaper"
            size={24}
            color={tintColor}
          />
        ),
      },
    },
    Market: {
      screen: marketStack,
      navigationOptions: {
        title: 'Market',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="store"
            size={24}
            color={tintColor}
          />
        ),
      },
    },
    Wallet: {
      screen: walletStack,
      navigationOptions: {
        title: 'Wallet',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="wallet"
            size={24}
            color={tintColor}
          />
        ),
      },
    },
    Settings: {
      screen: settingsStack,
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="settings"
            size={24}
            color={tintColor}
          />
        ),
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
      },
      style: {
        height: 64,
      },
      tabStyle: {
        alignItems: 'center',
        padding: 5,
      },
      safeAreaInset: {
        bottom: 'never',
        top: 'never',
      },
      showIcon: true
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
