import React, { useRef, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import LinearGradient from 'react-native-linear-gradient';

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
        <ActivityIndicator size="large" color="#6666FF" />
      </View>
    );
  }

  if (!permission?.granted) return null;

  return (
    <ThemedView style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
              <MaterialIcons name="refresh" size={24} color="white" />
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={submitPhoto}>
              <AntDesign name="upload" size={24} color="white" />
              <Text style={styles.text}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <AntDesign name="camera" size={24} color="white" />
              <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
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
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6666ff',
    padding: 15,
    borderRadius: 50,
    width: 180,
    height: 60,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6666FF',
    padding: 15,
    borderRadius: 50,
    width: 150,
    height: 60,
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    padding: 15,
    borderRadius: 50,
    width: 150,
    height: 60,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white',
  },
});
