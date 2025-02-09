import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';

const Result: React.FC = () => {
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (photoUri) {
      setIsLoading(true);
      setTimeout(() => {
        setResult("It looks like it's a Dandelion."); // FAKE identification result for now
        setIsLoading(false);
      }, 2000); // Simulate a delay of 2 seconds for now, to be improved
    }
  }, [photoUri]);

  return (
    <ThemedView style={styles.container}>
      {!photoUri ? (
        <View style={styles.messageContainer}>
          <ThemedText type="title">Flower Identification</ThemedText>
          <Text style={styles.text}>
            Take a photo of the flower first to see indetification results!
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.messageContainer}>
          <ThemedText type="title">Please wait...</ThemedText>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
          <Text style={styles.text}>Identification in progress...</Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ThemedView>
  );
};

export default Result;

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    messageContainer: { 
      alignItems: 'center',
      paddingHorizontal: 20,
    },
  
    text: { 
      fontSize: 16,
      textAlign: 'center',
      marginTop: 10, 
      color: Colors.dark.text,
    },
  
    resultContainer: { 
      alignItems: 'center',
    },
  
    image: { 
      width: 250, 
      height: 250, 
      borderRadius: 10, 
      marginBottom: 15,
    },
  
    resultText: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: Colors.dark.tint, 
      textAlign: 'center',
    },
  });
  
