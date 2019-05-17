import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import Firebase from 'firebase';

export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  async handleSignUp(email, pass) {
    try {
      await Firebase.auth()
                    .createUserWithEmailAndPassword(
                      email,
                      pass
                    );
      this.props.navigation.navigate('BuySellPage');
    } catch (error) {
      console.log(error.toString());
    }
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
