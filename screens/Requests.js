import React, {Component} from 'react';
import {
  Text, 
  View, 
  Dimensions,
  StyleSheet, 
  FlatList, 
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Firebase from 'firebase';
import { Avatar } from 'react-native-elements';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import db from '../Database.js';
import MyBar from '../components/MyBar.js';

const background = '#373b48';

export default class Requests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      requests: [], 
      refreshing: true,
      callback: null,
    }
    this.renderRow = this.renderRow.bind(this);
    this.refresh = this.refresh.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }

  async accept(friendUid) {
    try {
      const res = await db.acceptRequest(this.state.uid, friendUid);
      if (res === 0) {
        alert("Friend added!");
        this.state.callback();
        this.refresh();
      } else {
        alert("Unable to add friend");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async reject(friendUid) {
    try {
      const res = await db.rejectRequest(this.state.uid, friendUid);
      if (res === 0) {
        alert("Request rejected!");
        this.refresh();
      } else {
        alert("Unable to reject request");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async refresh() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      let reqs = await db.getRequests(uid);
      reqs = await Promise.all(
                    reqs.map(async function(uid) {
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
        uid: uid,
        requests: reqs,
        refreshing: false,
      })
    } catch(error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const callback = navigation.getParam('callback', null);
      this.setState({
        callback: callback,
      }, () => this.refresh());
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    return (
      <View style={{ 
        flexDirection: 'column',
        width: Math.round(Dimensions.get('window').width),
      }}>
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
            <Text style={styles.text2}>{item.email}</Text>
            <Text style={styles.text3}>{item.title}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ 
          flexDirection: 'row',
          flex: 1,
        }}> 
          <TouchableOpacity 
            style={styles.accept}
            onPress={() => this.accept(item.uid)}
          >
            <Text style={styles.buttonStyle}>ACCEPT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reject}
            onPress={() => this.reject(item.uid)}
          >
            <Text style={styles.buttonStyle}>REJECT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const noRequests= (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No requests to show
        </Text>
      </View>
    )
    const loading = (
      <View style={styles.loadingStyle}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
      </View>
    )
    const requestsList = (
        <FlatList
          style={styles.flatStyle}
          data={this.state.requests}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid.toString()}
        />
    )
    return (
      <View style={styles.container}>
        {this.state.refreshing
          ? loading
          : this.state.requests.length === 0
            ? noRequests
            : requestsList}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flatStyle: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    justifyContent: 'center'
  },
  row: {
    elevation: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
  },
  accept: {
    elevation: 1,
    borderBottomLeftRadius: 5,
    backgroundColor: '#5fba7d',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  reject: {
    elevation: 1,
    borderBottomRightRadius: 5,
    backgroundColor: '#ba5f6b',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
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
  },
  loadingStyle: {
    flex: 1,
    backgroundColor: background,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonStyle: {
    fontWeight: '700',
    fontSize: 15,
  }
});
