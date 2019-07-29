/**
 * @format
 */

import 'react-native';
import React from 'react';
import Info from '../screens/Info.js';
import { data } from '../data.js'; 

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const paramFunction = (param) => {
  if (param === 'data') {
    return data;
  } else if (param === 'name') {
    return 'bitcoin'; 
  } else if (param === 'uid') {
    return '9jttvm2HMzNFHD3DnhGDqTNrNje2';
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
  const tree = renderer.create(<Info {...props}/>).toJSON();
  expect(tree).toMatchSnapshot();
});

