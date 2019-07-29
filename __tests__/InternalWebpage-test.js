/**
 * @format
 */

import 'react-native';
import React from 'react';
import InternalWebpage from '../screens/InternalWebpage.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
const paramFunction = (param) => {
  if (param === 'url') {
    return 'www.google.com';
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
  const tree = renderer.create(<InternalWebpage {...props}/>).toJSON();
  expect(tree).toMatchSnapshot();
});
