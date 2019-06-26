import React, { Component } from 'react';
import {
  Text, 
  View, 
  ScrollView,
  ActivityIndicator, 
  TouchableOpacity,
  StyleSheet, 
  RefreshControl,
  Dimensions,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import Firebase from 'firebase';
import Swipeable from 'react-native-swipeable';
import RBSheet from 'react-native-raw-bottom-sheet';
import MyButton from '../components/MyButton.js';
import Graph from '../components/Graph.js';
import db from '../Database.js';

const background = '#373b48';

export default class Info extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      name: null,
      path: null,
      data: null,
      rate: null,
      graphDays: 30,
      alerts: null,
      alertValue: '',
    }
    this.addAlert = this.addAlert.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.deleteAlert = this.deleteAlert.bind(this);
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const data = navigation.getParam('data', null);
      const name = navigation.getParam('name', null);
      const path = navigation.getParam('path', null);
      const uid = navigation.getParam('uid', null);
      const rate = data.market_data.current_price.usd.toFixed(2);
      const alerts = await db.getAlerts(uid, name);
      this.setState({
        uid: uid,
        name: name,
        path: path,
        data: data,
        rate: rate,
        alerts: alerts
      });
    } catch(error) {
      console.log(error);
    }
  }

  async addAlert() {
    try {
      if (this.state.alertValue <= 0) {
        alert('Invalid Price!');
        return;
      }
      this.RBSheet.close();
      await db.addAlert(
        this.state.name,
        Firebase.auth().currentUser.uid,
        this.state.alertValue,
        this.state.alertValue > this.state.rate,
        true
      );
      this.setState({
        alertValue: '',
      })
      //refresh alerts
      this.refreshAlerts();
    } catch(error) {
      console.log(error);
    }
  }
  
  async deleteAlert(index) {
    try {
      await db.deleteAlert(this.state.uid, index, this.state.name);
      this.refreshAlerts();
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    const rightButtons = [
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => this.deleteAlert(item.index)} 
      >
        <Image
          source={require('../assets/icons/trash.png')}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    ]
    const direction = item.notifyWhenAbove ? 'above ' : 'below ';

    return (
      <Swipeable 
        rightButtons={rightButtons}
      >
        <View style={styles.alertRow}>
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',

          }}>
            <Text style={styles.alertDetail}>
              {this.state.data.symbol.toUpperCase()} is 
              {' ' + direction + db.stringify(item.price)}
            </Text>
          </View>
        </View>
      </Swipeable>
    )
  }

  async refreshAlerts() {
    try {
      const alerts = await db.getAlerts(this.state.uid, this.state.name);
      this.setState({
        alerts: alerts
      });
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.data === null || this.state.data === undefined) {
      return (<View style={styles.container}></View>);
    }

    const icon = (
      <Image
        source={this.state.path}
        style={styles.imageStyle}
      />
    );

    const currentPrice = (
      <Text style={styles.rate}>
        ${db.stringify(this.state.rate)}
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
    const above = (
      <Text style={styles.wildcard}> above</Text>
    )

    const below = (
      <Text style={styles.wildcard}> below</Text>
    )

    const AlertSheet = (
      <View style={styles.RBcontainer}>
        <View style={styles.currentPriceContainer}>
          <View>
            <Text style={styles.currentPrice}>
              {this.state.data.symbol.toUpperCase()} is at ${db.stringify(this.state.rate)}
            </Text>
          </View>
        </View>
        <View style={styles.messageContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.message1}>
              Alert me when the price is
            </Text>
            {this.state.alertValue === ''
              ? null
              : Number(this.state.alertValue) >= this.state.rate
                ? above
                : below}
          </View>
          <View style={styles.alertValueContainer}>
            <Text style={styles.message1}>$</Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType='numeric'
              placeholderTextColor='#919191'
              placeholder={ this.state.alertValue === ''
                          ? '0.00'
                          : this.state.alertValue} 
              onChangeText={value => this.setState({
                alertValue: db.unStringify(value),
              })}
              value={db.stringify(String(this.state.alertValue))}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.buttonRow}
              onPress={this.addAlert}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                <Text style={{ color: '#14ffb0', fontSize: 20, fontWeight: '700', }}>
                  Add Alert
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
    const noAlerts = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No alerts to show
        </Text>
      </View>
    )

    const alertList = (
      <FlatList
        style={styles.flatStyle}
        data={this.state.alerts}
        renderItem={this.renderRow}
        keyExtractor={item => item.price}
      />
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
            marginTop: 5,
            flexDirection: 'row', 
            alignItems: 'center',
          }}>
            <Text style={{ 
              marginLeft: 5,
              fontSize: 25, 
              color: '#ffffff', 
              fontWeight: 'bold', 
            }}>
              Alerts
            </Text>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
              <TouchableOpacity 
                style={{
                  height: 60,
                  width: 60,
                  backgroundColor: background,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={() => this.RBSheet.open()}
              >
                <Text style={{ fontSize: 40, color: '#ffffff'}}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.alerts.length === 0
           ? noAlerts
           : alertList}
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={300}
              duration={250}
              customStyles={{
                container: {
                  backgroundColor: background,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }
              }}
            >
              {AlertSheet}
            </RBSheet>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  alerts: {
    flexDirection: 'column',
    marginLeft: 14,
    marginRight: 14,
  },
  container: {
    flex: 1,
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
  deleteButton: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#e55b6e',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 10,
  },
  alertRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 10,
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
  },
  RBcontainer: {
    width: Math.round(Dimensions.get('window').width),
    flex: 1,
  },
  currentPrice: {
    fontSize: 23,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  currentPriceContainer: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'column',
    margin: 20,
    marginTop: 0,
    alignItems: 'flex-start',
  },
  message1: {
    fontSize: 20,
    color: '#dbdbdb',
    fontWeight: '500',
  },
  textInput: {
    marginLeft: 3,
    textAlign: 'center',
    fontSize: 30,
    alignItems: 'center',
    color: '#ffffff',
  },
  wildcard: {
    fontSize: 20,
    color: '#7d96e8',
    fontWeight: '500',
  },
  buttonRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    margin: 20,
  },
  alertValueContainer: {
    borderBottomColor: '#515360',
    borderBottomWidth: 3,
    width: Math.round(Dimensions.get('window').width) - 40,
    marginTop: 5,
    flexDirection: 'row',
  },
  alertDetail: {
    color: '#dbdbdb',
    fontWeight: '500',
    fontSize: 20,
  },
  imageStyle: {
    height: 30,
    width: 30,
  }
})
