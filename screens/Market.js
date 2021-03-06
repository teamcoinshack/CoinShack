import React, { Component } from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Firebase from 'firebase';
import Graph from '../components/Graph.js';
import db from '../Database.js';
import q from '../Query.js';
import MyBar from '../components/MyBar.js';
import Masterlist, {
  nameToIconMap,
  background,
  rowBackground,
} from '../Masterlist.js';

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coins: Masterlist.map(a => Object.assign({}, a)),
      datas: {},
      currLoadingIndex: 0,
      refreshing: false,
    }
    
    this.renderRow = this.renderRow.bind(this); 
    this.refresh = this.refresh.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.load = this.load.bind(this);
  }

  load(name) {
    this.props.navigation.navigate('Info', {
      data: this.state.datas[name],
      name: name,
      coin: name.charAt(0).toUpperCase() + name.slice(1),
      uid: Firebase.auth().currentUser.uid,
    });
  }

  async componentDidMount() {
    try {
      await this.refresh()
    } catch (error) {
      console.log(error);
    }
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      coins: Masterlist.map(a => Object.assign({}, a)),
    }, function() { this.refresh() })
  }

  async refresh() {
    try {
      if (this.state.currLoadingIndex >= this.state.coins.length) {
        this.setState({
          currLoadingIndex: 0,
          refreshing: false,
        });
        return;
      }
      
      const currentCoin = this.state.coins[this.state.currLoadingIndex];
      const data = await q.fetch(currentCoin.name);
      currentCoin.data = data;
      currentCoin.id = data.symbol.toUpperCase();
      currentCoin.rate = data.market_data.current_price.usd;
      currentCoin.change = data.market_data.price_change_percentage_24h;
      let arr = this.state.coins;
      arr[this.state.currLoadingIndex] = currentCoin;
      let datas = this.state.datas;
      datas[currentCoin.name] = data;
      this.setState({
        datas: datas,
        coins: arr,
        currLoadingIndex: this.state.currLoadingIndex + 1,
      })
      this.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({ item }) {
    const currentPrice = (
      <Text style={styles.rate}>
        ${db.stringify(Number(item.rate).toFixed(2))}
      </Text>
    )

    const change = (
      <Text style={item.change > 0 ? styles.up : styles.down}>
        {item.change > 0 
          ? ' (+' + Number(item.change).toFixed(2) + '%)'
          : ' ' + '('+ Number(item.change).toFixed(2) + '%)'}
      </Text>
    )

    const icon = (
      <Image
        source={nameToIconMap[item.name]}
        style={styles.imageStyle}
      />
    )

    if (item.rate === undefined) {
      return (
        <View 
          style={styles.loadingRow}
        >
          <View style={{ 
            flexDirection: 'row', 
          }}>
            <View style={styles.imageContainer}>
              {icon}
            </View>
          </View>
          <MyBar
            height={200}
            width={Math.round(Dimensions.get('window').width)}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity 
        onPress={() => this.load(item.name)}
        style={styles.row}
      >
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.imageContainer}>
              {item.rate === undefined 
                ? null
                : icon}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.id}</Text>
            </View>
            <View style={styles.ratesContainer}>
              {item.rate === undefined
                ? null
                : currentPrice}
              {item.change === undefined
                ? null
                : change}
            </View>
          </View>
          <View style={{
            marginTop: 20,
          }}>
            <Graph 
              name={item.name} 
              height={200}
              width={300}
              tick={10}
              grid={false}
              days={30}
            />
          </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View 
        style={styles.container}
      >
        <FlatList
          style={styles.flatStyle}
          data={this.state.coins}
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
    backgroundColor: rowBackground,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 14,
  },
  loadingRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 14,
  },
  nameContainer: {
    paddingLeft: 18,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    color: '#dbdbdb', 
    fontWeight: '600',
  },
  ratesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rate: {
    fontSize: 17,
    fontWeight: '500',
    color: '#dbdbdb',
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
