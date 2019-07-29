import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Switch,
} from 'react-native';
import Firebase from 'firebase';
import Swipeable from 'react-native-swipeable';
import RBSheet from 'react-native-raw-bottom-sheet';
import TouchableGraph from '../components/TouchableGraph.js';
import db from '../Database.js';
import MyInput from '../components/MyInput.js';
import MyErrorModal from '../components/MyErrorModal.js';
import { nameToIconMap, background, rowBackground } from '../Masterlist.js';

export default class Info extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      name: null,
      data: null,
      rate: null,
      graphDays: 30,
      alerts: null,
      alertValue: '',
      currentlyOpenedItem: null,
      refreshing: false,

      // Error Modal states
      isErrorVisible: false,
      errorTitle: "Error",
      errorPrompt: "",
    };

    this.addAlert = this.addAlert.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.refreshAlerts = this.refreshAlerts.bind(this);
    this.deleteAlert = this.deleteAlert.bind(this);
    this.toggleAlert = this.toggleAlert.bind(this);
    this.closeOpenedItem = this.closeOpenedItem.bind(this);
    this.openItem = this.openItem.bind(this);
    this.invalidPrice = this.invalidPrice.bind(this);
  }

  async componentDidMount() {    
    try {
      const { navigation } = this.props;
      const data = navigation.getParam('data', null);
      const name = navigation.getParam('name', null);
      const uid = navigation.getParam('uid', null);
      const rate = data.market_data.current_price.usd.toFixed(2);
      const alerts = await db.getAlerts(uid, name);
      this.setState({
        uid: uid,
        name: name,
        data: data,
        rate: rate,
        alerts: alerts,
      });
    } catch (error) {
      console.log(error);
    }
  }

  invalidPrice() {
    this.setState({
      isErrorVisible: true,
      errorTitle: "Invalid price!",
      errorPrompt: "Please enter a valid positive number.",
    });
  }

  async addAlert() {
    try {
      if ((this.state.alertValue) <= 0 || isNaN(this.state.alertValue)) {
        console.log(this.state.alertValue);
        this.invalidPrice();
        return;
      }

      this.RBSheet.close();

      let newAlerts = [...this.state.alerts];
      newAlerts.push({
        index: this.state.alerts.length,
        price: this.state.alertValue,
        notifyWhenAbove: Number(this.state.alertValue) > this.state.rate,
        active: true,
      });

      this.setState({
        alertValue: '',
        alerts: newAlerts,
      });

      await db.addAlert(
        this.state.name,
        this.state.uid,
        this.state.alertValue,
        Number(this.state.alertValue) > this.state.rate,
        true
      );
    } catch (error) {
      console.log(error);
    }
  }

  async toggleAlert(index) {
    try {
      let alerts = [...this.state.alerts];
      alerts[index].active = !alerts[index].active;
      this.setState({ alerts });
      await db.toggleAlert(this.state.uid, index, this.state.name);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAlert(index) {
    try {
      this.state.currentlyOpenedItem.recenter();

      let newAlerts = [...this.state.alerts];
      newAlerts.splice(index, 1);
      newAlerts.forEach((obj, index) => obj.index = index);

      this.setState({
        currentlyOpenedItem: null,
        alerts: newAlerts,
      });

      await db.deleteAlert(this.state.uid, index, this.state.name);
    } catch (error) {
      console.log(error);
    }
  }

  closeOpenedItem() {
    if (this.state.currentlyOpenedItem !== null) {
      this.state.currentlyOpenedItem.recenter();
      this.setState({
        currentlyOpenedItem: null,
      })
    }
  }

  openItem(ref) {
    if (this.state.currentlyOpenedItem !== null
      && this.state.currentlyOpenedItem !== ref) {
      this.state.currentlyOpenedItem.recenter();
    }
    this.setState({ currentlyOpenedItem: ref});
  }


  renderRow({ item }) {
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
        onRef={ref => item.ref = ref}
        rightButtons={rightButtons}
        onRightButtonsOpenRelease={() => this.openItem(item.ref)}
        onRightButtonsCloseRelease={() => {
          this.setState({
            currentlyOpenedItem: null
          })
        }}
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
          <View style={{ 
            flexDirection: 'row',
            justifyContent: 'flex-end', 
            flex: 1,
            marginRight: 5,
          }}>
            <Switch
              value={item.active}
              onValueChange={() => this.toggleAlert(item.index)}
            />
          </View>
        </View>
      </Swipeable>
    )
  }

  async refreshAlerts() {
    try {
      this.setState({
        refreshing: true,
      });
      const alerts = await db.getAlerts(this.state.uid, this.state.name);
      this.setState({
        alerts: alerts,
        refreshing: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.data === null || this.state.data === undefined) {
      return (
          <View style={styles.container}></View>
      );
    }

    const infoCard = (
      <View
        style={styles.infoCard}
      >
        <View style={styles.infoLine}>
          <Text style={styles.infoText}>24h Volume</Text>
          <Text style={styles.infoValue}>
            ${db.stringify(this.state.data.market_data.total_volume.usd)}
          </Text>
        </View>
        <View style={styles.infoLine}>
          <Text style={styles.infoText}>Circulating Supply</Text>
          <Text style={styles.infoValue}>
            {db.stringify(this.state.data.market_data.circulating_supply)}
          </Text>
        </View>
        <View style={styles.infoLine}>
          <Text style={styles.infoText}>Market Cap</Text>
          <Text style={styles.infoValue}>
            ${db.stringify(this.state.data.market_data.market_cap.usd)}
          </Text>
        </View>
      </View>
    );

    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
      </View>
    )

    const icon = (
      <Image
        source={nameToIconMap[this.state.name]}
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
    );

    const above = (
      <Text style={styles.wildcard}> above</Text>
    );

    const below = (
      <Text style={styles.wildcard}> below</Text>
    );

    const AlertSheet = (
      <ScrollView
        contentContainerStyle={styles.RBcontainer}
        keyboardShouldPersistTaps="always"
      >
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
            <MyInput
              value={db.stringify(String(this.state.alertValue))}
              onChangeText={value => Number(db.unStringify(value)) > 999999 
                ? this.setState({
                    state: this.state,
                  })
                : this.setState({
                  alertValue: db.unStringify(value),
                })}
              placeholder={ this.state.alertValue === ''
                ? '0.00'
                : this.state.alertValue}
              keyboardType='numeric'
              leftText="$"
              width="100%"
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
      </ScrollView>
    );

    const noAlerts = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginBottom: 30,
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No alerts to show
        </Text>
      </View>
    );

    const alertList = (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <FlatList
          style={styles.flatStyle}
          data={this.state.alerts}
          renderItem={this.renderRow}
          keyExtractor={item => item.index.toString()}
        />
      </View>
    );
    
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onScroll={this.closeOpenedItem}
        keyboardShouldPersistTaps="always"
      >
        <MyErrorModal
          visible={this.state.isErrorVisible}
          close={() => this.setState({ isErrorVisible: false })}
          title={this.state.errorTitle}
          prompt={this.state.errorPrompt}
        />

        <View
          style={styles.row}
        >
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
            flex: 1,
            marginVertical: 10,
            // justifyContent: "center",
          }}>
            <TouchableGraph
              name={this.state.name}
              height={300}
              width={Math.round(Dimensions.get('window').width) - 30}
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

        {infoCard}

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
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={() => this.RBSheet.open()}
              >
                <Text style={{ fontSize: 40, color: '#ffffff' }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.refreshing
            ? loading
            : this.state.alerts.length === 0
              ? noAlerts
              : alertList}
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={260}
            duration={200}
            customStyles={{
              container: {
                backgroundColor: background,
                justifyContent: 'center',
                alignItems: 'stretch',
              }
            }}
            closeOnDragDown={true}
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
    marginHorizontal: 14,
  },
  container: {
    flex: 1,
    backgroundColor: background,
    flexDirection: 'column',
  },
  contentContainer: {
    backgroundColor: background,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingHorizontal: 18,
    marginHorizontal: 14,
    marginTop: 0,
  },
  deleteButton: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#e55b6e',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  alertRow: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 10,
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
    marginHorizontal: 14,
  },
  button: {
    elevation: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  selected: {
    elevation: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: rowBackground,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  RBcontainer: {
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  alertValueContainer: {
    alignSelf: "center",
    marginHorizontal: -10,
  },
  alertDetail: {
    color: '#dbdbdb',
    fontWeight: '500',
    fontSize: 20,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  infoCard: {
    marginHorizontal: 14,
    marginTop: 18,
    borderRadius: 5,
    alignItems: "flex-start",
    padding: 5,
    backgroundColor: rowBackground,
  },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    flex: 1,
    fontSize: 18, 
    color: '#bec4d8', 
    fontWeight: '500',
    margin: 10,
  },
  infoValue: {
    flex: 2,
    fontSize: 18, 
    color: '#ffffff', 
    fontWeight: '500',
    margin: 10,
    textAlign: "right",
  }
})
