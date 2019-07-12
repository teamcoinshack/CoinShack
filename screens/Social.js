import React, {Component} from 'react';
import {
  Text,
  ActivityIndicator,
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BellIcon from 'react-native-vector-icons/Entypo';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import q from '../Query.js';
import Masterlist from '../Masterlist.js';
import Searchbar from '../components/Searchbar.js';
import Title from '../components/Title.js';

const background = '#373b48';

export default class Social extends Component {

  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      refreshing: true,
      haveRequests: false,
    }
    this.refresh = this.refresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.load = this.load.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Social',
      headerStyle: {
        backgroundColor: background,
        borderBottomWidth: 0,
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate('Requests', { 
            callback: navigation.getParam('callback', null),
          })}
        >
          <BellIcon
            name="bell"
            size={24}
            color={navigation.getParam('haveRequests', false)
                   ? '#ff077a'
                   : '#ffffff'}
          />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 20,
      },
      headerTintColot: '#ffffff',
    }
  }

  load(friend) {
    this.props.navigation.navigate('FriendsProfile',{
      uid: this.state.uid,
      friendName: friend.username,
      friendUid: friend.uid,
      friendEmail: friend.email,
      callback: this.refresh,
    })
  }
  
  async refresh() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      let friends = await db.getFriends(uid); 
      friends = Object.keys(friends);
      friends = await Promise.all(
                    friends.map(async function(uid) {
                      try {
                        let obj = {};
                        const snap = await db.getData(uid);
                        const snapped = snap.val();
                        obj.uid = uid;
                        obj.username = ('username' in snapped)
                                        ? snapped.username
                                        : 'No name :(';
                        obj.email = snapped.email;
                        obj.value = await db.getTotalValue(uid, snapped);
                        obj.title_id = snapped.title_id;
                        obj.image = require('../assets/icons/noPic.png');
                        return obj;
                      } catch(error) {
                        console.log(error);
                      }
                    })
                  )
      friends.sort((a, b) => b.value - a.value);
      let requests = await db.getRequests(uid);
      requests = Object.keys(requests);
      this.setState({
        uid: uid,
        friends: friends,
        refreshing: false,
        haveRequests: requests.length > 0,
      })
      this.props.navigation.setParams({ 
        haveRequests: this.state.haveRequests,
      });
    } catch (error) {
      console.log(error);
    }

  }
  async componentDidMount() {
    try {
      await this.refresh();
      this.props.navigation.setParams({ 
        callback: this.refresh,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return ( 
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.load(item)}
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
          <Text style={styles.text2}>{'$' + db.stringify(item.value.toFixed(2))}</Text>
          <Title title_id={item.title_id} />
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
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
          />
        }
      />
    )
    const noFriends = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginTop: 30,
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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
          />
        }
      >
        <MyButton
          text="Discover"
          onPress={() => this.props.navigation.navigate('Search', {
            callback: this.props.navigation.getParam('callback', null),  
          })}
          width={Math.round(Dimensions.get('window').width)}
          icon={"magnify"}
        />
        <View style={styles.friendsHeader}>
          <Text style={styles.friends}>Friends</Text>
        </View>
        {this.state.refreshing
          ? loading
          : this.state.friends.length === 0
            ? noFriends
            : friendsList}
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
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
    fontSize: 21,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  text2: {
    fontSize: 18,
    color: '#a4a9b9',
    fontWeight: '500',
  },
  text3: {
    fontSize: 15,
    color: '#faed27',
    fontWeight: '500',
  },
  flatStyle: {
    marginTop: 20,
  }
});
