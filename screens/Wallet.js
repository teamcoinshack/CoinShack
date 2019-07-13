import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import q from '../Query.js';
import Masterlist, { nameToIconMap } from '../Masterlist.js';

const background = '#373b48';

export default class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      cash: null,
      currs: Masterlist.map(a => Object.assign({}, a)),
      totalValue: null,
      refreshing: false,
      current: 0,
    }

    this.renderRow = this.renderRow.bind(this);
    this.load = this.load.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  load(name) {
    this.props.navigation.navigate('BuySellPage',{
      uid: this.state.uid,
      name: name,
      callback: this.refresh,
    })
  }

  async onRefresh() {
    try {
      this.setState({
        current: 0,
        refreshing: true,
        cash: null,
        currs: Masterlist.map(a => Object.assign({}, a)),
      }, function() { this.refresh() })
    } catch(error) {
      console.log(error);
    }
  }

  async refresh() {
    try {
      if (this.state.current >= this.state.currs.length) {
        const total = Number(this.state.cash)
                      + this.state
                            .currs
                            .map(x => x.value * x.rate)
                            .reduce((x, y) => x + y, 0);
        this.setState({
          current: 0,
          refreshing: false,
          totalValue: total,
        }) 
        return;
      }
      let snaps;
      if (this.state.current === 0) {
        // for first query, snap
        const uid = Firebase.auth().currentUser.uid;
        const snap = await db.getData(uid);
        await this.setState({
          data: snap.val(),
          uid: uid,
          cash: snap.val().cash,
        })
        snaps = snap.val();
      } else {
        snaps = this.state.data;
      }
      const curr = this.state.currs[this.state.current];
      const data = await q.fetch(curr.name);
      const wallet = ('wallet' in snaps) ? snaps.wallet : {};
      curr.id = data.symbol.toUpperCase();
      curr.rate = data.market_data.current_price.usd;
      curr.change = Number(data.market_data.price_change_percentage_24h).toFixed(2);
      curr.value = (!(curr.id in wallet))
                      ? 0
                      : Number(wallet[curr.id]);
      let arr = this.state.currs;
      arr[this.state.current] = curr;
      this.setState({
        currs: arr,
        current: this.state.current + 1,
      }, () => this.refresh())
    } catch (error) {
      console.log(error);
      this.refresh();
    }
  }

  async componentDidMount() {
    try {
      await this.refresh();
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({ item }) {
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width)}
            flexStart={true}
          />
      </View>
    )
    const Icon = (
      <Image
        source={nameToIconMap[item.name]}
        style={styles.imageStyle}
      />
    )
    if (item.rate === undefined) {
      return (
      <TouchableOpacity
        style={styles.row}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={styles.imageContainer}>
            {Icon}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.id}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            {loading}
          </View>
        </View>
      </TouchableOpacity>
      )
    }
    const currentPrice = (
      <Text style={styles.rate}>
        ${db.stringify(Number(item.rate).toFixed(2))}
      </Text>
    )
    const change = (
      <Text style={item.change > 0 ? styles.up : styles.down}>
        {item.change > 0
          ? ' (+' + item.change + '%)'
          : ' ' + '('+item.change + '%)'}
      </Text>
    )
    const walletValue = (
      <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text style={item.value === 0
                          ? styles.noValue1
                          : styles.stockValue1}>
          ${db.stringify((item.value * item.rate).toFixed(2))}
        </Text>
        <Text style={item.value === 0
                          ? styles.noValue2
                          : styles.stockValue2}>
          {db.stringify(Number(item.value).toFixed(3))} {item.id}
        </Text>
      </View>
    )
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.load(item.name)}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            {Icon}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.id}</Text>
            {item.rate === undefined
              ? loading
              : currentPrice}
            {item.rate === undefined
             ? null
             : change}
          </View>
          {item.rate === undefined
            ? null
            :walletValue}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const money = db.stringify(Number(this.state.cash).toFixed(2));
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width)}
          />
      </View>
    )
    const cashValue = (
      <Text style={!this.state.cash || this.state.cash === 0 
                    ? styles.noValue1 
                    : styles.cashValue}>
         ${money}
      </Text>
    );
    const CashRow = ( 
      <MyRow 
        text='Cash'
        isCash
        right={cashValue}
      />
    )
    const assetsValue = (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          $
        </Text>
        <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          {db.stringify(Number(this.state.totalValue).toFixed(2))}
        </Text>
      </View>
    );
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 20, alignItems: 'center', }}>
          {this.state.totalValue === null
            ? loading
            : assetsValue}
        </View>
        {CashRow}
        <FlatList
          style={styles.flatStyle}
          data={this.state.currs}
          renderItem={this.renderRow}
          keyExtractor={item => item.name}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
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
    marginBottom: 6,
  },
  cashRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
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
    marginBottom: 6,
    height: 60,
  },
  cashName: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nameContainer: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  loading1: {
    alignItems: 'flex-start',
    flex: 0,
  },
  loading2: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rate: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 17,
    color: '#a4a9b9',
    fontWeight: '500',
  },
  cashValue: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4',
    fontWeight: '600',
  },
  stockValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4',
    fontWeight: '600',
  },
  stockValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#aeb3c4',
    fontWeight: '600',
  },
  flatStyle: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
  },
  buttonStyle: {
    fontSize: 30,
    justifyContent: 'flex-start',
  },
  noValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#74777c',
    fontWeight: '500',
  },
  noValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#74777c',
    fontWeight: '500',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  up: {
    fontSize: 17,
    color: '#7aef82',
  },
  down: {
    fontSize: 17,
    color: '#ed4444',
  },
});
