import React from 'react';
import {
  View,
  Text, 
  StyleSheet, 
} from 'react-native';
import q from '../Query.js';

export default Title = props => (
  props.title_id < 6
  ? (
    <Text style={{ fontSize: props.fontSize, ...styles['style' + props.title_id] }}>
      {q.getTitle(props.title_id)}
    </Text>
    )
  : (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: props.fontSize, ...styles.style61 }}>L</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style62 }}>E</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style63 }}>G</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style64 }}>E</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style65 }}>N</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style66 }}>D</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style67 }}>A</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style68 }}>R</Text>
        <Text style={{ fontSize: props.fontSize, ...styles.style69 }}>Y</Text>
      </View>
    )
)

Title.defaultProps = {
  fontSize: 15,
}


const styles = StyleSheet.create({
  style1: {
    color: '#d9ff96',
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  style2: {
    color: '#eb8305',
    fontWeight: '700',
  },
  style3: {
    color: '#67d12e',
    fontWeight: '700',
  },
  style4: {
    color: '#2ec6d1',
    fontWeight: '700',
  },
  style5: {
    color: '#d273ff',
    fontWeight: '700',
  },
  style61: {
    color: '#fab300',
    fontWeight: '700',
  },
  style62: {
    color: '#ffbf00',
    fontWeight: '700',
  },
  style63: {
    color: '#ffc400',
    fontWeight: '700',
  },
  style64: {
    color: '#ffc800',
    fontWeight: '700',
  },
  style65: {
    color: '#ffcc00',
    fontWeight: '700',
  },
  style66: {
    color: '#ffd000',
    fontWeight: '700',
  },
  style67: {
    color: '#ffd400',
    fontWeight: '700',
  },
  style68: {
    color: '#ffd600',
    fontWeight: '700',
  },
  style69: {
    color: '#ffdd00',
    fontWeight: '700',
  },
})
