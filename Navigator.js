import React from 'react';
<<<<<<< HEAD
import {Platform, StyleSheet, Text, View, Button, TextInput} from 'react-native';
import Login from './Login.js';
=======
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';

import BuySellPage from './BuySellPage.js';
>>>>>>> 5daf964185c9364eb3cd2107ba9c2841c2d65631

class Navigator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            user: '',
            pass: '',
        }
    }

    loginSuccess = () => {
        this.setState(prevState => ({
            id: prevState.id === 1 ? 2 : 1,
        }))
    }

    render() {
        if (this.state.id === 1) {
            return (
                <Login />
            );
        } else if (this.state.id === 2) {
            return (
                <BuySellPage />
<<<<<<< HEAD
=======
                // <Text style={styles.welcome}>Insert graph here</Text>
>>>>>>> 5daf964185c9364eb3cd2107ba9c2841c2d65631
            );
        }
    }
}

export default Navigator

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
  textBox: {
    fontSize: 20,
  },
});
