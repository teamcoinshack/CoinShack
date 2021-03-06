import React, { Component } from 'react'
import {
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
} from 'react-native';
import Firebase from 'firebase';
import MyInput from "../components/MyInput.js";
import MyErrorModal from '../components/MyErrorModal.js';
import db from '../Database.js';

const background = '#373b48';

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      username: '',
      email: '', 
      password: '',
      confirmPassword: '',
      callback: null,
      loading: false,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const callback = navigation.getParam('callback', null);
    this.setState({
      callback: callback,
    })
  }

  async handleSignUp(email, pass, confirmPass, username) {
    if (pass !== confirmPass) {
      this.setState({
        isErrorVisible: true,
        errorTitle: "Password Mismatch!",
        errorPrompt: "Please try again.",
      });
      return;
    }
    const unique = await db.uniqueUsername(null, username); 
    if (!unique) {
      this.setState({
        isErrorVisible: true,
        errorTitle: "Username Taken!",
        errorPrompt: "Please use another username.",
      });
      return;
    }

    try {
      this.setState({
        loading: true,
      });
      await Firebase.auth()
                    .createUserWithEmailAndPassword(email, pass)
      Firebase.auth().currentUser.isNew = true;
      Firebase.auth().currentUser.username = username;
      const user = Firebase.auth().currentUser;
      await user.sendEmailVerification();
      this.props.navigation.navigate('Login');
      this.state.callback(email);
      this.setState({
        loading: false,
      });
    } catch (error) {
       var errorCode = error.code;
       var errorMessage = error.message;
       switch (errorCode) {
        case "auth/email-already-in-use":
          this.setState({
            isErrorVisible: true,
            errorTitle: "Sign up failed",
            errorPrompt: "Account associated with that email already exists, please login!",
            loading: false,
          });
          break;

        case "auth/invalid-email":
          this.setState({
            isErrorVisible: true,
            errorTitle: "Sign up failed",
            errorPrompt: "Invalid email, please use another email!",
            loading: false,
          });
          break;

        case "auth/weak-password":
          this.setState({
            isErrorVisible: true,
            errorTitle: "Sign up failed",
            errorPrompt: "Weak password! please use a stronger password.",
            loading: false,
          });
          break;

        default:
          this.setState({
            isErrorVisible: true,
            errorTitle: "Login failed",
            errorPrompt: errorMessage,
            loading: false,
          });
          break;
      }
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
            Sign Up
            </Text>
        </View>

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

        {this.state.loading
          ? (
              <MyBar
                height={65}
                width={Math.round(Dimensions.get('window').width)}
              />
            )
          : (
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
            )}

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
