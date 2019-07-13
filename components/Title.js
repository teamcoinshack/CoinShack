import React from 'react';
import {
  View,
  Text, 
  StyleSheet, 
} from 'react-native';
import q from '../Query.js';
import LinearGradient from 'react-native-linear-gradient';

export default Title = props => (
  props.title_id < 6
  ? (
    <Text style={styles['style' + props.title_id]}>
      {q.getTitle(props.title_id)}
    </Text>
    )
  : (
    <View style={{ flexDirection: 'row' }}>
      <Text style={styles.style61}>L</Text>
      <Text style={styles.style62}>E</Text>
      <Text style={styles.style63}>G</Text>
      <Text style={styles.style64}>E</Text>
      <Text style={styles.style65}>N</Text>
      <Text style={styles.style66}>D</Text>
      <Text style={styles.style67}>A</Text>
      <Text style={styles.style68}>R</Text>
      <Text style={styles.style69}>Y</Text>
    </View>
  )
)


const styles = StyleSheet.create({
  style1: {
    color: '#fff56e',
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
  style61: {
    color: '#ffb800',
    fontWeight: '700',
    fontSize: 18,
  },
  style62: {
    color: '#ffbf00',
    fontWeight: '700',
    fontSize: 18,
  },
  style63: {
    color: '#ffc400',
    fontWeight: '700',
    fontSize: 18,
  },
  style64: {
    color: '#ffc800',
    fontWeight: '700',
    fontSize: 18,
  },
  style65: {
    color: '#ffcc00',
    fontWeight: '700',
    fontSize: 18,
  },
  style66: {
    color: '#ffd000',
    fontWeight: '700',
    fontSize: 18,
  },
  style67: {
    color: '#ffd400',
    fontWeight: '700',
    fontSize: 18,
  },
  style68: {
    color: '#ffd600',
    fontWeight: '700',
    fontSize: 18,
  },
  style69: {
    color: '#ffdd00',
    fontWeight: '700',
    fontSize: 18,
  },
})
