import React from 'react';
import {
  Text, 
  View, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MyBadge from './MyBadge.js';
import { rowBackground } from '../Masterlist.js';
// Required parameters are text, path, right(content)

export default BadgePanel = props => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={styles.header}>Badges</Text>
    <ScrollView horizontal style={styles.row}>
      <TouchableOpacity onPress={props.onPress} style={{ flexDirection: "row" }}>
        <MyBadge name="have10friends" achieved/>
        <MyBadge name="spent100000atOnce" achieved/>
        <MyBadge name="earned10000atOnce" achieved/>
        <MyBadge name="own5coins" achieved/>
        <MyBadge name="have50transactions" achieved/>
        <MyBadge/>
        <MyBadge/>
        <MyBadge/>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

BadgePanel.defaultProps = {
  onPress: () => {}
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
    marginTop: 0,
    padding: 2.5,
    marginBottom: 6,
    marginHorizontal: 14,
  },
});
