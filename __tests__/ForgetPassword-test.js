/**
 * @format
 */

import 'react-native';
import React from 'react';
import ForgetPassword from '../screens/ForgetPassword.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<ForgetPassword />).toJSON();
  expect(tree).toMatchSnapshot();
});
