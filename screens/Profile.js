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
import Masterlist from '../Masterlist.js';
import q from '../Query.js';

const background = '#373b48';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      refreshing: false,
    }
    this.refresh = this.refresh.bind(this);
  }

  async componentDidMount() {
    try {
      await this.refresh();
    } catch(error) {
      console.log(error);
    }
  }

  async refresh() {
    try {
      this.setState({
        refreshing: true,
      });
      const currs = Masterlist.map(a => Object.assign({}, a));
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      let totalValue = snap.val().cash;
      for (let i = 0; i < currs.length; i++) {
        const curr = currs[i];
        const data = await q.fetch(curr.name);
        const rate = data.market_data.current_price.usd;
        let amountOfCoins;
        amountOfCoins = (data.symbol.toUpperCase() in snap.val())
                        ? snap.val()[data.symbol.toUpperCase()]
                        : 0;
        totalValue += (rate * amountOfCoins); 
      }
      this.setState({
        totalValue: '$' + db.stringify(totalValue.toFixed(2)),
        refreshing: false,
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
        <ProfileTab 
          refreshing={this.state.refreshing}
          value={this.state.totalValue}
        />
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
