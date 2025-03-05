import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import ImageUpload from '@/components/ImageUpload';

const Home: FC = () => {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/hydra.jpg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to BloomIQ!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>Curious about a flower? Take a picture or upload one from your gallery, and BloomIQ will tell you what it is!</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="Capture"
          icon="camera"
          onPress={() => router.push('/camera')}
          backgroundColor={Colors.dark.primaryButton}
          width={160}
        />
         <View style={{ width: 20 }} /> 
         <ImageUpload /> 
      </View>
    </ParallaxScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: undefined,
    transform: [{ scale: 1.3 }],
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});