import React, { Component } from 'react';
import { VictoryChart, VictoryLine, VictoryVoronoiContainer,
  VictoryTooltip, VictoryAxis } from 'victory-native';
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
    this.getDDMM = this.getDDMM.bind(this);
    this.getHHMM = this.getHHMM.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
    this.getXAxisLabel = this.getXAxisLabel.bind(this);
    this.getYAxisLabel = this.getYAxisLabel.bind(this);
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

  getDDMM(unixTime) {
    let date = new Date(unixTime);
    // getMonth() starts from 0, Jan = 0
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  getHHMM(unixTime) {
    let date = new Date(unixTime);
    return `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}`;
  }

  getFormattedDate(unixTime) {
    let date = new Date(unixTime);
    // getMonth() starts from 0, Jan = 0
    return `${date.getDate()}/${date.getMonth() + 1} ` +
      `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}`;
  }

  getXAxisLabel(unixTime) {
    if (this.props.days === 1) {
      return this.getHHMM(unixTime);
    } else {
      return this.getDDMM(unixTime);
    }
  }

  getYAxisLabel(amount) {
    if (amount >= 1000) {
      return "$" + Math.round(amount / 1000) + "K";
    } else {
      return "$" + amount;
    }
  }

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
        height={this.props.height}
        width={this.props.width}
        domainPadding={{ x: [20, 0], y: [20, 0] }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => {
              return `$${d[1].toFixed(2)}\n${this.getFormattedDate(d[0])}`}}
            labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
          />
        }
      > 
        <VictoryAxis
          tickFormat={x => this.getXAxisLabel(x)}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={y => this.getYAxisLabel(y)} // should probably manually change x axis labels depending on graphDays
        />
        <VictoryLine
          data={this.state.data} // need to change data to fit x and y
          x={0}
          y={1}
        />
      </VictoryChart>
    );
  }
}
