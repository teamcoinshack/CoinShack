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
import { Avatar } from 'react-native-elements';
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
      friends: [],
      refreshing: true,
    }
  }
  
  async componentDidMount() {
    try {
      let friends = await db.getFriends(Firebase.auth().currentUser.uid); 
      friends = await Promise.all(
                    friends.map(async function(uid) {
                      try {
                        let obj = {};
                        const snap = await db.getData(uid);
                        obj.uid = uid;
                        obj.username = ('username' in snap.val())
                                        ? snap.val().username
                                        : 'No name :(';
                        obj.email = snap.val().email;
                        obj.title = ('title' in snap.val())
                                      ? snap.val().title
                                      : 'Novice';
                        obj.image = require('../assets/icons/noPic.png');
                        return obj;
                      } catch(error) {
                        console.log(error);
                      }
                    })
                  )
      this.setState({
        friends: friends,
        refreshing: false,
      })
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return ( 
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.load(item.uid)}
      >
        <Avatar
          rounded
          source={item.image}
          style={styles.imageStyle}
        />
        <View style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginLeft: 10,
        }}>
          <Text style={styles.text1}>{item.username}</Text>
          <Text style={styles.text2}>{item.email}</Text>
          <Text style={styles.text3}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  
  render() {
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
      </View>
    )
    const friendsList = (
      <FlatList
        style={styles.flatStyle}
        data={this.state.friends}
        renderItem={this.renderRow}
        keyExtractor={item => item.uid}
      />
    )
    const noFriends = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No friends :(
        </Text>
      </View>
    )
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
        {this.state.refreshing
          ? loading
          : this.state.friends.length === 0
            ? noFriends
            : friendsList}
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
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Math.round(Dimensions.get('window').width) - 28, 
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  text1: {
    fontSize: 20,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  text2: {
    fontSize: 14,
    color: '#a4a9b9',
    fontWeight: '500',
  },
  text3: {
    fontSize: 20,
    color: '#faed27',
  }
});
