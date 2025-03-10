import React, { FC, useState, useEffect } from 'react';
import { Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import * as tf from '@tensorflow/tfjs';
import {decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';
import { useTensorFlow } from '@/hooks/TensorFlowProvider';
import { FlowerMap } from '@/constants/FlowerMap';

const Result: FC = () => {
  const { isModelReady, model } = useTensorFlow();
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const [storedPhotoUri, setStoredPhotoUri] = useState<string | null>(photoUri || null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (photoUri) {
      setStoredPhotoUri(photoUri);
    }
  }, [photoUri]);

  useEffect(() => {
    predictFlower();
  }, [storedPhotoUri, isModelReady, model]);

  const predictFlower = async () => {
    if (!storedPhotoUri || !isModelReady || !model) return;
    setIsLoading(true);
    setError(null);

    try {
      await tf.ready();
      const imageTensor = await transformImageToTensor(storedPhotoUri);

      if (imageTensor) {
        const prediction = model.predict(imageTensor) as tf.Tensor;

         // Process results
         const predictionArray = await prediction.data();
 
         // Get top 3 predictions with their labels
         const topPredictions = Array.from(predictionArray)
           .map((score, index) => ({ index, score })) // Map index with score
           .sort((a, b) => b.score - a.score) // Sort by confidence score
           .slice(0, 3)
           .map(({ index, score }) => ({
             id: index,
             name: FlowerMap[index]?.name || 'Unknown',
             image: FlowerMap[index]?.image || require('@/assets/images/flower-placeholder.png'),
             confidence: (score * 100).toFixed(2) + '%',
           }));
 
         setResults(topPredictions);
       }
     } catch (error) {
       console.error('Error during prediction:', error);
       setError(`Oops! It looks like we couldn't process the image. Please ensure it's a valid JPEG image and retry.`);
     }
     setIsLoading(false);
   };

  const transformImageToTensor = async (uri: string): Promise<tf.Tensor> => {
    
    try {
      // Read the image as base64
      const img64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const imgBuffer = tf.util.encodeString(img64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
  
      // Decode JPEG into tensor
      let imgTensor = decodeJpeg(raw);
  
      // Convert dtype to float32
      imgTensor = imgTensor.toFloat(); 
  
      // Normalize values to [0, 1] range
      imgTensor = imgTensor.div(tf.scalar(255));
  
      // Resize image to match model input size (224x224)
      imgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
  
      // Expand dimensions to add batch size (1, 224, 224, 3)
      return imgTensor.expandDims(0);
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image.');
    }
  };


  const handleStartOver = () => {
    setStoredPhotoUri(null);
    setResults([]);
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      {!storedPhotoUri ? (
        <ThemedView style={styles.messageContainer}>
          <ThemedText style={styles.text}>No image detected. Upload a flower photo to continue.</ThemedText>
          <ThemedView style={styles.buttonContainer}>
            <CustomButton icon='arrowleft' text="Go Back" onPress={() => router.replace('/camera')} />
          </ThemedView>
        </ThemedView>
      ) : isLoading ? (
        <ThemedView style={styles.messageContainer}>
          <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
          <ThemedText style={styles.text}>Identification in progress...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.messageContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedView style={styles.buttonContainer}>
            <CustomButton text="Try Again" icon="reload1" onPress={handleStartOver} backgroundColor={Colors.dark.primaryButton} width={160} />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.resultContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ThemedView style={styles.resultItem}>
                <Image source={item.image} style={styles.resultImage} />
                <ThemedView>
                  <ThemedText style={styles.resultText}>{item.name}</ThemedText>
                  <ThemedText style={styles.accuracyText}>Confidence: {item.confidence}</ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          />
          <ThemedView style={styles.buttonContainer}>
            <CustomButton text="Start Over" icon="reload1" onPress={handleStartOver} backgroundColor={Colors.dark.primaryButton} width={160} />
          </ThemedView>
        </ThemedView>
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

    errorText: { 
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
    },
  
    resultContainer: { 
      alignItems: 'center',
      width: '100%',
    },
  
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.dark.background,
      padding: 5,
      marginVertical: 3,
      borderRadius: 8,
      width: '100%',
    },
  
    resultImage: { 
      width: 160, 
      height: 160, 
      marginRight: 10,
      borderRadius: 5,
    },
  
    resultText: { 
      fontSize: 16, 
      color: Colors.dark.tint,
    },
  
    accuracyText: {
      fontSize: 13,
      color: Colors.dark.text,
      fontStyle: 'italic',
    },

    buttonContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
  });
  
