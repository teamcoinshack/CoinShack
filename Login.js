import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import db from './config.js';
import Firebase from 'firebase';
//Login credentials
//User: admin@gmail.com
//Pass: Test123

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = (email, pass) => {
    success = true;
    Firebase.auth()
            .signInWithEmailAndPassword(email, pass)
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
            .then(success => (
              success ? this.props.navigation.navigate('Loading', 
                          {uid: Firebase.auth().currentUser.uid,}
                        )
                      : null
            ));
  }

  goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button 
          title="Login" 
          onPress={
            () => this.handleLogin(
              this.state.email, 
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
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})
