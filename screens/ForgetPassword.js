import React, { Component } from 'react'
import {
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
} from 'react-native';
import Firebase from 'firebase';
import MyErrorModal from '../components/MyErrorModal.js';
import MyInput from "../components/MyInput.js";
import db from '../Database.js';

const background = '#373b48';

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      username: '',

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.resetPassword = this.resetPassword.bind(this);
  }

  async resetPassword() {
    try {
      const isEmail = this.state.username.includes('@');
      const email = await db.searchExact(this.state.username, isEmail);
      if (email) {
        await Firebase.auth()
                .sendPasswordResetEmail(email);
        this.setState({
          isErrorVisible: true,
          errorTitle: "Password reseted",
          errorPrompt: 'Check your email to reset your password.'
        });
        this.props.navigation.navigate('Login');
      } else {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Password reset failed",
          errorPrompt: 'Unable to find user, please try again.'
        });
      }
    } catch (error) {
      this.setState({
        isErrorVisible: true,
        errorTitle: "Error",
        errorPrompt: error.message,
      });
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MyErrorModal
          visible={this.state.isErrorVisible}
          close={() => this.setState({ isErrorVisible: false })}
          title={this.state.errorTitle}
          prompt={this.state.errorPrompt}
        />

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
