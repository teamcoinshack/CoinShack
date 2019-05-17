import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import Firebase from 'firebase';
import db from './Database.js';

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleSignUp = (email, pass) => {
    success = true;
    Firebase.auth()
            .createUserWithEmailAndPassword(email, pass)
            .catch(function(error) {
              success = false;
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/invalid-email') {
                alert('Invalid email')
              } else {
                alert(errorCode);
              }
            })
            .then(function(success) {
              if (success) {
                alert("Account created successfully");
                var id = Firebase.auth().currentUser.uid;
                db.initUser(id);
              }
            })
            .then(success => (
              this.props.navigation.navigate('BuySellPage', {
                uid: Firebase.auth().currentUser.uid 
              })
            ));
  }

  render() {
      return (
        <View style={styles.container}>
          <Text>Sign Up</Text>
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
