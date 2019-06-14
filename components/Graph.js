import React, { Component } from 'react';
import { LineChart, Grid } from  'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: this.props.stock,
      data: [],
      mapping: {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        DASH: 'dash',
        XRP: 'ripple',
        LTC: 'litecoin',
      },
      isLoading: true,
    };

    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch(this.state.stock);
  }
  
  async fetch(stock) {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/" 
                  + this.state.mapping[stock] 
                  + "/market_chart?vs_currency=sgd&days=30");
      const resJSON = await res.json();
      let count = 0;
      let smooth = [];
      resJSON.prices.map(valuePair => valuePair[1])
                    .forEach(function(x) {
                      if (count === 0) {
                        count = 5;
                        smooth.push(x);
                      } else {
                        count--;
                      }
                    })
      this.setState({ 
        data: smooth, 
        isLoading: false,
      });
    } catch(error) {
        alert("stock not found");
    }
  }

  // current staic graph
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator color="#00ff00" />
        </View>
      )
    }
    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
          <Stop offset={'0%'} stopColor={'#fefb5a'}/>
          <Stop offset={'100%'} stopColor={'#5afee8'}/>
        </LinearGradient>
      </Defs>
    )
    return (
        <LineChart
            style={{ height: 300, width: 400 }}
            data={ this.state.data }
            svg={{ 
              stroke: 'url(#gradient)', 
              strokeWidth: 2,  
            }}
            contentInset={{ top: 20, bottom: 20 }}
        >
          <Gradient/>
        </LineChart>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: Math.round(Dimensions.get('window').width),
    height: 300, 
    justifyContent: 'center',
  }
})
