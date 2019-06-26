import React, { Component } from 'react';
import { VictoryChart, VictoryLine } from 'victory-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { Dimensions, StyleSheet, View, } from 'react-native';
import MyBar from './MyBar.js';

// TODO
export default class TouchableGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: this.props.stock,
      height: this.props.height,
      width: this.props.width,
      data: [],
      isLoading: this.props.isLoading,
    };

    this.fetchStockPrices = this.fetchStockPrices.bind(this);
  }

  componentDidMount() {
    this.fetchStockPrices(this.state.stock);
  }

  componentDidUpdate(prevProps) {
    if (this.props.days !== prevProps.days) {
      this.fetchStockPrices(this.state.stock);
    }
  }
  
  async fetchStockPrices(stock) {
    try {
      this.setState({
        isLoading: true,
      });
      const res = await fetch("https://api.coingecko.com/api/v3/coins/" 
                              + this.props.name
                              + "/market_chart?vs_currency=usd&days="
                              + this.props.days);
      const resJSON = await res.json();

      let stockPrices = resJSON.prices.map(valuePair => valuePair[1]);
      let data = [];
      let min = stockPrices[0]
      let max = stockPrices[0]
      for (let i = 0; i < stockPrices.length; i += this.props.tick) {
        min = stockPrices[i] < min ? stockPrices[i] : min;
        max = stockPrices[i] > max ? stockPrices[i] : max;
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
        <MyBar
          height={this.state.height}
          width={Math.round(Dimensions.get('window').width)}
        />
      )
    }

    return (
      <VictoryChart>
        <VictoryLine
          data={this.state.data}
          x={0}
          y={1}
        />
      </VictoryChart>
    );
  }
}
