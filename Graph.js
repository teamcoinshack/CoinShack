import React, { Component } from 'react';
import { LineChart, Grid } from  'react-native-svg-charts';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.fetchBitcoinPrices = this.fetchBitcoinPrices.bind(this);
  }

  componentDidMount() {
    this.fetchBitcoinPrices();
  }
  
  fetchBitcoinPrices() {
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30")
      .then(res => res.json())
      .then(resJSON => {
        this.setState({ data: resJSON.prices.map(valuePair => valuePair[1]) });
      });
  }

  // current staic graph
  render() {
    return (
        <LineChart
            style={{ height: 400, width: 400 }}
            data={ this.state.data }
            svg={{ stroke: 'green' }}
            contentInset={{ top: 20, bottom: 20 }}
        >
            <Grid/>
        </LineChart>
    )
  }
}