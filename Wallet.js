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
import db from './Database.js';
import q from './Query.js';

class Wallet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: '',
      cash: '',
      stocks: [
        {id: 'BTC'},
        {id: 'ETH'},
        {id: 'DASH'},
        {id: 'XRP'},
        {id: 'LTC'},
      ],
      totalValue: '',
      refreshing: false,
    }

    this.renderRow = this.renderRow.bind(this); 
    this.load = this.load.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  
  load(id) {
    this.props.navigation.navigate('BuySellPage',{
      id: this.state.id,
      stock: id,
      rate: this.state
                .stocks
                .filter(x => x.id === id)[0]
                .rate,
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
      refreshing: true,
      stocks: [
        {id: 'BTC'},
        {id: 'ETH'},
        {id: 'DASH'},
        {id: 'XRP'},
        {id: 'LTC'},
      ],
    }, function() { this.refresh() })
  }

  async refresh() {
    const uid = Firebase.auth().currentUser.uid;
    const rates = [
      {
        id: 'BTC',
        name: 'bitcoin',
      },
      {
        id: 'ETH',
        name: 'ethereum',
      },
      {
        id: 'DASH',
        name: 'dash',
      },
      {
        id: 'XRP',
        name: 'ripple',
      },
      {
        id: 'LTC',
        name: 'litecoin',
      },
    ]

    masterObject = {};
    rates.forEach(async function(stock) {
      try {
        const data = await q.fetch(stock.name);
        masterObject[stock.id] = {
          rate: data.market_data.current_price.sgd,
          image: data.image.small,
          change: data.market_data.price_change_percentage_24h,
        }
      } catch(error) {
        console.log(error);
      }
    })
    await Promise.all(rates);

    try {
      const snap = await db.getData(uid);
      this.setState({
              id: uid,
              cash: snap.val().cash,
              stocks: this.state.stocks
                          .map(item => ({
                            id: item.id,
                            rate: masterObject[item.id].rate,
                            value: snap.val()[item.id] === undefined
                                  ? 0 
                                  : Number(snap.val()[item.id]),
                            image: masterObject[item.id].image,
                            change: masterObject[item.id].change,
                          }))
      })

      this.setState({
          totalValue: Number(this.state.cash) 
                      + this.state
                            .stocks
                            .map(x => x.value * x.rate)
                            .reduce((x, y) => x + y, 0),
          refreshing: false,
      })
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    await this.refresh();
    console.log(this.state.stocks);
  }

  renderRow({item}) {
    const loading = (
      <View style={styles.loading1}>
        <ActivityIndicator color="#4a4d51" />
      </View>
    )
    const currentPrice = (
      <Text style={styles.rate}>
        ${Number(item.rate).toFixed(2)}
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
        onPress={() => this.load(item.id)}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.nameIcon}>
            <Text style={styles.name}>{item.id}</Text>
            {item.rate === undefined
              ? loading
              : currentPrice}
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
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>
          Total Assets: ${db.stringify(Number(this.state.totalValue).toFixed(2))}
        </Text>
        <Text style={{fontSize: 20, textAlign: 'center'}}>Cash: ${money}</Text>
        <FlatList
          style={styles.flatStyle}
          data={this.state.stocks}
          renderItem={this.renderRow}
          keyExtractor={item => item.id}
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
    backgroundColor: '#99c0ff',
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
  nameIcon: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
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
    color: '#4a4d51',
  },
  stockValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
  },
  stockValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
  },
  flatStyle: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    marginTop: 14,
    alignSelf: "stretch",
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
  },
  noValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#74777c',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
});
