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

const background = '#373b48';

export default class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [] 
    }
    this.renderRow = this.renderRow.bind(this);
  }

  async componentDidMount() {
    try {
      const uid = Firebase.auth().currentUser.uid;
      const snap = await db.getData(uid);
      this.setState({
        history: snap.val().history,
      })
      console.log(snap.val().history);
    } catch(error) {
      console.log(error);
    }
  }

  renderRow({item}) {
    let d = new Date(item.date);
    const day = d.getDay();
    const month = d.getMonth();
    const year = d.getFullYear();

    let hour = d.getHours();
    const min = d.getMinutes();
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
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatStyle}
          data={this.state.history}
          renderItem={this.renderRow}
          keyExtractor={item => item.date}
        />
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
  }
});
