import React from 'react';
import {
  View, 
  StyleSheet, 
} from 'react-native';
import { Avatar, Badge } from 'react-native-elements';

/*
  props.name is one of
  have1friend, 
  have5friends,
  have10friends,
  have50friends,
  spent10000atOnce,
  spent100000atOnce,
  earned10000atOnce,
  earned100000atOnce,
  own5coins,
  have10transactions,
  have50transactions,
  have100transactions
*/

export default MyBadge = props => {
  const images = {
    friend: require("../assets/icons/badges/friend.png"),
    spend: require("../assets/icons/badges/spend.png"),
    earn: require("../assets/icons/badges/earn.png"),
    own: require("../assets/icons/badges/own.png"),
    transact: require("../assets/icons/badges/transact.png")
  };

  const nameToImageMap = {
    have1friend: images.friend, 
    have5friends: images.friend,
    have10friends: images.friend,
    have50friends: images.friend,
    spent10000atOnce: images.spend,
    spent100000atOnce: images.spend,
    earned10000atOnce: images.earn,
    earned100000atOnce: images.earn,
    own5coins: images.own,
    have10transactions: images.transact,
    have50transactions: images.transact,
    have100transactions: images.transact
  };

  const nameToCountMap = {
    have1friend: "1", 
    have5friends: "5",
    have10friends: "10",
    have50friends: "50",
    spent10000atOnce: "10K",
    spent100000atOnce: "100K",
    earned10000atOnce: "10K",
    earned100000atOnce: "100K",
    own5coins: "5",
    have10transactions: "10",
    have50transactions: "50",
    have100transactions: "100"
  };

  if (props.achieved) { // achieved badge
    return (
      <View style={styles.container}>
        <Avatar
          rounded
          source={nameToImageMap[props.name]}
          overlayContainerStyle={styles.avatarOverlay}
          style={styles.avatar}
        />
        <Badge
          value={nameToCountMap[props.name]}
          status="success"
          containerStyle={styles.count}
        />
      </View>
    );
  } else { // haven't achieve badge
      return (
        <View style={styles.container}>
          <Avatar
            rounded
            source={nameToImageMap[props.name]}
            overlayContainerStyle={styles.avatarOverlay}
            avatarStyle={{ opacity: 0.2 }}
            style={styles.avatar}
          />
          <Badge
            value={nameToCountMap[props.name]}
            status="success"
            containerStyle={styles.count}
            badgeStyle={{ opacity: 0.2 }}
          />
        </View>
      );
  }
}

MyBadge.defaultProps = {
  name: "have1friend",
  achieved: false,
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  count: {
    position: 'absolute', top: -3, right: -3
  },
  avatar: {
    height: 70,
    width: 70
  },
  avatarOverlay: {
    backgroundColor: 'grey',
    padding: 10
  }
});
