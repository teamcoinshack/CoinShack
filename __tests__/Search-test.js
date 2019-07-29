/**
 * @format
 */

import 'react-native';
import React from 'react';
import Search from '../screens/Search.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
const paramFunction = (param) => {
  return () => {};
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
  const tree = renderer.create(<Search {...props}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
