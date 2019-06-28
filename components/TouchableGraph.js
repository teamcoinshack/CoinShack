import React, { Component } from 'react';
import { VictoryChart, VictoryLine, VictoryVoronoiContainer, VictoryTooltip } from 'victory-native';
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
    this.getFormattedDate = this.getFormattedDate.bind(this);
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

      // api results:
      // 1 day - 5min intervals
      // 7 days and above - 1h intervals 
      const res = await fetch("https://api.coingecko.com/api/v3/coins/" 
                              + this.props.name
                              + "/market_chart?vs_currency=usd&days="
                              + this.props.days);
      const resJSON = await res.json();

      let stockPrices = resJSON.prices;
      console.log(stockPrices.length); //

      let data = [];
      for (let i = 0; i < stockPrices.length; i += 24) { // i will depend on days TODO!
        data.push(stockPrices[i]);
      }
      this.setState({ 
        data: data, 
        isLoading: false,
      });
    } catch(error) {
      console.log(error);
      alert("Stock not found"); // change this error message?
    }
  }

  getFormattedDate(unixTime) {
    let date = new Date(unixTime);
    // getMonth() starts from 0, Jan = 0
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
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

    // TODO FIX STYLING AND CHANGE TOOLBOX CONTENT
    // NOW TESTING FIRST
    return (
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => {
              return `$${d[1].toFixed(2)}\n${this.getFormattedDate(d[0])}`}}
            labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
          />
        }
      >
        <VictoryLine
          data={this.state.data} // need to change data to fit x and y
          x={0}
          y={1}
        />
      </VictoryChart>
    );
  }
}
