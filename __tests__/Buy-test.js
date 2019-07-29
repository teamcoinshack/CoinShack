/**
 * @format
 */

import 'react-native';
import React from 'react';
import Buy from '../screens/Buy.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const paramFunction = (param) => {
  if (param === 'id') {
    return 'BTC';
  } else if (param === 'rate') {
    return '10000'; 
  } else if (param === 'uid') {
    return '9jttvm2HMzNFHD3DnhGDqTNrNje2';
  } else if (param === 'cash') {
    return '100000';
  } else if (param === 'callback') {
    return () => {};
  } else if (param === 'path') {
    return require('../assets/icons/BTC.png');
  } else if (param === 'stockValue') {
    return '1.5';
  } else {
    return null;
  }
}

const createTestProps = (props: Object) => ({
  navigation: {
    getParam: paramFunction
  },
  ...props
});

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  let props: any;
  props = createTestProps({});
  const tree = renderer.create(<Buy {...props}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
