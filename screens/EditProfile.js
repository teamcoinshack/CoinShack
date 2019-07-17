import React, {Component} from 'react';
import {
  Text, 
  TextInput, 
  View, 
  Dimensions,
  StyleSheet, 
  FlatList, 
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Firebase from 'firebase';
import db from '../Database.js';
import ImagePicker from 'react-native-image-crop-picker';
import { background } from '../Masterlist.js';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      username: null,
      email: null,
      pic: null,
      uid: null,
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.getAuthProviders = this.getAuthProviders.bind(this);
    this.isEmailLogin = this.isEmailLogin.bind(this);
    this.isNotFbLogin = this.isNotFbLogin.bind(this);
    this.isNotGoogleLogin = this.isNotGoogleLogin.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      const snapped = snap.val();
      const pic = ('image' in snapped) ? snapped.image : false;
      this.setState({
        uid: uid,
        username: snapped.username,
        email: snapped.email,
        pic: pic,
      })
    } catch (error) {
      console.log(error);
    }
  }

  async changeUsername() {
  }

  async getImage() {
    try {
      const uid = this.state.uid;

      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo',
      })
      const imagePath = image.path;
      const imageRef = Firebase.storage()
                               .ref(uid)
                               .child('dp.jpg');
      let mime = 'image/jpg';

      await imageRef.put(imagePath, { contentType: mime })
      const url = await imageRef.getDownloadURL();
      console.log(url);
      db.storePhoto(uid, url);
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
        source={{ uri: this.state.pic }}
        style={styles.imageStyle}
      />
    )
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={this.getImage}
          >
            {this.state.pic
              ? havePic
              : noPic }
          </TouchableOpacity>
          {usernameInput}
          {this.isNotGoogleLogin() && this.isNotFbLogin() && emailInput}
          <MyButton
            text="Save Changes"
            onPress={this.save}
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
  inputContainer: {
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    width: Math.round(Dimensions.get('window').width) * 0.7,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  imageStyle: {
    width: 100,
    height: 100,
  }
});
