import React, { FC, useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const squareSize = width * 0.8; // 80% of screen width

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
      console.error('Error. Please try again.');
    }
  };

  const submitPhoto = () => {
    if (!photoUri) return;
    router.push({ pathname: '/result', params: { photoUri } });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
      </View>
    );
  }

  if (!permission?.granted) return null;

  return (
    <ThemedView style={styles.container}>
      {photoUri ? (
  <View style={styles.previewContainer}>
    {/* Blurred Background */}
    <BlurView intensity={50} style={[styles.blurOverlay, styles.topBlur]} />
    <BlurView intensity={50} style={[styles.blurOverlay, styles.bottomBlur]} />
    <BlurView intensity={50} style={[styles.blurOverlay, styles.leftBlur]} />
    <BlurView intensity={50} style={[styles.blurOverlay, styles.rightBlur]} />

    {/* Square Preview Image */}
    <Image source={{ uri: photoUri }} style={styles.previewImage} />

    {/* Buttons */}
    <View style={styles.buttonContainer}>
      <CustomButton text="Retake" icon="reload1" onPress={() => setPhotoUri(null)} />
      <CustomButton text="Upload" icon="upload" onPress={submitPhoto} backgroundColor={Colors.dark.secondaryButton} />
    </View>
  </View>
) : (
        <CameraView style={styles.camera} facing="back" ref={cameraRef} zoom={0}>
          {/* Blurred areas */}
          <BlurView intensity={50} style={[styles.blurOverlay, styles.topBlur]} />
          <BlurView intensity={50} style={[styles.blurOverlay, styles.bottomBlur]} />
          <BlurView intensity={50} style={[styles.blurOverlay, styles.leftBlur]} />
          <BlurView intensity={50} style={[styles.blurOverlay, styles.rightBlur]} />

          {/* Transparent Square */}
          <View style={styles.clearSquare} />

          <View style={styles.buttonContainer}>
            <CustomButton text="Capture" icon="camera" onPress={takePicture} backgroundColor={Colors.dark.primaryButton} width={180} />
          </View>
        </CameraView>
      )}
    </ThemedView>
  );
}

export default Camera;

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
    width: squareSize,
    height: squareSize,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'black',
    // resizeMode: 'cover',
  },
  
  // buttonContainer: {
  //   position: 'absolute',
  //   bottom: 100,
  //   left: 0,
  //   right: 0,
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   width: '100%',
  //   paddingHorizontal: 20,
  // },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  blurOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  blur: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  topBlur: {
    top: 0,
    left: 0,
    right: 0,
    height: (height - squareSize) / 2,
  },

  bottomBlur: {
    bottom: 0,
    left: 0,
    right: 0,
    height: (height - squareSize) / 2,
  },

  leftBlur: {
    top: (height - squareSize) / 2,
    left: 0,
    width: (width - squareSize) / 2,
    height: squareSize,
  },

  rightBlur: {
    top: (height - squareSize) / 2,
    right: 0,
    width: (width - squareSize) / 2,
    height: squareSize,
  },

  clearSquare: {
    position: 'absolute',
    top: (height - squareSize) / 2,
    left: (width - squareSize) / 2,
    width: squareSize,
    height: squareSize,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});