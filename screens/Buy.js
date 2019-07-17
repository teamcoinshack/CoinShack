import React from 'react';
import {
  TextInput, 
  Text, 
  View, 
  ScrollView,
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import db from '../Database.js';
import MyRow from '../components/MyRow.js';
import MyInput from '../components/MyInput.js';

const background = '#373b48';

export default class Buy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      id: null,
      rate: null,
      cash: null,
      actualMoneyBuy: '',
      displayMoneyBuy: '',
      displayStockBuy: '',
      input1: false,
      input2: false,
      refreshing: false,
      callback: null,
    }

    this.buyOnPress = this.buyOnPress.bind(this);
    this.resetState = this.resetState.bind(this);
    this.box1OnChangeText = this.box1OnChangeText.bind(this);
    this.box2OnChangeText = this.box2OnChangeText.bind(this);
  }

  resetState() {
    this.setState({ 
      refreshing: false,
      actualMoneyBuy: '',
      displayMoneyBuy: '',
      displayStockBuy: '',
      input1: false,
      input2: false,
    });
  }

  async buyOnPress() {
    try {
      if (this.state.actualMoneyBuy <= 0) {
        alert("Invalid amount!");
        this.resetState();
        return;
      }
      if (this.state.actualMoneyBuy < 1) {
        alert("Minimum purchase is $1");
        this.resetState();
        return;
      }
      this.setState({ refreshing: true });
      const res = await db.buy(
        this.state.uid,
        this.state.id,
        this.state.actualMoneyBuy,
        this.state.rate,
      )
      if (res === 0) {
        this.state.callback();
        this.props.navigation.navigate('Main');
      }
      this.resetState();
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid', null);
    const id = navigation.getParam('id', null);
    const rate = navigation.getParam('rate', null);
    const cash = navigation.getParam('cash', null);
    const stockValue = navigation.getParam('stockValue', null);
    const callback = navigation.getParam('callback', null);
    this.setState({
      callback: callback,
      uid: uid,
      id: id,
      rate: rate,
      cash: cash,
      stockValue: stockValue,
    })
  }

  box1OnChangeText(value) {
    Number(db.unStringify(value)) > 999999999999
      ? this.setState({
          state: this.state,
        })
      : this.setState({
          input1: String(value) === '' ? false : true,
          input2: false,
          actualMoneyBuy: String(value) === ''
            ? '0'
            : db.unStringify(value),
          displayMoneyBuy: String(value) === ''
            ? '0.00'
            : db.stringify(db.unStringify(String(value))),
          displayStockBuy: db.stringify(
            (Number(db.unStringify(String(value))) / this.state.rate).toFixed(5)
          ),
        })
  }

  box2OnChangeText(value) {
    Number(db.unStringify(value)) > 99999
      ? this.setState({
          state: this.state,
        })
      : this.setState({
          input1: false,
          input2: String(value) === '' ? false : true,
          displayStockBuy: String(value) === ''
            ? '0.00000'
            : db.stringify(db.unStringify(String(value))),
          actualMoneyBuy: Number(db.unStringify(String(value)) * this.state.rate),
          displayMoneyBuy: db.stringify(
            (Number(db.unStringify(value)) * this.state.rate).toFixed(2)
          ),
        })
  }

  render() {
    const loading = (
      <View style={styles.loading}>
        <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
            flexStart={true}
          />
        </View>
      </View>
    );

    const money = db.stringify(Number(this.state.cash).toFixed(2));

    const cashValue = (
      <Text style={this.state.cash === 0 
                    ? styles.noValue1 
                    : styles.cashValue}>
         ${money}
      </Text>
    );

    const walletValue = (
      <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text style={this.state.stockValue === 0 
                          ? styles.noValue1 
                          : styles.stockValue1}>
          ${db.stringify((this.state.stockValue * this.state.rate).toFixed(2))}
        </Text>
        <Text style={this.state.stockValue === 0 
                          ? styles.noValue2
                          : styles.stockValue2}>
          {db.stringify(Number(this.state.stockValue).toFixed(3))} {this.state.id}
        </Text>
      </View>
    );

    const box1 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholderTextColor='#919191'
        placeholder={ this.state.actualMoneyBuy === ''
                    ? '0.00'
                    : this.state.displayMoneyBuy} 
        onChangeText={value => Number(db.unStringify(value)) > 999999999999 
        ? this.setState({
            state: this.state,
        })
        : this.setState({ 
            input1: String(value) === '' ? false : true,
            input2: false,
            actualMoneyBuy: String(value) === '' 
              ? '0' 
              : db.unStringify(value),
            displayMoneyBuy: String(value) === '' 
              ? '0.00' 
              : db.stringify(db.unStringify(String(value))),
            displayStockBuy:db.stringify(
              (Number(db.unStringify(String(value)))/this.state.rate).toFixed(5)
            ),
          })
        }
        value={!this.state.input1
          ? ''
          :this.state.displayMoneyBuy
        }
      />
    );

    const box2 = (
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType='numeric'
        placeholderTextColor='#919191'
        placeholder= { this.state.displayStockBuy === ''
                   ? '0.000'
                   : this.state.displayStockBuy}
        onChangeText={value => Number(db.unStringify(value)) > 99999
        ? this.setState({
          state: this.state,
        })
        : this.setState({ 
            input1: false,
            input2: String(value) === '' ? false : true,
            displayStockBuy: String(value) === '' 
              ? '0.00000' 
              : db.stringify(db.unStringify(String(value))),
            actualMoneyBuy: Number(db.unStringify(String(value))*this.state.rate),
            displayMoneyBuy: db.stringify(
              (Number(db.unStringify(value))*this.state.rate).toFixed(2)
            ),
          })
        }
        value={!this.state.input2
            ? '' 
            : this.state.displayStockBuy
        }
      />
    );

    const button = (
      <TouchableOpacity
        style={styles.buttonRow}
        onPress={this.buyOnPress}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ color: '#14ffb0', fontSize: 20, fontWeight: '700', }}>
            Buy
          </Text>
        </View>
      </TouchableOpacity>
    );

    const inputs = (
      <View styles={{ backgroundColor: 'white' }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-end', 
          justifyContent: 'center',
          width: '80%',
        }}>
          {/* <Text style={this.state.input1 ? styles.selected : styles.unselected}>
            $
          </Text>
          {box1} */}
          <MyInput
            leftText="$"
            placeholder={
              this.state.actualMoneyBuy === ''
                ? '0.00'
                : this.state.displayMoneyBuy
            }
            onChangeText={this.box1OnChangeText}
            value={
              !this.state.input1
                ? ''
                :this.state.displayMoneyBuy
            }
            keyboardType='numeric'
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          {button}
        </View>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-end', 
        }}>
          {/* {box2}
          <Text style={this.state.input2 ? styles.selected : styles.unselected}>
            {this.state.id}
          </Text> */}
          <MyInput
            rightText={this.state.id}
            placeholder={
              this.state.displayStockBuy === ''
                ? '0.000'
                : this.state.displayStockBuy
            }
            onChangeText={this.box2OnChangeText}
            value={
              !this.state.input2
                ? '' 
                : this.state.displayStockBuy
            }
            keyboardType='numeric'
          />
        </View>
      </View>
    )
    
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={{
          backgroundColor: background,
        }}
      >
        <View style={styles.container}>
          <View style={{
            marginTop: 10,
            marginBottom: 40,
          }}>
            <MyRow 
              text='Cash'
              isCash
              path={require('../assets/icons/cash.png')}  
              right={cashValue}
            />
            <MyRow
              text={this.state.id}
              path={this.props.navigation.getParam('path', null)}
              right={walletValue}
            />
          </View>
          {this.state.refreshing ? loading : inputs }
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: background,
  },
  loading: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  textInput: {
    width: 250,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 30,
    alignItems: 'center',
    color: '#ffffff',
  },
  selected: {
    color: '#ffffff',
    fontSize: 30,
  },
  unselected: {
    color: '#919191',
    fontSize: 30,
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
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  noValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#74777c',
    fontWeight: '500',
  },
  noValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#74777c',
    fontWeight: '500',
  },
  value1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  value2: {
    fontSize: 17,
    color: '#a8a8a8',
  },
  stockValue1: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  stockValue2: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 15,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  cashValue: {
    paddingLeft: 16,
    flex: 0,
    fontSize: 20,
    color: '#aeb3c4', 
    fontWeight: '600',
  },
  cashName: {
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
});
