import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { rowBackground } from '../Masterlist.js';

// Required parameters are text, path, right(content)

export default MyRow = props => (
      <View 
        style={styles.row}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.imageContainer}>
            {props.isCash
              ? <Icon
                  name="cash-usd"
                  size={40}
                  color={'#ffffff'}
                />
              : <Image
                  source={props.path}
                  style={styles.imageStyle}
                />
            }
          </View>
          <View style={styles.cashName}>
            <Text style={styles.name}>
              {props.text}
            </Text>
          </View>
          <View style={{ 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            {props.right}
          </View>
        </View>
      </View>
);

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground, 
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
    height: 60,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40,
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
