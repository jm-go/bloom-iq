import React, { FC, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const squareSize = width * 0.95;

const Camera: FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setPhotoUri(null);
    }, [])
  );

  useEffect(() => {
    const request = async () => {
      await (!permission?.granted ? requestPermission() : null);
      setIsLoading(false);
    };
    request();
  }, []);

  useEffect(() => {
    if (!permission) return;
    if (permission.status === 'denied') {
      router.replace('/');
    }
  }, [permission]);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();

    if (photo?.uri) {
      setPhotoUri(photo.uri);
    } else {
      console.error('Error capturing image. Please try again.');
    }
  };

  const submitPhoto = () => {
    if (!photoUri) return;
    router.push({ pathname: '/result', params: { photoUri } });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
      </ThemedView>
    );
  }

  if (!permission?.granted) return null;

  return (
    <ThemedView style={styles.container}>
      {photoUri ? (
        <ThemedView style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <ThemedView style={styles.previewButtonContainer}>
            <CustomButton text="Retake" icon="reload1" onPress={() => setPhotoUri(null)} />
            <CustomButton text="Upload" icon="upload" onPress={submitPhoto} backgroundColor={Colors.dark.secondaryButton} />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} facing="back" ratio="1:1">
            <ThemedView style={styles.squareOverlay} />
          </CameraView>
          <ThemedView style={styles.buttonContainer}>
            <CustomButton text="Capture" icon="camera" onPress={takePicture} backgroundColor={Colors.dark.primaryButton} width={180} />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, 
  },
  camera: {
    width: squareSize,
    height: squareSize,
  },
  squareOverlay: {
    position: 'absolute',
    width: squareSize,
    height: squareSize,
    borderWidth: 1,
    borderColor: Colors.dark.grey,
    backgroundColor: 'transparent',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, 
  },
  previewImage: {
    width: squareSize,
    height: squareSize,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    gap: 20,
    bottom: 100,
  },
});

