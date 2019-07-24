import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import { rowBackground } from '../Masterlist.js';

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
  have100transactions,
  have50transactions,
  have10transactions
*/

// const badgeToIconMap = {
//   have1friend: "user-friends", 
//   have5friends: "user-friends",
//   have10friends: "user-friends",
//   have50friends: "user-friends",
//   spent10000atOnce,
//   spent100000atOnce,
//   earned10000atOnce,
//   earned100000atOnce,
//   own5coins,
//   have100transactions,
//   have50transactions,
//   have10transactions
// }

export default MyBadge = props => {
  return (
    <Avatar
      size="small"
      rounded
      source={require("../assets/icons/badges/spend.png")}
      overlayContainerStyle={{ backgroundColor: 'orange' }}
    />
  );
  // if (props.achieved) { // achieved badge
  //   return (
  //     <Avatar
  //       size="small"
  //       rounded
  //       source={require("../assets/icons/badges/spend.png")}
  //       overlayContainerStyle={{ backgroundColor: 'orange' }}
  //     />
  //   );
  // } else { // haven't achieve badge
  //     return (
  //       <Avatar
  //         size="small"
  //         rounded
  //         icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
  //         overlayContainerStyle={{ backgroundColor: 'grey' }}
  //       />
  //     );
  // }
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
