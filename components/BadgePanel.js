import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Title from './Title.js';
import { rowBackground } from '../Masterlist.js';
//Required parameters are text, path, right(content)

EmptyBadge = props => (
  <View style={styles.emptyBadge} />
)

let count = new Array(5);

Badges = props => (
  count.map(x => (
    <EmptyBadge />
  ))
)
export default BadgePanel = props => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={styles.header}>Badges</Text>
    <View style={styles.row}>
      <EmptyBadge />
      <EmptyBadge />
      <EmptyBadge />
      <EmptyBadge />
      <EmptyBadge />
      <EmptyBadge />
    </View>
  </View>
);

BadgePanel.defaultProps = {
  textColor: "#ffffff",
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    color: '#dbdbdb',
    fontWeight: '600',
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 0,
    marginBottom: 10,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 0,
    marginBottom: 6,
    marginLeft: 14,
    marginRight: 14,
  },
  emptyBadge: {
    height: 50,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#00181a',
  },
});
