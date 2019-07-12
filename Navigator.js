import React from 'react';
import { TouchableOpacity } from 'react-native';

import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  withNavigationFocus,
  HeaderBackButton,
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BellIcon from 'react-native-vector-icons/Entypo';

import Login from './screens/Login.js';
import BuySellPage from './screens/BuySellPage.js';
import SignUp from './screens/SignUp.js';
import Wallet from './screens/Wallet.js';
import News from './screens/News.js';
import Market from './screens/Market.js';
import Profile, {toSettings} from './screens/Profile.js';
import Buy from './screens/Buy.js';
import Sell from './screens/Sell.js';
import InternalWebpage from './screens/InternalWebpage.js';
import Info from './screens/Info.js';
import Settings from './screens/Settings.js';
import History from './screens/History.js';
import ChangePassword from './screens/ChangePassword.js';
import Intro from './screens/Intro.js';
import Social from './screens/Social.js';
import Search from './screens/Search.js';
import FriendsProfile from './screens/FriendsProfile.js';
import Requests from './screens/Requests.js';

const background = '#373b48';

const headerStyles = {
  headerStyle: {
    backgroundColor: background,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: '#ffffff',
    fontSize: 20,
  },
  headerTintColor: '#ffffff',
};

const walletStack = createStackNavigator({
  Main: {
    screen: Wallet,
    navigationOptions: ({ navigation }) => ({
      title: 'Wallet',
      headerLeft: null,
      headerBackTitle: null,
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate('History')} 
        >
          <Icon
            name="notebook"
            size={24}
            color={'#ffffff'}
          />
        </TouchableOpacity>
      ),
      ...headerStyles,
    })
  },
  History: {
    screen: History,
    navigationOptions: {
      title: 'History',
      ...headerStyles,
    },
  },
  BuySellPage: {
    screen: BuySellPage,
    navigationOptions: {
      title: 'Trade',
      ...headerStyles,
    },
  },
  Buy: {
    screen: Buy,
    navigationOptions: headerStyles,
  },
  Sell: {
    screen: Sell,
    navigationOptions: headerStyles,
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
      navigationOptions: ({ navigation }) => ({
        title: 'News',
        headerRight: (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={navigation.getParam('toggleFilter', null)} 
          >
            <Icon
              name="filter-variant"
              size={24}
              color={'#ffffff'}
            />
          </TouchableOpacity>
        ),        
        ...headerStyles,
      })
    },
    InternalWebpage: {
      screen: InternalWebpage,
      navigationOptions: headerStyles,
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

const socialStack = createStackNavigator({
  Social: {
    screen: Social,
  },
  Requests: {
    screen: Requests,
    navigationOptions: {
      title: 'Requests',
      ...headerStyles,
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Search',
      ...headerStyles,
    }
  },
  FriendsProfile: {
    screen: FriendsProfile,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('friendName', 'Bob'),
      ...headerStyles,
    })
  },
})

const marketStack = createStackNavigator({
  Market: {
    screen: Market,
    navigationOptions: {
      title: 'Market',
      ...headerStyles,
    }
  },
  Info: {
    screen: Info,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('coin', 'Market'), 
      ...headerStyles,
    })
  },
})

const profileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate('Settings')} 
        >
          <Icon
            name="settings"
            size={24}
            color={'#ffffff'}
          />
        </TouchableOpacity>
      ),
      ...headerStyles,
    })
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
      ...headerStyles,
    }
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      title: 'Settings',
      ...headerStyles,
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
    Social: {
      screen: socialStack,
      navigationOptions: {
        title: 'Social',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="earth"
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
    Profile: {
      screen: profileStack,
      navigationOptions: {
        title: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="human-greeting"
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
        marginBottom: 12,
      },
      style: {
        height: 75,
      },
      tabStyle: {
        alignItems: 'center',
        padding: 5,
      },
      safeAreaInset: {
        bottom: 'never',
        top: 'never',
        margin: 10,
      },
      showIcon: true,
      // keyboardHidesTabBar: true,
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
    Intro: {
      screen: Intro,
      navigationOptions: {
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
