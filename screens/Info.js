import React, {Component} from 'react';
import {
  Text, 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  FlatList, 
  Button,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Firebase from 'firebase';
import Graph from '../components/Graph.js';
import db from '../Database.js';
import q from '../Query.js';

export default class Info extends React.Component {
  render() {
    
  }
}

const styles = StyleSheet.create({
  row: {
    elevation: 1,
    borderRadius: 5,
    backgroundColor: '#515360',
    flex: 1,
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
  },
})
