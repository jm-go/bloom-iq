import React, { useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AntDesign } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

export default function HomeScreen() {
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
        <ThemedText>Curious about a flower? Take a picture, and BloomIQ will tell you what it is!</ThemedText>
      </ThemedView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={() => console.log('Take Photo Pressed')}>
          <AntDesign name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

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
    alignItems: 'center',
    marginTop: 20,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});