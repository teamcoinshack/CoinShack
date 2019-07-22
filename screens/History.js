import React, {Component} from 'react';
import {
  Text, 
  View, 
  Dimensions,
  StyleSheet, 
  FlatList, 
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import Firebase from 'firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import db from '../Database.js';
import MyBar from '../components/MyBar.js';

const background = '#373b48';

export default class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [], 
      refreshing: true,
    }
    this.renderRow = this.renderRow.bind(this);
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      let hist = ('history' in snap.val()) ? snap.val().history : [];
      this.setState({
        history: hist,
        refreshing: false,
      })
    } catch (error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    console.log(item.date);
    let d = new Date(item.date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    let hour = d.getHours();
    let min = d.getMinutes();
    min = min < 10 ? '0' + min : min;
    const postfix = hour >= 12 ? ' PM' : ' AM';
    hour = hour > 13 ? hour - 12 : hour;

    const dateString = 
      day + '/' + month + '/' + year + ' - ' + hour + ':' + min + postfix;
    return (
      <View
        style={styles.row}
      >
        <View style={{
          flexDirection: 'row',
          flex: 1,
        }}>
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            {item.buy 
              ? ( <Text style={styles.buy}>BUY</Text> )
              : ( <Text style={styles.sell}>SELL</Text> ) }
            <Text style={styles.row2}>
              {db.stringify(item.coinValue.toFixed(5)) 
                + ' ' + item.symbol + ' @ $' + db.stringify(item.rate)}
            </Text>
            <Text style={styles.row3}>
              {dateString}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const noHistory = (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginTop: 20,
      }}>
        <Text style={{
          color: '#7c7c7c',
          fontWeight: '500',
          fontSize: 23,
        }}>
          No history to show
        </Text>
      </View>
    )
    const loading = (
      <View style={styles.loading1}>
          <MyBar
            height={65}
            width={Math.round(Dimensions.get('window').width * 0.7)}
          />
      </View>
    )
    const historyList = (
        <FlatList
          style={styles.flatStyle}
          data={this.state.history}
          renderItem={this.renderRow}
          keyExtractor={item => item.date}
        />
    )
    return (
      <View style={styles.container}>
        {this.state.refreshing
          ? loading
          : this.state.history.length === 0
            ? noHistory
            : historyList}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flatStyle: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: background,
    justifyContent: 'center'
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  buy: {
    color: '#14ff81', 
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    fontWeight: '600',
  },
  sell: {
    color: '#ff077a', 
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,
    fontWeight: '600',
  },
  row2: {
    color: '#dbdbdb',
    fontWeight: '600',
    fontSize: 18,
    paddingTop: 5,
  },
  row3: {
    color: '#a4a9b9',
    fontWeight: '500',
    paddingTop: 5,
    fontSize: 15,
  },
  loading1: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
