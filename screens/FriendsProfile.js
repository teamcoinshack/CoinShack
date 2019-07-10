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
  RefreshControl,
} from 'react-native';
import Firebase from 'firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import db from '../Database.js';
import ProfileTab from '../components/ProfileTab.js';
import { Masterlist, Mapping } from '../Masterlist.js';
import q from '../Query.js';

const background = '#373b48';

export default class FriendsProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      friendUid: null,
      refreshing: true,
      areFriends: false,
      requesting: false,
      callback: null,
    }
    this.refresh = this.refresh.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.getFavCoin = this.getFavCoin.bind(this);
  }

  async addFriend() {
    try {
      const res = await db.addFriend(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.state.callback();
        await this.refresh();
        alert("Friend request sent!");
      } else {
        alert("Unable to add friend");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFriend() {
    try {
      const res = await db.deleteFriend(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.state.callback();
        await this.refresh();
        alert("Friend deleted :(");
      } else {
        alert("Unable to delete friend");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRequest() {
    try {
      const res = await db.deleteRequest(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.refresh();
        alert("Request successfully deleted!");
      } else {
        alert("No pending request to be deleted.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const friendUid = navigation.getParam('friendUid', null);
      const callback = navigation.getParam('callback', null);
      this.setState({
        uid: Firebase.auth().currentUser.uid,
        friendUid: friendUid,
        callback: callback,
      }, () => this.refresh());
    } catch(error) {
      console.log(error);
    }
  }

  async getFavCoin(wallet) {
    try {
      let coins = await Promise.all(
                          Object.keys(wallet)
                            .map(async function(symbol) {
                              try {
                                let arr = [];
                                arr[0] = symbol;
                                arr[1] = Mapping[symbol];
                                const data = await q.fetch(Mapping[symbol]);
                                const rate = data.market_data.current_price.usd;
                                arr[2] = wallet[symbol] * rate;
                                return arr;
                              } catch(error) {
                                console.log(error);
                              }
                            })
                        )
      let favCoin;
      if (!wallet) {
        return 'None :(';
      } else {
        let max = 0;
        for (let counter = 1; counter < coins.length; counter++) {
          if (coins[max][2] < coins[counter][2]) {
            max = counter;
          }
        }
        return coins[max][1];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async refresh() {
    try {
      this.setState({
        refreshing: true,
      });
      const uid = this.state.uid;
      const friendUid = this.state.friendUid;
      const snap = await db.getData(this.state.friendUid);
      let wallet = ('wallet' in snap.val()) ? snap.val().wallet : false;
      const favCoin = await this.getFavCoin(wallet);
      const areFriends = await db.isFriend(uid, friendUid);
      const requesting = areFriends ? false : await db.requesting(uid, friendUid);
      this.setState({
        username: snap.val().username,
        totalValue: '$' + db.stringify(snap.val().totalValue.toFixed(2)),
        refreshing: false,
        favourite: wallet ? favCoin.charAt(0).toUpperCase() + favCoin.slice(1) : favCoin,
        areFriends: areFriends,
        requesting: requesting,
      })
    } catch(error) {
      console.log(error);
    }
  }


  render() {
    const addFriend = (
      <MyButton
        text="Add Friend"
        onPress={this.addFriend}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width)}
      />
    )

    const deleteFriend = (
      <MyButton
        text="Delete Friend"
        onPress={this.deleteFriend}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width)}
      />
    )

    const deleteRequest = (
      <MyButton
        text="Delete Request"
        onPress={this.deleteRequest}
        textColor="#00f9ff"
        width={Math.round(Dimensions.get('window').width)}
      />
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
        <ProfileTab 
          refreshing={this.state.refreshing}
          value={this.state.totalValue}
          username={this.state.username}
          favourite={this.state.favourite}
        />
        { this.state.refreshing || this.state.uid === this.state.friendUid
          ? null 
          : this.state.areFriends
            ? deleteFriend
            : this.state.requesting
              ? deleteRequest
              : addFriend }
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
