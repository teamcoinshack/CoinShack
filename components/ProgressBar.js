import React from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
} from 'react-native';
import { rowBackground } from '../Masterlist.js';
import { Bar } from 'react-native-progress';
import Title from './Title.js';
import db from '../Database.js';

const tier = [0, 0, 11000, 15000, 20000, 30000, 50000];

export default ProgressBar = props => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={styles.header}>Progress</Text>
    <View style={styles.bar}>
      <Bar
        progress={
          props.titleid >= 6
            ? 1 // max title
            : (props.totalValue - tier[props.title_id])
                / (tier[props.title_id + 1] - tier[props.title_id])
              || 0 // if NaN, i.e., while loading
        }
        height={18}
        width={null}
        borderWidth={0}
        borderRadius={5}
        color="#00dce8"
        unfilledColor={rowBackground}
      />
    </View>
    <View style={styles.row}>
      {props.title_id < 6
        ? (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleHeader}>Current title:  </Text>
              <Title title_id={props.title_id} fontSize={18} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleHeader}>Next title:  </Text>
              <Title title_id={props.title_id + 1} fontSize={18} />
            </View>
            <Text style={{ color: '#dbdbdb', fontSize: 18 }}>
              Earn ${db.stringify((tier[props.title_id + 1] - props.totalValue).toFixed(2))} more to attain the next title!
            </Text>
          </View>
        )
        : (<Title title_id={props.title_id} />)}
    </View>
  </View>
);

ProgressBar.defaultProps = {
  title_id: 1
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    color: '#dbdbdb',
    fontWeight: '600',
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 16,
    marginBottom: 10,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground,
    flexDirection: 'column',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 14,
  },
  bar: {
    marginHorizontal: 14,
  },
  titleHeader: {
    color: '#dbdbdb',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  }
})
