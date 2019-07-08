import React, {Component} from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import q from '../Query.js';
import Masterlist from '../Masterlist.js';
import Searchbar from '../components/Searchbar.js';

const background = '#373b48';

export default class Social extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: null,
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <MyButton
          text="Search for new friends"
          onPress={() => this.props.navigation.navigate('Search')}
          textColor="#00f9ff"
          width={Math.round(Dimensions.get('window').width)}
        />
        <View style={styles.friendsHeader}>
          <Text style={styles.friends}>Friends</Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    alignItems: 'center',
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Math.round(Dimensions.get('window').width) - 40, 
    marginTop: 10,
  },
  friends: {
    fontSize: 30,
    color: '#dbdbdb',
    fontWeight: '600',
  },
});
