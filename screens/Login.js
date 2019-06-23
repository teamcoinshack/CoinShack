import React from 'react';
import {
  TextInput, 
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  Alert,
} from 'react-native';
import MyButton from '../components/MyButton.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
import config from '../config.js';
import db from '../Database.js';
import Firebase from 'firebase';

//Login credentials
//User: admin@gmail.com
//Pass: Test123

const background = '#373b48';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: null
    }

    this.googleProvider = new Firebase.auth.GoogleAuthProvider();
    GoogleSignin.configure();
  }

  handleFbLogin = () => {
    LoginManager
      .logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
      .then(result => {
        if (result.isCancelled) {
          Alert.alert("Sign in cancelled", "Please try again!");
        } else {
          AccessToken
            .getCurrentAccessToken()
            .then(data => {
              const credential = Firebase
                .auth
                .FacebookAuthProvider
                .credential(data.accessToken);
              return Firebase
                .auth()
                .signInWithCredential(credential);
            })
            .then(result => {
              if (result.additionalUserInfo.isNewUser) {
                db.initUser(result.user.uid);
              }
            })
            .then(() => this.props.navigation.navigate('Dashboard'))
            .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              // TODO: handle fb login errors
              Alert.alert("Login failed", errorMessage);
            })
        }
      })
  }

  handleGoogleLogin = () => {
    GoogleSignin
      .signIn()
      .then(data => {
        const credential = Firebase
          .auth
          .GoogleAuthProvider
          .credential(data.idToken, data.accessToken)
        return Firebase
          .auth()
          .signInWithCredential(credential);
      })
      .then(result => {
        if (result.additionalUserInfo.isNewUser) {
          db.initUser(result.user.uid);
        }
      })
      .then(() => this.props.navigation.navigate('Dashboard'))
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // TODO: handle google login errors
        Alert.alert("Login failed", errorMessage);
      })
  }

  handleLogin = (email, pass) => {
    Firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => (
        this.props.navigation.navigate('Dashboard')
      ))
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Incorrect password.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('Invalid email! Have you signed up?');
        } else if (errorCode === 'auth/user-not-found') {
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
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 25, 
            color: '#ffffff', 
            fontWeight: 'bold' 
          }}>
            CoinShack
          </Text>
        </View>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="#999999"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor="#999999"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', }}>
          <MyButton
            text="Login"
            onPress={() => this.handleLogin(
              this.state.email.trim(),
              this.state.password
            )}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
          <MyButton
            text="Facebook Login"
            onPress={this.handleFbLogin}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
          <MyButton
            text="Google Login"
            onPress={this.handleGoogleLogin}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
          <MyButton
            text="Sign Up"
            onPress={this.goToSignUp}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.5}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
})
