import React, { Component } from 'react';
import {
  Text,
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
import BellIcon from 'react-native-vector-icons/Entypo';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import Title from '../components/Title.js';
import { background, rowBackground } from '../Masterlist.js';

export default class Social extends Component {

  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      refreshing: true,
    };

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
      headerTintColor: '#ffffff',
    }
  }

  load(friend) {
    friend.uid === this.state.uid
      ? this.props.navigation.navigate('Profile')
      : this.props.navigation.navigate('FriendsProfile',{
          uid: this.state.uid,
          friendName: friend.username,
          friendUid: friend.uid,
          friendEmail: friend.email,
          callback: this.refresh,
          image: friend.image,
        })
  }
  
  async refresh() {
    try {
      const myUid = Firebase.auth().currentUser.uid;
      let friends = await db.getFriends(myUid); 
      friends = Object.keys(friends);
      friends = await Promise.all(
                    friends.map(async function(uid) {
                      try {
                        let obj = {};
                        const snap = await db.getData(uid);
                        if (!snap) {  
                          db.removeFriend(myUid, uid)
                          return false;
                        }
                        const snapped = snap.val();
                        obj.uid = uid;
                        obj.username = ('username' in snapped)
                                        ? snapped.username
                                        : 'No name :(';
                        obj.email = snapped.email.length > 20 
                                      ? snapped.email.substring(0, 2) + '...'
                                      : snapped.email;
                        obj.value = await db.getTotalValue(uid, snapped);
                        obj.title_id = snapped.title_id;
                        obj.image = await db.getPhoto(uid); 
                        return obj;
                      } catch(error) {
                        console.log(error);
                      }
                    })
                  )
      const myData = await db.getData(myUid);
      const snapped = myData.val();
      friends.push({
        uid: myUid,
        username: snapped.username + ' (You)',
        email: snapped.email,
        value: await db.getTotalValue(myUid, snapped),
        title_id: snapped.title_id,
        image: await db.getPhoto(myUid),
      })
      friends.sort((a, b) => b.value - a.value);
      friends.map((f, index) => {
        f.rank = (index + 1);
        return f;
      });
      let requests = await db.getRequests(myUid);
      requests = Object.keys(requests);
      requests = requests.filter(async function(x) {
        const res = await db.getData(x);
        if (!res) { db.removeFriend(myUid, x) }
        return res;
      })
      this.setState({
        uid: myUid,
        friends: friends,
        refreshing: false,
      })
      this.props.navigation.setParams({ 
        haveRequests: requests.length > 0,
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

  renderRow({ item }) {
    if (!item) { return null; }
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
        source={{ uri: `data:image/jpg;base64,${item.image}` }}
        style={styles.imageStyle}
      />
    )
    return ( 
      <TouchableOpacity
        onPress={() => this.load(item)}
        style={styles.row}
      >
        {item.rank < 4
          ? ( <Text style={styles['rank' + item.rank]}>{item.rank}</Text> )
          : ( <Text style={styles.rank}>{item.rank}</Text> )}
          {item.image
            ? havePic
            : noPic}
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: 10,
          }}>
            <Text style={styles.text1}>{item.username}</Text>
            <Title title_id={item.title_id} />
          </View>
          <View style={{ alignItems: 'flex-end', flex: 1}}>
            <Text style={styles.text2}>
              {'$' + db.stringify(item.value.toFixed(2))}
            </Text>
          </View>
      </TouchableOpacity>
    );
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
    );

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
    );

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
    );

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
    backgroundColor: rowBackground, 
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Math.round(Dimensions.get('window').width) - 28, 
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  text1: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: 'bold', 
  },
  text2: {
    fontSize: 16,
    color: '#dbdbdb',
    fontWeight: 'bold',
  },
  flatStyle: {
    marginTop: 20,
  },
  rank1: {
    color: '#ffd800',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  rank2: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  rank3: {
    color: '#cd7f32',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  rank: {
    color: '#c0c0c0',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  }
});
