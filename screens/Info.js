import React, { Component } from 'react';
import {
  Text, 
  View, 
  ScrollView,
  ActivityIndicator, 
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
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const data = navigation.getParam('data', null);
    const name = navigation.getParam('name', null);
    const path = navigation.getParam('path', null);
    // console.log(path);
    this.setState({
      name: name,
      path: path,
      data: data,
    });
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

    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.imageContainer}>
              {icon}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{this.state.name}</Text>
            </View>
            <View style={styles.ratesContainer}>
              {currentPrice}
              {change}
            </View>
          </View>
          <View style={{
            marginTop: 20,
          }}>
            <Graph 
              name={this.state.name} 
              height={200}
              width={300}
              tick={10}
              grid={true}
              days={this.state.graphDays}
            />
          </View>

          {/* <View style={styles.description}>
            <Text style={{
              color: '#ffffff',
              fontSize: 15,
            }}>
              {this.state.data.description.en}
            </Text>
          </View> */}
        </View>

        <View style={styles.graphDaysButtons}>
            <MyButton
              text="24H"
              onPress={() => this.setState({ graphDays: 1 })}
              width={100}
            />
            <MyButton
              text="1W"
              onPress={() => this.setState({ graphDays: 7 })}
              width={100}
            />
            <MyButton
              text="15D"
              onPress={() => this.setState({ graphDays: 15 })}
              width={100}
            />
            <MyButton
              text="1M"
              onPress={() => this.setState({ graphDays: 30 })}
              width={100}
            />
          </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
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
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  }
})
