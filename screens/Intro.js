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

const slides = [
  {
    key: '1',
    image: require('../assets/intro/news.png'),
  },
  {
    key: '2',
    image: require('../assets/intro/market.png'),
  },
  {
    key: '3',
    image: require('../assets/intro/wallet.png'),
  },
  {
    key: '4',
    image: require('../assets/intro/profile.png'),
  },
];

export default class Intro extends React.Component {
  _renderItem = (item) => {
    return (
      <View style={styles.slide}>
        <View style={{ flex: 1 }}>
          <Image 
            style={{
              height: Math.round(Dimensions.get('window').height),
              width: Math.round(Dimensions.get('window').width),
            }}
            source={item.image} 
          />
        </View>
      </View>
    );
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    Firebase.auth().currentUser.isNew = false;
    this.props.navigation.navigate('News');
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  }
})
