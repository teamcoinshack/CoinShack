import React, { Component } from 'react';
import { LineChart, Grid } from  'react-native-svg-charts';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: this.props.stock,
      data: [],
      mapping: {
        BTC: 'bitcoin',
        ETH: 'ethereum',
      }
    };

    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch(this.state.stock);
  }
  
  fetch(stock) {
    fetch("https://api.coingecko.com/api/v3/coins/" 
          + this.state.mapping[stock] 
          + "/market_chart?vs_currency=usd&days=30")
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
