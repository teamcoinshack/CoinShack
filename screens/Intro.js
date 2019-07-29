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
    header: "Welcome to CoinShack!",
    content1: "A risk-free simulator for anyone to learn to trade cryptocurrency!",
    content2: "With our app, you will receive free virtual currency for you to start trading with real-time market data for numerous cryptocurrencies without any risk involved!",
    content3: "Swipe to learn more about cryptocurrency trading and our simulator system."
  },
  {
    key: '1',
    header: "Quickstart Guide",
    content1: "You just received $10,000 worth of in game cash for you to purchase any cryptocurrency coins!",
    content2: "The in game cash and prices of coins are based on real-time USD rates. You can see the amount of cash and cryptocurrencies you own and trade them in the Wallet tab.",
    content3: "You can also look at the trends of the different cryptocurrencies in the Market tab. Stay updated to the latest news in the News tab and compete with your friends in the Social tab. Happy trading!"
  },
];
  // {
  //   key: '1',
  //   isImage: true,
  //   image: require('../assets/intro/wallet.png'),
  // },
  // {
  //   key: '2',
  //   isImage: true,
  //   image: require('../assets/intro/market.png'),
  // },
  // {
  //   key: '3',
  //   isImage: true,
  //   image: require('../assets/intro/news.png'),
  // },
  // {
  //   key: '4',
  //   isImage: true,
  //   image: require('../assets/intro/profile.png'),
  // },
  // {
  //   key: '5',
  //   isImage: true,
  //   image: require('../assets/intro/social.png'),
  // },


export default class Intro extends React.Component {
  _renderItem = item => (
    <View style={styles.welcome}>
      <Image
        source={require('../assets/icons/CoinShackIcon.png')}
        style={{
          height: 100,
          width: 100,
          margin: 10
        }}
      />
      <Text style={styles.header}>{item.header}</Text>
      <Text style={styles.content}>{item.content1}</Text>
      <Text style={styles.content}>{item.content2}</Text>
      <Text style={styles.content}>{item.content3}</Text>
    </View>
  );

  // _renderItem = item => {
  //   if (item.isImage) {
  //     return (
  //       <View style={styles.slide}>
  //         <Image 
  //           resizeMode="contain"
  //           style={{
  //             height: Dimensions.get('window').height,
  //             width: Dimensions.get('window').width,
  //           }}
  //           source={item.image} 
  //         />
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View style={styles.welcome}>
  //         <Image
  //           source={require('../assets/icons/CoinShackIcon.png')}
  //           style={{
  //             height: 100,
  //             width: 100,
  //             margin: 10
  //           }}
  //         />
  //         <Text style={styles.header}>
  //           Welcome to CoinShack!
  //         </Text>
  //         <Text style={styles.content}>
  //           A risk-free simulator for anyone to learn to trade cryptocurrency!
  //         </Text>
  //         <Text style={styles.content}>
  //           With our app, you will receive free virtual currency for you to start trading with real-time market data for numerous cryptocurrencies without any risk involved!
  //         </Text>
  //         <Text style={styles.content}>
  //           Swipe to learn more about cryptocurrency trading and our simulator system.
  //         </Text>
  //       </View>
  //     );
  //   }
  // }

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
