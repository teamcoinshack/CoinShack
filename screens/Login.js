import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import db from '../config.js';
import Firebase from 'firebase';
import q from '../Query.js';

//Login credentials
//User: admin@gmail.com
//Pass: Test123

const background = '#373b48';

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = (email, pass) => {
    success = true;
    Firebase.auth()
            .signInWithEmailAndPassword(email, pass)
            .then(() => (
              this.props.navigation.navigate('Dashboard')
            ))
            .catch(function(error) {
              success = false;
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/wrong-password') {
                alert('Incorrect password.');
              } else if (errorCode === 'auth/invalid-email') {
                alert('Invalid email! Have you signed up?');
              } else if (errorCode === 'auth/user-not-found'){
                alert('User not found. Have you signed up?');
              }
            })
  }

  goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ 
          fontSize: 25, 
          color: '#ffffff', 
          fontWeight: 'bold' 
        }}>
          CoinShack
        </Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#999999"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="#999999"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button 
          title="Login" 
          onPress={
            () => this.handleLogin(
              this.state.email.trim(), 
              this.state.password
            )
          } 
        />
        <Button
          title="Don't have an account? Sign Up"
          onPress={this.goToSignUp}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  textInput: {
    color: '#ffffff',
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginTop: 8,
    textAlign: 'center',
    borderColor: 'green',
    borderRadius: 20,
  }
})
