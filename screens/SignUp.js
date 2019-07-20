import React, { Component } from 'react'
import {
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  Alert,
} from 'react-native';
import Firebase from 'firebase';
import MyInput from "../components/MyInput.js";

const background = '#373b48';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      email: '', 
      password: '',
      confirmPassword: '',
      errorMessage: null 
    }
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async handleSignUp(email, pass, confirmPass, username) {
    if (pass !== confirmPass) {
      Alert.alert("Password Mismatch!", "Please try again.");
      return;
    }

    try {
      await Firebase.auth()
                    .createUserWithEmailAndPassword(email, pass)
      this.props.navigation.navigate('Login');
      Firebase.auth().currentUser.isNew = true;
      Firebase.auth().currentUser.username = username;
      const user = Firebase.auth().currentUser;
      await user.sendEmailVerification(); 
      alert('We\'ve sent a verification link to ' + email);
    } catch (error) {
       var errorCode = error.code;
       var errorMessage = error.message;
       if (errorCode === 'auth/invalid-email') {
         alert('Invalid email')
       } else {
         alert(errorCode);
       }
    }
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

        <View style={{ alignItems: "center" }}>
          <MyInput
            placeholder="Username"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            leftIconName="emoticon-outline"
          />

          <MyInput
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            keyboardType="email-address"
            leftIconName="email-outline"
          />

          <MyInput
            secureTextEntry
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            leftIconName="lock-outline"
          />

          <MyInput
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            value={this.state.confirmPassword}
            leftIconName="lock-outline"
          />
        </View>

        <MyButton
          text="Sign Up"
          onPress={() =>
            this.handleSignUp(
              this.state.email,
              this.state.password,
              this.state.confirmPassword,
              this.state.username,
            )
          }
          textColor="#00f9ff"
          width={Math.round(Dimensions.get('window').width) * 0.7}
        />

        <MyButton
          text="Back to Login"
          onPress={() => this.props.navigation.navigate('Login')}
          textColor="#00f9ff"
          width={Math.round(Dimensions.get('window').width) * 0.7}
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
})
