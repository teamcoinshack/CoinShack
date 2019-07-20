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
import db from '../Database.js';

const background = '#373b48';

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
    }
    this.resetPassword = this.resetPassword.bind(this);
  }

  async resetPassword() {
    try {
      const isEmail = this.state.username.includes('@');
      const email = await db.searchExact(this.state.username, isEmail);
      if (email) {
        await Firebase.auth()
                .sendPasswordResetEmail(email);
        alert('Check your email to reset your password');
        this.props.navigation.navigate('Login');
      } else {
        alert('Unable to find user');
      }
    } catch(error) {
      console.log(error);
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
            Forgot your password? 
            </Text>
        </View>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}

        <View style={{ alignItems: "center" }}>
          <MyInput
            placeholder="Username/Email"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            leftIconName="emoticon-outline"
          />
        </View>

        <MyButton
          text="Reset My Password"
          onPress={this.resetPassword}
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
