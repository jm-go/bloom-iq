import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ImageUpload from '../ImageUpload';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  return {
    ...ReactNative,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('test ImageUpload.tsx', () => {
  const mockRouterPush = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders correctly', () => {
    const { toJSON } = render(<ImageUpload />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('requests permissions and opens gallery when button is pressed', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-image-uri' }],
    });

    const { getByText } = render(<ImageUpload />);
    const button = getByText('Upload');

    fireEvent.press(button);

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith({
        pathname: '/result',
        params: { photoUri: 'test-image-uri' },
      });
    });
  });

  it('shows alert when permission is denied', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { getByText } = render(<ImageUpload />);
    const button = getByText('Upload');

    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission Required',
        'To upload a photo, please enable media access in your settings.',
        expect.any(Array)
      );
    });
  });

  it('does nothing when image selection is canceled', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: true,
    });

    const { getByText } = render(<ImageUpload />);
    const button = getByText('Upload');

    fireEvent.press(button);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});
