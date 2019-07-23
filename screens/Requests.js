import React, { Component } from 'react';
import {
  Text, 
  View, 
  Dimensions,
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
} from 'react-native';
import Firebase from 'firebase';
import { Avatar } from 'react-native-elements';
import db from '../Database.js';
import MyBar from '../components/MyBar.js';
import MyErrorModal from '../components/MyErrorModal.js';

const background = '#373b48';

export default class Requests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      requests: [], 
      refreshing: true,
      callback: null,
      loading: false,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.renderRow = this.renderRow.bind(this);
    this.refresh = this.refresh.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }

  async accept(friend) {
    try {
      const res = await db.acceptRequest(this.state.uid, friend.uid);
      if (res === 0) {
        this.state.callback();
        this.refresh();
        this.setState({
          isErrorVisible: true,
          errorTitle: "Great!",
          errorPrompt: "Friend added!",
        });
      } else {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Unable to add friend",
          errorPrompt: "Please try again!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async reject(friend) {
    try {
      const res = await db.rejectRequest(this.state.uid, friend.uid);
      if (res === 0) {
        this.refresh();
        this.setState({
          isErrorVisible: true,
          errorTitle: "Bye!",
          errorPrompt: "Request rejected!",
        });
      } else {
        this.setState({
          isErrorVisible: true,
          errorTitle: "Unable to reject request",
          errorPrompt: "Please try again!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  load(friend) {
    this.props.navigation.navigate('FriendsProfile',{
      uid: this.state.uid,
      friendName: friend.username,
      friendUid: friend.uid,
      friendEmail: friend.email,
      callback: this.state.callback,
      callback2: this.refresh,
      image: friend.image,
    })
  }

  async refresh() {
    try {
      const myUid = Firebase.auth().currentUser.uid;
      let reqs = await db.getRequests(myUid);
      reqs = Object.keys(reqs);
      reqs = await Promise.all(
        reqs.map(async function (uid) {
          try {
            let obj = {};
            const snap = await db.getData(uid);
            if (!snap) {
              db.removeRequest(myUid, uid)
              return false;
            }
            const snapped = snap.val();
            obj.uid = uid;
            obj.username = ('username' in snapped)
              ? snapped.username
              : 'No name :(';
            obj.value = await db.getTotalValue(uid, snapped);
            obj.email = snapped.email;
            obj.title = ('title' in snapped)
              ? snap.val().title
              : 'NOVICE';
            obj.image = await db.getPhoto(uid);
            return obj;
          } catch (error) {
            console.log(error);
          }
        })
      );

      this.setState({
        uid: myUid,
        requests: reqs,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const callback = navigation.getParam('callback', null);
      this.setState({
        uid: Firebase.auth().currentUser.uid,
        callback: callback,
      }, () => this.refresh());
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
    );

    const havePic = (
      <Avatar
        rounded
        source={{ uri: `data:image/jpg;base64,${item.image}` }}
        style={styles.imageStyle}
      />
    );

    return (
      <View style={{ 
        flexDirection: 'column',
        width: Math.round(Dimensions.get('window').width),
        marginBottom: 10,
      }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.load(item)}
        >
        {item.image
          ? havePic
          : noPic}
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: 10,
          }}>
            <Text style={styles.text1}>{item.username}</Text>
            <Text style={styles.text2}>{'$' + db.stringify(item.value.toFixed(2))}</Text>
            <Text style={styles.text3}>{item.title}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ 
          flexDirection: 'row',
          flex: 1,
        }}> 
          <TouchableOpacity 
            style={styles.accept}
            onPress={() => this.accept(item)}
          >
            <Text style={styles.buttonStyle}>ACCEPT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reject}
            onPress={() => this.reject(item)}
          >
            <Text style={styles.buttonStyle}>REJECT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
    );

    const loading = (
      <View style={styles.loadingStyle}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
          />
      </View>
    );

    const requestsList = (
        <FlatList
          style={styles.flatStyle}
          data={this.state.requests}
          renderItem={this.renderRow}
          keyExtractor={item => item.uid.toString()}
        />
    );

    return (
      <View style={styles.container}>
        <MyErrorModal
          visible={this.state.isErrorVisible}
          close={() => this.setState({ isErrorVisible: false })}
          title={this.state.errorTitle}
          prompt={this.state.errorPrompt}
        />

        {this.state.refreshing
          ? loading
          : this.state.requests.length === 0
            ? noRequests
            : requestsList}
      </View>
    );
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
    fontSize: 15,
    color: '#faed27',
    fontWeight: '500',
  },
  loadingStyle: {
    flex: 1,
    backgroundColor: background,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    fontWeight: '700',
    fontSize: 15,
  }
});
