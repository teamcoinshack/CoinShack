/**
 * @format
 */

import 'react-native';
import React from 'react';
import History from '../screens/History.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<History />).toJSON();
  expect(tree).toMatchSnapshot();
});
