import React, { useRef, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    const request = async () => {
      await (!permission?.granted ? requestPermission() : null);
      setIsLoading(false);
    };
    request();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    photo?.uri ? setPhotoUri(photo.uri) : console.error('Error. Please try again.');
  };

  const submitPhoto = () => {
    console.log('Photo submitted:', photoUri);
    // TODO: Handle upload logic here
    router.back(); // TODO: navigate to final screen
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
      </View>
    );
  }

  if (!permission?.granted) return null; // TODO: Improve this scenario

  return (
    <ThemedView style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <CustomButton text="Retake" icon="reload1" onPress={() => setPhotoUri(null)} />
            <CustomButton text="Upload" icon="upload" onPress={submitPhoto} backgroundColor={Colors.dark.secondaryButton} />
          </View>
        </View>
      ) : (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <CustomButton text="Capture" icon="camera" onPress={takePicture} backgroundColor={Colors.dark.primaryButton} width={180} />
          </View>
        </CameraView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    position: 'absolute',
    width: '100%',
    height: '91%',
    borderRadius: 10,
    top: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
});