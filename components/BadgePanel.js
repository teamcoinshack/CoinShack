import React from 'react';
import {
  Text, 
  View, 
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import MyBadge from './MyBadge.js';
import { rowBackground, allBadges } from '../Masterlist.js';

export default BadgePanel = props => {
  let unobtainedBadges = [];
  let achievedBadges = allBadges.filter(badge => {
    if (badge in props.badgesData && props.badgesData[badge]) {
      return true;
    } else {
      unobtainedBadges.push(badge);
      return false;
    }
  });

  return (
    <View style={{ flexDirection: 'column' }}>
      <Text style={styles.header}>Badges</Text>
      <ScrollView horizontal style={styles.row}>
        <TouchableOpacity
          onPress={props.onPress}
          style={{ flexDirection: "row" }}
          activeOpacity={0.4}
        >
          {achievedBadges.map((badge, key) => (
            <MyBadge
              key={key}
              name={badge}
              achieved
            />
          ))}

          {unobtainedBadges.map((badge, key) => (
            <MyBadge
              key={key}
              name={badge}
            />
          ))}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
    marginBottom: 10,
    marginHorizontal: 14,
  },
});
