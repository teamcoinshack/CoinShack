/**
 * @format
 */

import 'react-native';
import React from 'react';
import EditProfile from '../screens/EditProfile.js';
import Firebase from 'firebase';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<EditProfile />).toJSON();
  expect(tree).toMatchSnapshot();
});
