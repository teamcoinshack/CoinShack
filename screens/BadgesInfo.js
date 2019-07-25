import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {
  background,
  rowBackground,
  textHeader,
  textSubheader,
  allBadgesInfo
} from '../Masterlist.js';
import MyBadge from '../components/MyBadge.js';

export default class BadgesInfo extends Component {
  constructor(props) {
    super(props);

    this.badgesData = this.props.navigation.getParam("badgesData");
  }

  renderRow = ({ item }) => {
    let achieved = item.name in this.badgesData && this.badgesData[item.name];
    return (
      <View style={styles.row}>
        <MyBadge
          name={item.name}
          achieved={achieved}
        />
        <View style={styles.info}>
          <Text style={achieved ? styles.titleObtained : styles.titleUnobtained}>
            {item.title}
          </Text>
          <Text style={styles.desc}>
            {achieved ? item.infoObtained : item.infoUnobtained}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={allBadgesInfo}
        renderItem={this.renderRow}
        keyExtractor={item => item.name}
        style={styles.flatList}
        contentContainerStyle={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: background,
    marginVertical: -14,
  },
  container: {
    backgroundColor: background,
    padding: 14,
  },
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: rowBackground,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 4,
    marginBottom: 14,
  },
  info: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 4,
    marginRight: 10,
    alignSelf: 'stretch',
  },
  titleObtained: {
    color: textHeader,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleUnobtained: {
    color: textSubheader,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    color: textSubheader,
    fontWeight: '500',
  }
});