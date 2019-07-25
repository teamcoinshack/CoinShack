import React, { Component } from 'react';
import {
  View, 
  Dimensions,
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Firebase from 'firebase';
import db from '../Database.js';
import ImagePicker from 'react-native-image-crop-picker';
import { background } from '../Masterlist.js';
import MyInput from '../components/MyInput.js';
import MyErrorModal from '../components/MyErrorModal.js';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      username: null,
      email: null,
      uid: null,
      b64: null,
      callback: null,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    }
    this.getAuthProviders = this.getAuthProviders.bind(this);
    this.isEmailLogin = this.isEmailLogin.bind(this);
    this.isNotFbLogin = this.isNotFbLogin.bind(this);
    this.isNotGoogleLogin = this.isNotGoogleLogin.bind(this);
    this.getImage = this.getImage.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      const snapped = snap.val();
      const b64 = await db.getPhoto(uid);
      const callback = navigation.getParam('callback', null);
      this.setState({
        uid: uid,
        username: snapped.username,
        email: snapped.email,
        b64: b64,
        callback: callback,
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getImage() {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
      })
      this.setState({
        b64: image.data,
      })
    } catch (error) {
      console.log(error);
    }
  }

  async saveChanges() {
    try {
      const res1 = db.storePhoto(this.state.uid, this.state.b64); 
      const unique = await db.uniqueUsername(
        this.state.uid, 
        this.state.username
      ); 
      if (!unique) {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Username Taken!",
          errorPrompt: "Please use another username.",
        });
        return;
      }
      const res2 = db.updateUsername(this.state.uid, this.state.username);
      if (res1 && res2) {
        this.state.callback();
        this.props.navigation.navigate('Profile');
      } else if (!res2) {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Invalid Username",
          errorPrompt: "Username cannot be more than 12 characters!"
        });
        return;
      } else {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Error",
          errorPrompt: "Error saving changes, please try again!"
        });
      }
    } catch (error) {
      console.log(error);
    }
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

  render() {
    const usernameInput = (
      <MyInput
        placeholder="username"
        onChangeText={username => this.setState({ username })}
        value={this.state.username}
        leftIconName="emoticon-outline"
        width={(Dimensions.get('window').width) * 0.7}
      />
    )
    const emailInput = (
      <MyInput
        placeholder="email"
        onChangeText={email => this.setState({ email })}
        value={this.state.email}
        keyboardType="email-address"
        leftIconName="email-outline"
        width={(Dimensions.get('window').width) * 0.7}
      />
    )
    const noPic = (
      <Avatar
        rounded
        source={require('../assets/icons/noPic.png')}
        style={styles.imageStyle}
      />
    )

    const havePic = (
      <Avatar
        rounded
        source={{ uri: `data:image/jpg;base64,${this.state.b64}` }}
        style={styles.imageStyle}
      />
    )
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
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.getImage}
          >
            {this.state.b64
              ? havePic
              : noPic }
          </TouchableOpacity>
          {usernameInput}
          {this.isNotGoogleLogin() && this.isNotFbLogin() && emailInput}
          <MyButton
            text="Save Changes"
            onPress={this.saveChanges}
            textColor="#00f9ff"
            width={Math.round(Dimensions.get('window').width) * 0.6}
          />
        </View>
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
  imageStyle: {
    width: 100,
    height: 100,
  }
});
