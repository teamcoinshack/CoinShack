import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Firebase from 'firebase';
import { background, textHeader, textSubheader } from '../Masterlist';

const slides = [
  {
    key: '0',
    isImage: false,
    image: require('../assets/intro/wallet.png'),
  },
  {
    key: '1',
    isImage: true,
    image: require('../assets/intro/wallet.png'),
  },
  {
    key: '2',
    isImage: true,
    image: require('../assets/intro/market.png'),
  },
  {
    key: '3',
    isImage: true,
    image: require('../assets/intro/news.png'),
  },
  {
    key: '4',
    isImage: true,
    image: require('../assets/intro/profile.png'),
  },
  {
    key: '5',
    isImage: true,
    image: require('../assets/intro/social.png'),
  },
];

export default class Intro extends React.Component {
  _renderItem = item => {
    if (item.isImage) {
      return (
        <View style={styles.slide}>
          <Image 
            resizeMode="contain"
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            }}
            source={item.image} 
          />
        </View>
      );
    } else {
      return (
        <View style={styles.welcome}>
          <Image
            source={require('../assets/icons/CoinShackIcon.png')}
            style={{
              height: 100,
              width: 100,
              margin: 10
            }}
          />
          <Text style={styles.header}>
            Welcome to CoinShack!
          </Text>
          <Text style={styles.content}> {/* hol can you do the short write up for this part lmao how to trade crypto */}
            Cryptocurrency trading is easy! Just buy low and sell high! Our prices are real time! Learn as you trade!
          </Text>
          <Text style={styles.content}>
            Swipe to take a quick tour of our app!
          </Text>
        </View>
      );
    }
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    Firebase.auth().currentUser.isNew = false;
    this.props.navigation.navigate('Dashboard');
  }

  render() {
    return (
      <AppIntroSlider 
        renderItem={this._renderItem} 
        slides={slides} 
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={this._onDone}
        showSkipButton
      />
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  welcome: {
    backgroundColor: background,
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
  },
  header: {
    textAlign: 'center',
    color: textHeader,
    fontSize: 22,
    fontWeight: "600"
  },
  content: {
    textAlign: 'center',
    color: textSubheader,
    fontSize: 18,
    margin: 10,
  }
})
