import React from 'react';
import {
  View,
  Text, 
  StyleSheet, 
} from 'react-native';
import q from '../Query.js';
import {LinearTextGradient} from 'react-native-text-gradient';

export default Title = props => (
  props.title_id < 6
  ? (
    <Text style={styles['style' + props.title_id]}>
      {q.getTitle(props.title_id)}
    </Text>
    )
  : (
    <View>
    <LinearTextGradient
      style={styles.style6}
      locations={[0, 1]}
      colors={[ '#ffdc14', '#ffee00' ]}
      start= {{ x:0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text>LEGENDARY</Text>
    </LinearTextGradient>
    </View>
  )
)


const styles = StyleSheet.create({
  style1: {
    color: '#faed27',
    fontWeight: '700',
    fontSize: 18,
  },
  style2: {
    color: '#eb8305',
    fontWeight: '700',
    fontSize: 18,
  },
  style3: {
    color: '#67d12e',
    fontWeight: '700',
    fontSize: 18,
  },
  style4: {
    color: '#2ec6d1',
    fontWeight: '700',
    fontSize: 18,
  },
  style5: {
    color: '#b635f2',
    fontWeight: '700',
    fontSize: 18,
  },
  style6: {
    color: '#ffd700',
    fontWeight: '700',
    fontSize: 18,
  },
})
