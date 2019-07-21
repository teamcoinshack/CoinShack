import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Firebase from 'firebase';
import db from '../Database.js';
import MyButton from '../components/MyButton.js';
import MyErrorModal from '../components/MyErrorModal.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';


const background = '#373b48';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.logout = this.logout.bind(this);
    this.getAuthProviders = this.getAuthProviders.bind(this);
    this.isEmailLogin = this.isEmailLogin.bind(this);
    this.isNotFbLogin = this.isNotFbLogin.bind(this);
    this.linkFbAcc = this.linkFbAcc.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordButton = this.changePasswordButton.bind(this);
    this.linkFbButton = this.linkFbButton.bind(this);
    this.isNotGoogleLogin = this.isNotGoogleLogin.bind(this);
    this.linkGoogleButton = this.linkGoogleButton.bind(this);
    this.linkGoogleAcc = this.linkGoogleAcc.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);

    this.googleProvider = new Firebase.auth.GoogleAuthProvider();
    
    GoogleSignin.configure({
      webClientId: "1059449383508-6hmi3fhfdqsjnp5tdklnjtfhob9st2k6.apps.googleusercontent.com",
    });
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      this.setState({
        uid: uid,
      });
    } catch (error) {
      console.log(error);
    }
  }

  changePassword() {
    this.props.navigation.navigate('ChangePassword');
  }

  deleteAccount() {
    db.deleteAccount(this.state.uid);
    let user = Firebase.auth().currentUser;
    user.delete().then(() => this.props.navigation.navigate('Login'));
  }

  logout() {
    Firebase.auth()
            .signOut()
            .then(() => (this.props.navigation.navigate('Login')))
            .catch(error => this.setState({
              isErrorVisible: true,
              errorTitle: "Sign in failed",
              errorPrompt: error.message
            }))
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

  isNotGoogleLogin() {
    return !(this.getAuthProviders().includes("google.com"));
  }

  linkFbAcc() {
    LoginManager
      .logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
      .then(result => {
        if (result.isCancelled) {
          this.setState({
            isErrorVisible: true,
            errorTitle: "Sign in cancelled",
            errorPrompt: "Please try again!"
          });
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
                .currentUser
                .linkWithCredential(credential);
            })
            .then(() => this.setState({
              isErrorVisible: true,
              errorTitle: "Linking successful",
              errorPrompt: "You can now login to this account with Facebook!",
            }))
            .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              switch (errorCode) {
                case "auth/provider-already-linked":
                case "auth/credential-already-in-use":
                case "auth/email-already-in-use":
                  this.setState({
                    isErrorVisible: true,
                    errorTitle: "Linking failed",
                    errorPrompt: "The Facebook account is already associated with another CoinShack account"
                  });
                  break;

                case "auth/invalid-credential":
                  this.setState({
                    isErrorVisible: true,
                    errorTitle: "Linking failed",
                    errorPrompt: "Invalid Facebook credentials, please try again!",
                  });
                  break;

                default:
                  this.setState({
                    isErrorVisible: true,
                    errorTitle: "Linking failed",
                    errorPrompt: errorMessage,
                  });
                  break;
              }
            })
        }
      })
  }

  linkGoogleAcc() {
    GoogleSignin
      .signIn()
      .then(data => {
        const credential = Firebase
          .auth
          .GoogleAuthProvider
          .credential(data.idToken, data.accessToken)
        return Firebase
          .auth()
          .currentUser
          .linkWithCredential(credential);
      })
      .then(() => this.setState({
        isErrorVisible: true,
        errorTitle: "Linking successful",
        errorPrompt: "You can now login to this account with Google!",
      }))
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        switch (errorCode) {
          case "auth/provider-already-linked":
          case "auth/credential-already-in-use":
          case "auth/email-already-in-use":
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking failed",
              errorPrompt: "The Google account is already associated with another CoinShack account"
            });
            break;

          case "auth/invalid-credential":
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking failed",
              errorPrompt: "Invalid Google account credentials, please try again!",
            });
            break;

          case statusCodes.SIGN_IN_CANCELLED:
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking failed",
              errorPrompt: "Google sign in cancelled, please try again!",
            });
            break;
              
          case statusCodes.IN_PROGRESS:
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking in progress",
              errorPrompt: "Google sign in in progress, please wait awhile!",
            });
            break;
  
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking failed",
              errorPrompt: "Google play services is not available on your device.",
            });
            break;

          default:
            this.setState({
              isErrorVisible: true,
              errorTitle: "Linking failed",
              errorPrompt: errorMessage,
            });
            break;
        }
      });
  }

  changePasswordButton() {
    return (
      <MyButton
        text="Change Password"
        onPress={this.changePassword}
        width={Math.round(Dimensions.get('window').width) * 0.6}
      />
    );
  }

  linkFbButton() {
    return (
      <MyButton
        text="Link Facebook"
        onPress={this.linkFbAcc}
        width={Math.round(Dimensions.get('window').width) * 0.6}
      />
    );
  }

  linkGoogleButton() {
    return (
      <MyButton
        text="Link Google"
        onPress={this.linkGoogleAcc}
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
        <MyErrorModal
          visible={this.state.isErrorVisible}
          close={() => this.setState({ isErrorVisible: false })}
          title={this.state.errorTitle}
          prompt={this.state.errorPrompt}
        />

        {this.isEmailLogin() && this.changePasswordButton()}
        {this.isNotFbLogin() && this.linkFbButton()}
        {this.isNotGoogleLogin() && this.linkGoogleButton()}
        <MyButton
          text="Delete Account"
          onPress={this.deleteAccount}
          width={Math.round(Dimensions.get('window').width) * 0.6}
        />
        <MyButton
          text="Logout"
          onPress={this.logout}
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
