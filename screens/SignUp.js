import React, { Component } from 'react'
import {
  TextInput, 
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  Alert,
} from 'react-native';
import Firebase from 'firebase';
import db from '../Database.js';

const background = '#373b48';
export default class SignUp extends Component {
  state = { 
    username: '',
    email: '', 
    password: '', 
    errorMessage: null 
  }

  handleSignUp = (email, pass, username) => {
    success = true;
    Firebase.auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(() => {
              Firebase.auth().currentUser.isNew = true;
              db.initUser(Firebase.auth().currentUser.uid, username)
            })
            .then(() => (
              this.props.navigation.navigate('Intro')
            ))
            .catch((error) => {
              success = false;
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/invalid-email') {
                alert('Invalid email')
              } else {
                alert(errorCode);
              }
            })
  }

  render() {
      return (
        <View style={styles.container}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 25, 
              color: '#ffffff', 
              fontWeight: 'bold' 
            }}>
            Sign Up
            </Text>
          </View>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder=" Username"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder=" Email"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={username => this.setState({ username })}
              value={this.state.user}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              secureTextEntry
              placeholder=" Password"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
          <MyButton
            text="Sign Up"
            onPress={() =>
              this.handleSignUp(
                this.state.email, 
                this.state.password
              )
            } 
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
          <MyButton
            text="Back to Login"
            onPress={() => this.props.navigation.navigate('Login')}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
        </View>
      )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  inputContainer: {
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    width: Math.round(Dimensions.get('window').width) * 0.7,
    alignItems: 'center',
    marginBottom: 6,
  },
  textInput: {
    elevation: 1,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    height: 60,
    width: Math.round(Dimensions.get('window').width) * 0.7,
    textAlign: 'left',
    fontSize: 20,
    color: '#ffffff',
  },
})
