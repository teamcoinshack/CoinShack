import React, { Component } from 'react';
import {
  Image,
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  Alert,
} from 'react-native';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
import config from '../config.js';
import db from '../Database.js';
import Firebase from 'firebase';

// Login credentials
// User: admin@gmail.com
// Pass: Test123

const background = '#373b48';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: null
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.googleProvider = new Firebase.auth.GoogleAuthProvider();
    
    GoogleSignin.configure({
      webClientId: "1059449383508-6hmi3fhfdqsjnp5tdklnjtfhob9st2k6.apps.googleusercontent.com",
    });

    Firebase.auth().onAuthStateChanged(user => {
      if (user && !user.isNew) {
        // User is signed in
        this.props.navigation.navigate('Dashboard');
      }
    });
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
                Firebase.auth().currentUser.isNew = true;
                db.initUser(
                  Firebase.auth().currentUser,
                  Firebase.auth().currentUser.displayName
                );
                return true;
              } else {
                return false;
              }
            })
            .then(isNew => isNew
              ? this.props.navigation.navigate('Intro')
              : this.props.navigation.navigate('Dashboard'))
            .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              // TODO: handle fb login errors
              Alert.alert("Login failed", errorMessage);
            })
        }
      })
  }

  handleGoogleLogin = () => { // should probably auto signout
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
          Firebase.auth().currentUser.isNew = true;
          db.initUser(
            Firebase.auth().currentUser,
            Firebase.auth().currentUser.displayName
          );
          return true;
        } else {
          return false;
        }
      })
      .then(isNew => isNew
        ? this.props.navigation.navigate('Intro')
        : this.props.navigation.navigate('Dashboard'))
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // TODO: handle google login errors
        Alert.alert("Login failed", errorCode + " " + errorMessage);
      })
  }

  async handleLogin(email, pass) {
    try {
      if (email === '') {
        alert('Please enter email!');
        return;
      } else if (pass === '') {
        alert('Please enter password!');
        return;
      }
      if (!email.includes('@')) {
        email = await db.searchExact(email, false);
      }
      await Firebase
        .auth()
        .signInWithEmailAndPassword(email, pass)
        .then(result => {
          const user = Firebase.auth().currentUser;
          if (user.emailVerified) {
            if (Firebase.auth().currentUser.isNew) {
              db.initUser(
                Firebase.auth().currentUser,
                Firebase.auth().currentUser.username
              );
              return true;
            } else {
              return false;
            }
          } else {
            //not verified
            throw {
              code: 'auth/not-verified',
              message: 'Not verified',
            }
            return false;
          }
        })
        .then(isNew => isNew
          ? this.props.navigation.navigate('Intro')
          : this.props.navigation.navigate('Dashboard'))
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Incorrect password.');
          } else if (errorCode === 'auth/invalid-email') {
            alert('Invalid email! Have you signed up?');
          } else if (errorCode === 'auth/user-not-found') {
            alert('User not found. Have you signed up?');
          } else if (errorCode === 'auth/not-verified') {
            alert('Email is not verified yet!');
          }
        })
      this.setState({
        email: '',
        password: '',
      });
    } catch(error) {
      console.log(error);
    }
  }

  goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/icons/CoinShackIcon.png')}
          style={{
            height: 100,
            width: 100,
          }}
        />
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
          
        <View style={{ alignItems: "center" }}>
          <MyInput
            placeholder="Username/Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            keyboardType="email-address"
            leftIconName="email-outline"
            width={(Dimensions.get('window').width) * 0.7}
          />
          <MyInput
            secureTextEntry
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            leftIconName="lock-outline"
            width={(Dimensions.get('window').width) * 0.7}
          />
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center', }}>
          <MyButton
            text="Login"
            onPress={() => this.handleLogin(
              this.state.email.trim(),
              this.state.password
            )}
            width={Math.round(Dimensions.get('window').width) * 0.7}
          />
          <MyButton
            text="Forget my Password"
            onPress={() => this.props.navigation.navigate('ForgetPassword')}
            width={Math.round(Dimensions.get('window').width) * 0.7}
          />
          <MyButton
            path={require('../assets/icons/fb.png')}
            image={true}
            text="Facebook Login"
            onPress={this.handleFbLogin}
            width={Math.round(Dimensions.get('window').width) * 0.7}
          />
          <MyButton
            path={require('../assets/icons/google.png')}
            image={true}
            text="Google Login"
            onPress={this.handleGoogleLogin}
            width={Math.round(Dimensions.get('window').width) * 0.7}
          />
          <MyButton
            text="Sign Up"
            onPress={this.goToSignUp}
            width={Math.round(Dimensions.get('window').width) * 0.7}
          />
        </View>
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
