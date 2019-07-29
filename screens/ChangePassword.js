import React, { Component } from 'react';
import {
  Text, 
  View, 
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MyErrorModal from '../components/MyErrorModal.js';
import MyInput from '../components/MyInput.js';
import Firebase from 'firebase';
import db from '../Database.js';

const background = '#373b48';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      oldPass: null,
      newPass1: null,
      newPass2: null,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.change = this.change.bind(this);
  }

  componentDidMount() {
    this.setState({ id: Firebase.auth().currentUser.uid });
  }

  async change() {
    try {
      const user = Firebase.auth().currentUser;
      if (this.state.newPass1 !== null && this.state.newPass1 === this.state.newPass2) {
        await db.changePassword(user, this.state.newPass1);
        this.props.navigation.navigate('Login');
      } else {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Passwords does not match",
          errorPrompt: "Please try again!",
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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
      >
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
            Change Your Password
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <MyInput
            secureTextEntry
            placeholder="Old password"
            onChangeText={pass => this.setState({ oldPass: pass })}
            value={this.state.oldPass}
            leftIconName="lock-outline"
          />

          <MyInput
            secureTextEntry
            placeholder="New password"
            onChangeText={pass => this.setState({ newPass1: pass })}
            value={this.state.newPass1}
            leftIconName="lock-outline"
          />

          <MyInput
            secureTextEntry
            placeholder="Confirm password"
            onChangeText={pass => this.setState({ newPass2: pass })}
            value={this.state.newPass2}
            leftIconName="lock-outline"
          />
        </View>

        <MyButton
          text="Change Password"
          onPress={this.change}
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
});
