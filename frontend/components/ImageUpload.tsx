import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from './CustomButton';
import { Colors } from '@/constants/Colors';

const openAppSettings = () => {
  Linking.openSettings();
};

const ImageUpload: React.FC = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status === 'denied') {
      Alert.alert(
        'Permission Required',
        'To upload a photo, please enable media access in your settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
  
      // Navigate to the result page with the selected image
      router.push({
        pathname: '/result',
        params: { photoUri: imageUri },
      });
    }
  };

  return (
    <CustomButton
      text="Upload"
      icon="upload"
      onPress={pickImage}
      backgroundColor={Colors.dark.secondaryButton}
      width={160}
    />
  );
};

export default ImageUpload;
