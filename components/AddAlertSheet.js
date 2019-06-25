import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
const background = '#373b48';
import db from '../Database.js';

export default Sheet = props => {
  return (
    <View style={styles.container}>
      <View style={styles.currentPriceContainer}>
        <View style={{ flex: 1}}>
          <Text style={styles.currentPrice}>Current Price</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.currentPrice}>
            ${db.stringify(props.rate)}
          </Text>
        </View>
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
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
    flex: 1,
    alignItems: 'flex-start',
  },
  rateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
})
