import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import Firebase from 'firebase';
import db from '../Database.js';

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleSignUp = (email, pass) => {
    success = true;
    Firebase.auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(() => (
                db.initUser(Firebase.auth().currentUser.uid)
            ))
            .then(() => (
              this.props.navigation.navigate('News')
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
          <Text style={{ fontSize: 25 }}>Sign Up</Text>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Button 
            title="Sign Up" 
            onPress={() =>
              this.handleSignUp(
                this.state.email, 
                this.state.password
              )
            } 
          />
          <Button
            title="Already have an account? Login"
            onPress={() => this.props.navigation.navigate('Login')}
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
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginTop: 8,
    textAlign: 'center',
    borderColor: 'green',
    borderRadius: 20,
  }
})
