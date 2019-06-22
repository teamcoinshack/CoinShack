import React, {Component} from 'react';
import {
  Text, 
  TextInput, 
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
      id: '',
      oldPass: null,
      newPass1: null,
      newPass2: null,
    }
    this.change = this.change.bind(this);
  }

  componentDidMount() {
    this.setState({id: Firebase.auth().currentUser.uid});
  }

  async change() {
    try {
      const user = Firebase.auth().currentUser;
      if (this.state.newPass1 !== null && this.state.newPass1 === this.state.newPass2) {
        await db.changePassword(user, this.state.newPass1);
        this.props.navigation.navigate('Login');
      } else {
        alert("Passwords do not match!");
      }
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 25, 
            color: '#ffffff', 
            fontWeight: 'bold' 
          }}>
            Change Your Password
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            placeholder="Old password"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            onChangeText={pass => this.setState({ oldPass: pass })}
            value={this.state.email}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            placeholder="New password"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            onChangeText={pass => this.setState({ newPass1: pass })}
            value={this.state.email}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            placeholder="New password again"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            onChangeText={pass => this.setState({ newPass2: pass })}
            value={this.state.email}
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
  textInput: {
    elevation: 1,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginRight: 14,
    height: 60,
    width: Math.round(Dimensions.get('window').width) * 0.7,
    textAlign: 'left',
    fontSize: 18,
    color: '#ffffff',
  },
  inputContainer: {
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    width: Math.round(Dimensions.get('window').width) * 0.7,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
});
