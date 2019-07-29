/**
 * @format
 */

import 'react-native';
import React from 'react';
import BuySellPage from '../screens/BuySellPage.js';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
test('renders correctly', () => {
  const tree = renderer.create(<BuySellPage />).toJSON();
  expect(tree).toMatchSnapshot();
});
