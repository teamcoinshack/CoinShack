import React, { Component } from 'react';
import {
  View, 
  Dimensions,
  StyleSheet, 
  ScrollView,
  RefreshControl,
} from 'react-native';
import Firebase from 'firebase';
import db from '../Database.js';
import ProfileTab from '../components/ProfileTab.js';
import { Mapping } from '../Masterlist.js';
import MyErrorModal from '../components/MyErrorModal.js';
import q from '../Query.js';
import BadgePanel from '../components/BadgePanel.js';

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
      friendRequesting: false,
      callback: null,
      callback2: null,
      loading: false,
      email: '',
      badgesData: {},

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.refresh = this.refresh.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.getFavCoin = this.getFavCoin.bind(this);
    this.accept = this.accept.bind(this);
    this.halfRefresh = this.halfRefresh.bind(this);
  }

  async addFriend() {
    try {
      this.setState({
        loading: true,
      });
      const res = await db.addFriend(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.state.callback();
        await this.halfRefresh();
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Yay!",
          errorPrompt: "Friend request sent!",
        });
      } else {
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Oops!",
          errorPrompt: "Unable to add friend, please try again!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async accept(friendUid) {
    try {
      this.setState({
        loading: true,
      })
      const res = await db.acceptRequest(this.state.uid, friendUid);
      if (res === 0) {
        await this.state.callback();
        this.state.callback2 && await this.state.callback2();
        await this.halfRefresh();
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Yay!",
          errorPrompt: "Friend added",
        });
      } else {
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Oops!",
          errorPrompt: "Unable to add friend, please try again!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFriend() {
    try {
      this.setState({
        loading: true,
      })
      const res = await db.deleteFriend(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.state.callback();
        await this.halfRefresh();
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Bye :(",
          errorPrompt: "Friend deleted!",
        });
      } else {
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Oops!",
          errorPrompt: "Unable to delete friend, please try again!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRequest() {
    try {
      this.setState({
        loading: true,
      })
      const res = await db.deleteRequest(this.state.uid, this.state.friendUid);
      if (res === 0) {
        await this.halfRefresh();
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Request deleted",
          errorPrompt: "Request successfully deleted!",
        });        
      } else {
        this.setState({
          loading: false,
          isErrorVisible: true,
          errorTitle: "Oops",
          errorPrompt: "No pending request to be deleted.",
        }); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const friendUid = navigation.getParam('friendUid', null);
      const email = navigation.getParam('friendEmail', null);
      const callback = navigation.getParam('callback', null);
      const callback2 = navigation.getParam('callback2', null);
      const image = navigation.getParam('image', null);
      this.setState({
        uid: Firebase.auth().currentUser.uid,
        friendUid: friendUid,
        email: email,
        callback: callback,
        callback2: callback2,
        image: image,
      }, () => this.refresh());
    } catch (error) {
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
                              } catch (error) {
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
      const snapped = snap.val();
      const wallet = ('wallet' in snapped) ? snapped.wallet : false;
      const totalValue = await db.getTotalValue(friendUid, snapped);
      const favCoin = await this.getFavCoin(wallet);
      const areFriends = await db.isFriend(uid, friendUid);
      const requesting = areFriends ? false : await db.requesting(uid, friendUid);
      const friendRequesting = areFriends ? false : await db.requesting(friendUid, uid);
      const badgesData = snapped.badges || {};
      this.setState({
        username: snapped.username,
        totalValue: '$' + db.stringify(totalValue.toFixed(2)),
        refreshing: false,
        favourite: wallet ? favCoin.charAt(0).toUpperCase() + favCoin.slice(1) : favCoin,
        areFriends: areFriends,
        requesting: requesting,
        friendRequesting: friendRequesting,
        title_id: snapped.title_id,
        badgesData: badgesData
      })
    } catch (error) {
      console.log(error);
    }
  }

  async halfRefresh() {
    try {
      const areFriends = await db.isFriend(this.state.uid, this.state.friendUid);
      const requesting = areFriends 
                          ? false 
                          : await db.requesting(this.state.uid, this.state.friendUid);
      const friendRequesting = areFriends 
                          ? false 
                          : await db.requesting(this.state.friendUid, this.state.uid);
      this.setState({
        areFriends: areFriends,
        requesting: requesting,
        friendRequesting: friendRequesting,
      })
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width)}
          />
      </View>
    )

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

    const acceptRequest = (
      <MyButton
        text="Accept Request"
        onPress={() => this.accept(this.state.friendUid)}
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
        <MyErrorModal
          visible={this.state.isErrorVisible}
          close={() => this.setState({ isErrorVisible: false })}
          title={this.state.errorTitle}
          prompt={this.state.errorPrompt}
        />

        <ProfileTab 
          refreshing={this.state.refreshing}
          value={this.state.totalValue}
          email={this.state.email}
          username={this.state.username}
          favourite={this.state.favourite}
          title_id={this.state.title_id}
          path={this.state.image 
                ? { uri: `data:image/jpg;base64,${this.state.image}` }
                : null}
          badgeCount={Object.keys(this.state.badgesData).length}
        />
        <BadgePanel
          badgesData={this.state.badgesData}
          onPress={() => this.props.navigation.navigate('BadgesInfo', {
            badgesData: this.state.badgesData
          })}
        />
        { this.state.refreshing || this.state.uid === this.state.friendUid
          ? null 
          : this.state.loading
            ? loading
            : this.state.areFriends
              ? deleteFriend
              : this.state.requesting
                ? deleteRequest
                : this.state.friendRequesting
                  ? acceptRequest
                  : addFriend }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    flexDirection: 'column',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    paddingVertical: 14,
  },
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  loading1: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
});
