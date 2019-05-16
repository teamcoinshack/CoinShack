import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Navigator from './Navigator.js';

export default class App extends React.Component {

    render() {
        return (
            <Navigator />
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
