import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, } from 'react-native';
import { VictoryChart, VictoryLine, VictoryVoronoiContainer,
  VictoryTooltip, VictoryAxis } from 'victory-native';
  import { Defs, LinearGradient, Stop } from 'react-native-svg';
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

    // api results:
    // 1 day - 5min intervals, 289 values
    // 7 days - 1h intervals, 169 values
    // 15 days - 1h intervals, 361 values
    // 30 days - 1h intervals, 723 values
    this.dayToPointsMap = {
      1: 12,
      7: 6,
      15: 12,
      30: 24,
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

      const res = await fetch("https://api.coingecko.com/api/v3/coins/" 
                              + this.props.name
                              + "/market_chart?vs_currency=usd&days="
                              + this.props.days);
      const resJSON = await res.json();

      let stockPrices = resJSON.prices;
      let data = [];
      for (let i = 0; i < stockPrices.length; i += this.dayToPointsMap[this.props.days]) { // i will depend on days TODO!
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

    return (
      <VictoryChart
        height={this.props.height}
        width={this.props.width}
        domainPadding={{ x: [20, 0], y: [20, 0] }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => `$${d[1].toFixed(2)}\n${this.getFormattedDate(d[0])}`}
            labelComponent={
              <VictoryTooltip
                cornerRadius={5}
                flyoutStyle={{ fill: "#dbdbdb" }}
                style={{ fontSize: 16 }}
              />
            }
          />
        }
      > 
        <Defs key='gradient'>
          <LinearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <Stop offset='0%' stopColor='#fefb5a'/>
            <Stop offset='100%' stopColor='#5afee8'/>
          </LinearGradient>
        </Defs>
        <VictoryAxis
          tickFormat={x => this.getXAxisLabel(x)}
          style={{
            axis: {stroke: "#dbdbdb"},
            ticks: {stroke: "#dbdbdb", size: 5},
            tickLabels: {fill: "#dbdbdb"},
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={y => this.getYAxisLabel(y)}
          style={{
            axis: {stroke: "#dbdbdb"},
            ticks: {stroke: "#dbdbdb", size: 5},
            tickLabels: {fill: "#dbdbdb"},
          }}
        />
        <VictoryLine
          data={this.state.data}
          x={0}
          y={1}
          style={{
            data: {
              stroke: "url(#gradient)"
            }
          }}
        />
      </VictoryChart>
    );
  }
}
