import React, { Component } from 'react';
import {
  Text, 
  View, 
  ScrollView,
  ActivityIndicator, 
  TouchableOpacity,
  StyleSheet, 
  RefreshControl,
  Image,
} from 'react-native';
import MyButton from '../components/MyButton.js';
import Graph from '../components/Graph.js';
import db from '../Database.js';

const background = '#373b48';

export default class Info extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      path: null,
      data: null,
      graphDays: 30,
      alerts: null,
    }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const data = navigation.getParam('data', null);
      const name = navigation.getParam('name', null);
      const path = navigation.getParam('path', null);
      const uid = navigation.getParam('uid', null);
      const snap = await db.getData(uid);
      const alerts = snap.val().alerts === undefined 
                      ? [] 
                      : snap.val().alerts[name];
      this.setState({
        name: name,
        path: path,
        data: data,
        alerts: alerts
      });
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.data === null || this.state.data === undefined) {
      return null;
    }

    const icon = (
      <Image
        source={this.state.path}
        style={styles.imageStyle}
      />
    );

    const rate = this.state.data === null 
                 ? undefined
                 : Number(this.state.data.market_data.current_price.usd).toFixed(2);

    const currentPrice = (
      <Text style={styles.rate}>
        ${db.stringify(rate)}
      </Text>
    );

    const points = this.state.data === null
                   ? undefined
                   : this.state.data.market_data.price_change_percentage_24h;

    const change = (
      <Text style={points > 0 ? styles.up : styles.down}>
        {points > 0 
          ? ` (+ ${Number(points).toFixed(2)}%)`
          : ` (${Number(points).toFixed(2)}%)`}
      </Text>
    );

    const MarketButton = props => (
      <View style={{height: 50, flex: 1}}>
        <TouchableOpacity
          style={props.selected ? styles.selected : styles.button}
          onPress={props.onPress}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 20,
              fontWeight: '700',}}>
              {props.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )

    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.imageContainer}>
              {icon}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1)}
              </Text>
            </View>
            <View style={styles.ratesContainer}>
              {currentPrice}
              {change}
            </View>
          </View>
          <View style={{
            marginTop: 20,
            marginBottom: 20,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Graph 
              name={this.state.name} 
              height={200}
              width={300}
              tick={5}
              grid={true}
              days={this.state.graphDays}
              isLoading={true}
            />
          </View>
        </View>
        <View style={styles.graphDaysButtons}>
          <MarketButton
            text="24H"
            onPress={() => this.setState({ graphDays: 1 })}
            height={50}
            selected={this.state.graphDays === 1}
          />
          <MarketButton
            text="1W"
            onPress={() => this.setState({ graphDays: 7 })}
            height={50}
            selected={this.state.graphDays === 7}
          />
          <MarketButton
            text="15D"
            onPress={() => this.setState({ graphDays: 15 })}
            height={50}
            selected={this.state.graphDays === 15}
          />
          <MarketButton
            text="1M"
            onPress={() => this.setState({ graphDays: 30 })}
            height={50}
            selected={this.state.graphDays === 30}
          />
        </View>
        <View style={styles.alerts}>
          <View style={{ 
            marginTop: 10,
            flexDirection: 'row', 
          }}>
            <Text style={{ 
              fontSize: 25, 
              color: '#ffffff', 
              fontWeight: 'bold' 
            }}>
              Alerts
            </Text>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            <TouchableOpacity style={{
              height: 60,
              width: 60,
              backgroundColor: background,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 40, color: '#ffffff'}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  alerts: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 16,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    flexDirection: 'column',
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingLeft: 18,
    paddingRight: 18,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  imageStyle: {
    width: 40,
    height: 40,
  },
  rate: {
    fontSize: 17,
    fontWeight: '500',
    color: '#dbdbdb',
  },
  ratesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  up: {
    fontSize: 17,
    color: '#7aef82',
  },
  down: {
    fontSize: 17,
    color: '#ed4444',
  },
  graphDaysButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-evenly',
    marginTop: -5,
    marginLeft: 14,
    marginRight: 14,
  },
  button: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: background,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  selected: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
})
