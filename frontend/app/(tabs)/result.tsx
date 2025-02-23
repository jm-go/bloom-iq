import React, { FC, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';

const Result: FC = () => {
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (photoUri) {
      setIsLoading(true);
      setTimeout(() => {
        setResult("It looks like it's a Dandelion."); // FAKE identification result for now
        setIsLoading(false);
      }, 2000); // Simulate a delay of 2 seconds for now, to be improved
    }
  }, [photoUri]);

  // TODO:
  // button to come back to HOME and reset the screen
  // change the messages
  // flower name should be capitalized and in colour

  return (
    <ThemedView style={styles.container}>
      {!photoUri ? (
        <View style={styles.messageContainer}>
          <ThemedText style={styles.text}>
            No image detected. Upload a flower photo to continue.
          </ThemedText>
            <View style={styles.buttonContainer}>
              <CustomButton text="Go Back" onPress={() => router.replace('/camera')} />
            </View>
        </View>
      ) : isLoading ? (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
          <ThemedText style={styles.text}>Identification in progress...</ThemedText>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <ThemedText style={styles.resultText}>{result}</ThemedText>
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
      marginBottom: 10,
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

    buttonContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
  });
  
