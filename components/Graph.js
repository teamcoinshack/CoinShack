import React, { Component } from 'react';
import { LineChart, Grid } from  'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: this.props.stock,
      height: this.props.height,
      width: this.props.width,
      data: [],
      isLoading: true,
    };

    this.fetchStockPrices = this.fetchStockPrices.bind(this);
  }

  componentDidMount() {
    this.fetchStockPrices(this.state.stock);
  }
  
  async fetchStockPrices(stock) {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/" 
                              + this.props.name
                              + "/market_chart?vs_currency=sgd&days="
                              + this.props.days);
      const resJSON = await res.json();

      let stockPrices = resJSON.prices.map(valuePair => valuePair[1]);
      let data = [];
      for (let i = 0; i < stockPrices.length; i += this.props.tick) {
        data.push(stockPrices[i]);
      }

      this.setState({ 
        data: data, 
        isLoading: false,
      });
    } catch(error) {
      console.log(error);
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
      <Defs key='gradient'>
        <LinearGradient id='gradient' x1='0' y='0%' x2='100%' y2='0%'>
          <Stop offset='0%' stopColor='#fefb5a'/>
          <Stop offset='100%' stopColor='#5afee8'/>
        </LinearGradient>
      </Defs>
    )

    return (
        <LineChart
            style={{ height: this.props.height, width: this.props.width }}
            data={ this.state.data }
            svg={{ 
              stroke: 'url(#gradient)', 
              strokeWidth: 2,  
            }}
            contentInset={{ top: 20, bottom: 20 }}
        >
          <Gradient/>
          {this.props.grid ? <Grid /> : null}
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
