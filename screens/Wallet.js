import React, {Component} from 'react';
import {
  Text, 
  ActivityIndicator, 
  View, 
  Image,
  StyleSheet, 
  FlatList, 
  Button, 
  TouchableOpacity,
  RefreshControl, 
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import db from '../Database.js';
import q from '../Query.js';

const background = '#373b48';

class Wallet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      cash: null,
      currs: [
        {name: 'bitcoin'},
        {name: 'ethereum'},
        {name: 'dash'},
        {name: 'ripple'},
        {name: 'litecoin'},
      ],
      paths: {
        bitcoin: require('../assets/icons/BTC.png'),
        ethereum: require('../assets/icons/ETH.png'),
        dash: require('../assets/icons/DASH.png'),
        ripple: require('../assets/icons/XRP.png'),
        litecoin: require('../assets/icons/LTC.png'),
      },
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
      path: this.state.paths[name],
    })
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.isFocused && this.props.isFocused) {
      try {
        await this.refresh();
      } catch (error) {
        console.log(error);
      }
    }
  }

  onRefresh() {
    this.setState({
      current: 0,
      refreshing: true,
      totalValue: null,
      cash: null,
      currs: [
        {name: 'bitcoin'},
        {name: 'ethereum'},
        {name: 'dash'},
        {name: 'ripple'},
        {name: 'litecoin'},
      ],
    }, function() { this.refresh() })
  }

  async refresh() {
    try {
      if (this.state.current >= this.state.currs.length) {
        this.setState({
          totalValue: Number(this.state.cash) 
                      + this.state
                            .currs
                            .map(x => x.value * x.rate)
                            .reduce((x, y) => x + y, 0),
          current: 0,
          refreshing: false,
        });
        return;
      }
      const uid = Firebase.auth().currentUser.uid;
      const curr = this.state.currs[this.state.current];
      const data = await q.fetch(curr.name);
      const snap = await db.getData(uid);
      if (this.state.current === 0) {
        this.setState({
          uid: uid,
          cash: snap.val().cash,
        })
      }
      curr.id = data.symbol.toUpperCase();
      curr.rate = data.market_data.current_price.usd;
      curr.change = Number(data.market_data.price_change_percentage_24h).toFixed(2);
      curr.value = snap.val()[data.symbol.toUpperCase()] === undefined 
                      ? 0
                      : Number(snap.val()[data.symbol.toUpperCase()]);
      let arr = this.state.currs;
      arr[this.state.current] = curr;
      this.setState({
        currs: arr,
        current: this.state.current + 1,
      })
      this.refresh();
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

  renderRow({item}) {
    const loading = (
      <View style={styles.loading1}>
        <ActivityIndicator color="#ffffff" />
      </View>
    )
    const Icon = (
      <Image
        source={this.state.paths[item.name]}
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
    const loading2 = (
      <View style={styles.loading2}>
        <ActivityIndicator color="#4a4d51" />
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
            ? loading2
            :walletValue}
        </View>
      </TouchableOpacity>
    )
  }
  
  render() {
    const money = db.stringify(Number(this.state.cash).toFixed(2));
    const loading = (
      <View style={styles.loading1}>
        <ActivityIndicator color="#ffffff" />
      </View>
    )
    const CashRow = (
      <TouchableOpacity 
        style={styles.cashRow}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/icons/cash.png')}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.cashName}>
            <Text style={styles.name}>Cash</Text>
          </View>
          <View style={{ 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            <Text style={this.state.cash === 0 
                          ? styles.noValue1 
                          : styles.cashValue}>
              {this.state.cash === undefined
               ? loading
               : '$' + money}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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

export default withNavigationFocus(Wallet);

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
