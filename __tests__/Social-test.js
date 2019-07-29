/**
 * @format
 */

import 'react-native';
import React from 'react';
import Social from '../screens/Social.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<Social />).toJSON();
  expect(tree).toMatchSnapshot();
});
