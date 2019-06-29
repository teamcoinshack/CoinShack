import React, {Component} from 'react';
import {
  Text, 
  View, 
  Dimensions,
  StyleSheet, 
  FlatList, 
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import Firebase from 'firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import db from '../Database.js';

const background = '#373b48';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      emailLogin: null,
    }
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      this.setState({
        id: uid,
        emailLogin: snap.val().emailLogin,
      });
    } catch(error) {
      console.log(error);
    }
  }

  changePassword = () => {
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

  render() {
    const changePasswordButton = (
      <MyButton
        text="Change Password"
        onPress={this.changePassword}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width) * 0.6}
      />
    )
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {this.state.emailLogin ? changePasswordButton : null}
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
