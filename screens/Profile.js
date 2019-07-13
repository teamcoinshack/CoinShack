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
import { 
  background, 
  Masterlist, 
  Mapping, 
} from '../Masterlist.js';
import Firebase from 'firebase';
import ProfileTab from '../components/ProfileTab.js';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import db from '../Database.js';
import q from '../Query.js';
import LinearGradient from 'react-native-linear-gradient';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      refreshing: false,
    }
    this.refresh = this.refresh.bind(this);
    this.getFavCoin = this.getFavCoin.bind(this);
  }

  async componentDidMount() {
    try {
      await this.refresh();
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
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      const snapped = snap.val();
      const wallet = ('wallet' in snapped) ? snapped.wallet : false;
      const totalValue = await db.getTotalValue(uid, snapped);
      const favCoin = await this.getFavCoin(wallet);
      this.setState({
        username: snapped.username,
        email: Firebase.auth().currentUser.email,
        totalValue: '$' + db.stringify(totalValue.toFixed(2)),
        refreshing: false,
        favourite: wallet ? favCoin.charAt(0).toUpperCase() + favCoin.slice(1) : favCoin,
        title_id: snapped.title_id,
      })
    } catch(error) {
      console.log(error);
    }
  }

  render() {
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
        <LinearGradient 
          style={styles.contentContainer}
          colors={[background, '#000000']}
          locations={[0.5, 1]}
        >
          <ProfileTab 
            refreshing={this.state.refreshing}
            value={this.state.totalValue}
            username={this.state.username}
            favourite={this.state.favourite}
            email={this.state.email}
            title_id={this.state.title_id}
          />
        </LinearGradient>
      </ScrollView>
    );
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
  cashText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
});
