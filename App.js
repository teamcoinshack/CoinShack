import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Navigator from './Navigator.js';
import BuySellPage from './BuySellPage.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: 1,        
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {/* <BuySellPage/> */}
                <Navigator id={this.state.route} />
            </View>
        );
    }
}

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
});
