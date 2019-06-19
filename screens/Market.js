import React, {Component} from 'react';
import {
  Text, 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  FlatList, 
  Button,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import Graph from '../components/Graph.js';
import db from '../Database.js';
import q from '../Query.js';

const background = '#373b48';

class Market extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currs: [
        {name: 'bitcoin'},
        {name: 'ethereum'},
        {name: 'dash'},
        {name: 'ripple'},
        {name: 'litecoin'},
      ],
      datas: {},
      paths: {
        bitcoin: require('../assets/icons/BTC.png'),
        ethereum: require('../assets/icons/ETH.png'),
        dash: require('../assets/icons/DASH.png'),
        ripple: require('../assets/icons/XRP.png'),
        litecoin: require('../assets/icons/LTC.png'),
      },
      current: 0,
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
      path: this.state.paths[name],
    });
  }

  async componentDidMount() {
    try {
      await this.refresh()
    } catch(error) {
      console.log(error);
    }
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
          current: 0,
          refreshing: false,
        });
        return;
      }
      const curr = this.state.currs[this.state.current];
      const data = await q.fetch(curr.name);
      curr.data = data;
      curr.id = data.symbol.toUpperCase();
      curr.rate = data.market_data.current_price.sgd;
      curr.change = data.market_data.price_change_percentage_24h;
      let arr = this.state.currs;
      arr[this.state.current] = curr;
      let datas = this.state.datas;
      datas[curr.name] = data;
      this.setState({
        datas: datas,
        currs: arr,
        current: this.state.current + 1,
      })
      this.refresh();
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    const loading = (
      <View style={styles.loading}>
        <ActivityIndicator color="#ffffff" />
      </View>
    )
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
          {loading}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity 
        style={styles.row}
        onPress={() => this.load(item.name)}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            {item.rate === undefined 
              ? loading
              : Icon}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.id}</Text>
          </View>
          <View style={styles.ratesContainer}>
            {item.rate === undefined
              ? loading
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
            grid={true}
            days={30}
          />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
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

export default withNavigationFocus(Market);

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
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
    marginBottom: 6,
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
  loading: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
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
