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
import ProfileTab from '../components/ProfileTab.js';

const background = '#373b48';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
    }
  }

  componentDidMount() {
    const uid = Firebase.auth().currentUser.uid;
    this.setState({
      id: uid,
    });
  }

  render() {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileTab value={1000}/>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
