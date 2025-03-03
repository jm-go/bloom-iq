import React from 'react';
import renderer from 'react-test-renderer';
import CustomButton from '../CustomButton';
import { Colors } from '@/constants/Colors';

describe('test CustomButton.tsx', () => {
  it('renders correctly with default props', () => {
    const tree = renderer.create(
      <CustomButton text="Take a Photo" onPress={() => {}} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a custom background color and icon', () => {
    const tree = renderer.create(
      <CustomButton
        text="Retake"
        onPress={() => {}}
        backgroundColor={Colors.dark.primaryButton}
        icon="reload1"
        width={180}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a different text color', () => {
    const tree = renderer.create(
      <CustomButton
        text="Upload"
        onPress={() => {}}
        backgroundColor={Colors.dark.secondaryButton}
        textColor={Colors.dark.text}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
