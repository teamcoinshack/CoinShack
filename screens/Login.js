import React from 'react'
import {
  TextInput, 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Button,
  Dimensions,
} from 'react-native';
import db from '../config.js';
import Firebase from 'firebase';
import q from '../Query.js';

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

    this.fbProvider = new Firebase.auth.FacebookAuthProvider();
    this.fbProvider.addScope("user_friends");
  }

  handleFbLogin = () => {
    Firebase.auth()
            .signInWithPopup(this.fbProvider)
            .then(result => {
              this.props.navigation.navigate('Dashboard')
            })
            .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              // TODO: handle error, check which error will be thrown for fb login
              alert(errorMessage);
            })
  }

  handleLogin = (email, pass) => {
    success = true;
    Firebase.auth()
            .signInWithEmailAndPassword(email, pass)
            .then(() => (
              this.props.navigation.navigate('Dashboard')
            ))
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
  }

  goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  render() {
    const loginButton = (
      <TouchableOpacity
        style={styles.buttonRow}
        onPress={
          () => this.handleLogin(
            this.state.email.trim(),
            this.state.password
          )
        }
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#00f9ff', fontSize: 20, fontWeight: '700', }}>
            Login
          </Text>
        </View>
      </TouchableOpacity>
    );

    const fbLoginButton = (
      <TouchableOpacity
        style={styles.buttonRow}
        onPress={this.handleFbLogin}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#00f9ff', fontSize: 20, fontWeight: '700', }}>
            Login
          </Text>
        </View>
      </TouchableOpacity>
    );

    const signupButton = (
      <TouchableOpacity
        style={styles.buttonRow}
        onPress={this.goToSignUp}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#00f9ff', fontSize: 20, fontWeight: '700', }}>
            Sign Up
          </Text>
        </View>
      </TouchableOpacity>
    );

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
          <View style={{ height: 65, width: '100%' }}>
            {loginButton}
          </View>
          <View style={{ height: 65, width: '100%' }}>
            {fbLoginButton}
          </View>
          <View style={{ height: 65, width: '100%' }}>
            {signupButton}
          </View>
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
    textAlign: 'center',
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
  buttonRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    width: Math.round(Dimensions.get('window').width) * 0.5,
  }
})
