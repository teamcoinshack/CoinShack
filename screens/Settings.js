import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Firebase from 'firebase';
import db from '../Database.js';
import MyButton from '../components/MyButton.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk';


const background = '#373b48';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
    };

    this.logout = this.logout.bind(this);
    this.getAuthProviders = this.getAuthProviders.bind(this);
    this.isEmailLogin = this.isEmailLogin.bind(this);
    this.isNotFbLogin = this.isNotFbLogin.bind(this);
    this.linkFbAcc = this.linkFbAcc.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordButton = this.changePasswordButton.bind(this);
    this.linkFbButton = this.linkFbButton.bind(this);
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      this.setState({
        id: uid,
      });
    } catch(error) {
      console.log(error);
    }
  }

  changePassword() {
    this.props.navigation.navigate('ChangePassword');
  }

  logout() {
    Firebase.auth()
            .signOut()
            .then(() => (this.props.navigation.navigate('Login')))
            .catch(function(error) {
              alert(error.code);
            })
  }

  getAuthProviders() {
    let user = Firebase.auth().currentUser;
    let providersArr = user.providerData;
    // google.com for google, password for email, facebook.com for fb
    return providersArr.map(providerObj => providerObj.providerId);
  }

  isEmailLogin() {
    return this.getAuthProviders().includes("password");
  }

  isNotFbLogin() {
    return !(this.getAuthProviders().includes("facebook.com"));
  }

  linkFbAcc() {
    LoginManager
      .logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
      .then(result => {
        if (result.isCancelled) {
          Alert.alert("Sign in cancelled", "Please try again!");
        } else {
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(data => {
        const credential = Firebase
          .auth
          .FacebookAuthProvider
          .credential(data.accessToken);
        return Firebase
          .auth()
          .currentUser
          .linkWithCredential(credential);
      }) // TODO: probably need to have snackbar that say linking successful and then hide the link fb button
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // TODO: handle fb link errors
        Alert.alert("Linking failed", errorMessage);
      });
  }

  changePasswordButton() {
    return (
      <MyButton
        text="Change Password"
        onPress={this.changePassword}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width) * 0.6}
      />
    );
  }

  linkFbButton() {
    return (
      <MyButton
        text="Link Facebook"
        onPress={this.linkFbAcc}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width) * 0.6}
      />
    );
  }

  render() {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {this.isEmailLogin() && this.changePasswordButton()}
        {this.isNotFbLogin() && this.linkFbButton()}
        <MyButton
          text="Logout"
          onPress={this.logout}
          textColor="#00f9ff"
          width={Math.round(Dimensions.get('window').width) * 0.6}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
