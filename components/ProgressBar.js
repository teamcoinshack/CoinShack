import React from 'react';
import { 
  View, 
  Dimensions, 
  Text,
  StyleSheet, 
} from 'react-native';
import { rowBackground, background } from '../Masterlist.js';
import { Tooltip } from 'react-native-elements';
import { Bar } from 'react-native-progress';
import Title from './Title.js';
import db from '../Database.js';
const filled = '#00dce8';
const empty = '#000000';

EmptyUnit = props => ( 
  <View style={styles.emptyUnit} />
)
FilledUnit = props => ( 
  <View style={styles.filledUnit} />
)
let colors = [
  '#00dce8', '#00d0db', '#00c1cc', '#00b1ba', '#0098a1',
  '#00838a', '#006d73', '#00575c', '#00494d', '#00383b',
  '#002e30', '#002c2e', '#001f21', '#00181a', '#001200',
  '#001000', '#000900', '#000850', '#000800', '#000750',
  '#000700', '#000650', '#000600', '#000550', '#000500',
  '#000450', '#000400', '#000350', '#000300', '#000250',
  '#000200', '#000150', '#000100', '#000050', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
  '#000000', '#000000', '#000000', '#000000', '#000000',
];
HalfUnit = props => (
  colors.map((c, index) => (
    <View 
      key={index}
      style={{
        flex: 0.01,
        height: 20,
        borderColor: background,
        backgroundColor: c,
      }}
    />
  ))
)

HalfRightUnit = props => (
  colors.map((c, index) => (
    <View 
      key={index}
      style={{
        flex: 0.005,
        height: 20,
        borderColor: background,
        backgroundColor: c,
     }} />
  ))
)

EmptyRightUnit = props => (
  <View style={styles.emptyRightUnit} />
)

End = props => (
  <View style={styles.end} />
)

FilledRightUnit = props => (
  <View style={styles.rightUnit} />
)

const tier = [0, 0, 11000, 15000, 20000, 30000, 50000];

export default ProgressBar = props => (
  <View style={{ flexDirection: 'column' }}>
    <Text style={styles.header}>Progress</Text>
    <View style={styles.bar}><Bar
      progress={0.7} // TODO!
      height={18}
      width={null}
      borderWidth={0}
      borderRadius={5}
      color="#00dce8"
      unfilledColor={rowBackground}
    /></View>
    <View style={styles.row}>
      {props.title_id < 6
        ? (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleHeader}>Current title:  </Text>
              <Title title_id={props.title_id} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleHeader}>Next title:  </Text>
              <Title title_id={props.title_id + 1} />
            </View>
            <Text style={{ color: '#dbdbdb', fontSize: 15 }}>
              Earn ${db.stringify((tier[props.title_id + 1] - props.totalValue).toFixed(2))} more to attain the next title!
            </Text>
          </View>
        )
        : (<Title title_id={props.title_id} />)}
    </View>
  </View>


  // <View style={styles.row2}>
  //   <Text style={styles.header2}>Progress</Text>
  //   <Bar
  //     progress={0.7}
  //     height={18}
  //     borderWidth={0}
  //     borderRadius={5}
  //     color="#00dce8"
  //     unfilledColor={rowBackground}
  //   />
  //   <Tooltip
  //     popover={
  //       <View style={{ flexDirection: 'column' }}>
  //         <Text style={{ 
  //           color: '#ffffff', 
  //           fontWeight: 'bold', 
  //           fontSize: 18,
  //         }}>PROGRESS: {props.title_id}/6</Text>
  //         {props.title_id < 6
  //         ? (
  //           <View>
  //             <View style={{ flexDirection: 'row' }}>
  //               <Text style={{
  //                 color: '#dbdbdb',
  //                 fontWeight: 'bold',
  //                 fontSize: 14,
  //               }}>Current:  </Text>
  //               <Title title_id={props.title_id} />
  //             </View>
  //             <View style={{ flexDirection: 'row' }}>
  //               <Text style={{
  //                 color: '#dbdbdb',
  //                 fontWeight: 'bold',
  //                 fontSize: 14,
  //               }}>Next:  </Text>
  //               <Title title_id={props.title_id + 1} />
  //             </View>
  //             <View style={{ flexDirection: 'column' }}>
  //               <Text style={{ color: '#dbdbdb', fontSize: 15}}>
  //                 Earn ${db.stringify((tier[props.title_id + 1] - props.totalValue).toFixed(2))} more 
  //               </Text>
  //               <Text style={{ color: '#dbdbdb', fontSize: 15}}>
  //                 to attain the next title!
  //               </Text>
  //             </View>
  //           </View>
  //         )
  //         : ( <Title title_id={props.title_id} /> )}
  //       </View>
  //     }
  //     width={Math.round(Dimensions.get('window').width / 2)}
  //     height={120}
  //   >
  //   <View style={styles.bar2}>
  //     <View style={styles.leftUnit} />
  //     {props.title_id === 1
  //       ? <HalfUnit />
  //       : <FilledUnit />}
  //     {props.title_id === 2
  //       ? <HalfUnit />
  //       : props.title_id > 2
  //         ? <FilledUnit />
  //         : <EmptyUnit />}
  //     {props.title_id === 3
  //       ? <HalfUnit />
  //       : props.title_id > 3
  //         ? <FilledUnit />
  //         : <EmptyUnit />}
  //     {props.title_id === 4
  //       ? <HalfUnit />
  //       : props.title_id > 4
  //         ? <FilledUnit />
  //         : <EmptyUnit />}
  //     {props.title_id === 5
  //       ? ( 
  //           <View style={{ flexDirection: 'row', flex: 1, }}>
  //             <HalfRightUnit /><End />
  //           </View>
  //         )
  //       : props.title_id > 5
  //         ? <FilledRightUnit />
  //         : <EmptyRightUnit />
  //     }
  //   </View>
  //   </Tooltip>
  // </View>
)

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
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground,
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
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
    fontSize: 14,
    marginBottom: 6,
  },
  row2: {
    elevation: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 0,
    marginBottom: 6,
  },
  header2: {
    fontSize: 25,
    color: '#dbdbdb',
    fontWeight: '600',
  },
  bar2: {
    width: Math.round(Dimensions.get('window').width - 36),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 20,
    marginTop: 10,
  },
  unit: {
    flex: 1,
    height: 20,
    borderColor: background,
  },
  emptyUnit: {
    backgroundColor: '#000000',
    flex: 1,
    height: 20,
    borderColor: background,
  },
  filledUnit: {
    backgroundColor: '#00dce8',
    flex: 1,
    height: 20,
    borderColor: background,
  },
  leftUnit: {
    backgroundColor: filled,
    flex: 1,
    height: 20,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  end: {
    backgroundColor: empty,
    flex: 0.5,
    height: 20,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  emptyRightUnit: {
    backgroundColor: empty,
    flex: 1,
    height: 20,
    borderColor: background,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
  rightUnit: {
    backgroundColor: filled,
    flex: 1,
    height: 20,
    borderColor: background,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
})
