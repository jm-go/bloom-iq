import React, { FC, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import * as tf from '@tensorflow/tfjs';
// import * as jpeg from 'jpeg-js';
// import { fetch } from '@tensorflow/tfjs-react-native';
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';
import { useTensorFlow } from '@/hooks/TensorFlowProvider';

// Example flower data (mocked for now)
const mockResults = [
  { id: 1, name: 'Phlox paniculata ‘David’', accuracy: 90, image: require('@/assets/images/flower_a.jpeg') },
  { id: 2, name: 'Cardamine occulta', accuracy: 80, image: require('@/assets/images/flower_b.webp') },
  { id: 3, name: 'Lily Of The Valley', accuracy: 75, image: require('@/assets/images/flower_c.jpeg') },
];

const textLabels = [
  'pink primrose'
 ,'hard-leaved pocket orchid'
 ,'canterbury bells'
 ,'sweet pea'
 ,'english marigold'
 ,'tiger lily'
 ,'moon orchid'
 ,'bird of paradise'
 ,'monkshood'
 ,'globe thistle'
 ,'snapdragon'
 ,"colt's foot"
 ,'king protea'
 ,'spear thistle'
 ,'yellow iris'
 ,'globe-flower'
 ,'purple coneflower'
 ,'peruvian lily'
 ,'balloon flower'
 ,'giant white arum lily'
 ,'fire lily'
 ,'pincushion flower'
 ,'fritillary'
 ,'red ginger'
 ,'grape hyacinth'
 ,'corn poppy'
 ,'prince of wales feathers'
 ,'stemless gentian'
 ,'artichoke'
 ,'sweet william'
 ,'carnation'
 ,'garden phlox'
 ,'love in the mist'
 ,'mexican aster'
 ,'alpine sea holly'
 ,'ruby-lipped cattleya'
 ,'cape flower'
 ,'great masterwort'
 ,'siam tulip'
 ,'lenten rose'
 ,'barbeton daisy'
 ,'daffodil'
 ,'sword lily'
 ,'poinsettia'
 ,'bolero deep blue'
 ,'wallflower'
 ,'marigold'
 ,'buttercup'
 ,'oxeye daisy'
 ,'common dandelion'
 ,'petunia'
 ,'wild pansy'
 ,'primula'
 ,'sunflower'
 ,'pelargonium'
 ,'bishop of llandaff'
 ,'gaura'
 ,'geranium'
 ,'orange dahlia'
 ,'pink-yellow dahlia?'
 ,'cautleya spicata'
 ,'japanese anemone'
 ,'black-eyed susan'
 ,'silverbush'
 ,'californian poppy'
 ,'osteospermum'
 ,'spring crocus'
 ,'bearded iris'
 ,'windflower'
 ,'tree poppy'
 ,'gazania'
 ,'azalea'
 ,'water lily'
 ,'rose'
 ,'thorn apple'
 ,'morning glory'
 ,'passion flower'
 ,'lotus'
 ,'toad lily'
 ,'anthurium'
 ,'frangipani'
 ,'clematis'
 ,'hibiscus'
 ,'columbine'
 ,'desert-rose'
 ,'tree mallow'
 ,'magnolia'
 ,'cyclamen '
 ,'watercress'
 ,'canna lily'
 ,'hippeastrum '
 ,'bee balm'
 ,'ball moss'
 ,'foxglove'
 ,'bougainvillea'
 ,'camellia'
 ,'mallow'
 ,'mexican petunia'
 ,'bromelia'
 ,'blanket flower'
 ,'trumpet creeper'
 ,'blackberry lily'
]

const Result: FC = () => {
  const { isModelReady, model } = useTensorFlow();
  const { photoUri } = useLocalSearchParams<{ photoUri?: string }>();
  const [storedPhotoUri, setStoredPhotoUri] = useState<string | null>(photoUri || null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
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

    try {
      await tf.ready();
      const imageTensor = await transformImageToTensor(storedPhotoUri);

      if (imageTensor) {
        const prediction = model.predict(imageTensor) as tf.Tensor;
        console.log('Raw Prediction:', prediction);

        // Process results
        const predictionArray = await prediction.data();
        const results = Object.fromEntries(textLabels.map((label, i) => [label, predictionArray[i]]));
        const getTop5Predictions = (results: Record<string, number>) => {
          return Object.fromEntries(
            Object.entries(results)
              .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) // Sort descending by confidence
              .slice(0, 5) // Take top 5
          );
        };
        console.log('Processed Prediction:', getTop5Predictions(results));
      }
    } catch (error) {
      console.error('Error during prediction:', error);
    }
    setIsLoading(false);
  };

  // const transformImageToTensor = async (uri: string): Promise<tf.Tensor | null> => {
  //   try {
  //     const response = await fetch(uri, {}, { isBinary: true });
  //     const imageData = await response.arrayBuffer();
  //     const rawImageData = new Uint8Array(imageData);
  //     const { width, height, data } = jpeg.decode(rawImageData, { useTArray: true });

  //     return tf.tensor3d(data, [height, width, 3]).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
  //   } catch (error) {
  //     console.error('Error converting image to tensor:', error);
  //     return null;
  //   }
  // };

  // const transformImageToTensor = async (uri: string)=>{
  //   //.ts: const transformImageToTensor = async (uri:string):Promise<tf.Tensor>=>{
  //   //read the image as base64
  //     const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
  //     const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer
  //     const raw = new Uint8Array(imgBuffer)
  //     let imgTensor = decodeJpeg(raw)
  //     const scalar = tf.scalar(255)
  //   //resize the image
  //     imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224])
  //   //normalize; if a normalization layer is in the model, this step can be skipped
  //     // const tensorScaled = imgTensor.div(scalar)
  //   //final shape of the rensor
  //     const img = tf.reshape(imgTensor, [1,224,224,3])
  //     return img
  // }

  const transformImageToTensor = async (uri: string): Promise<tf.Tensor> => {
    // Read the image as base64
    const img64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const imgBuffer = tf.util.encodeString(img64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
  
    // Decode JPEG into tensor
    let imgTensor = decodeJpeg(raw);
  
    // Convert dtype to float32 (this is the fix for your error)
    imgTensor = imgTensor.toFloat(); 
  
    // Normalize values to [0, 1] range (optional, based on model requirements)
    imgTensor = imgTensor.div(tf.scalar(255));
  
    // Resize image to match model input size (assuming 224x224)
    imgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
  
    // Expand dimensions to add batch size (1, 224, 224, 3)
    const img = imgTensor.expandDims(0);
  
    return img;
  };


  const handleStartOver = () => {
    setStoredPhotoUri(null);
    setResults(null);
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      {!storedPhotoUri ? (
        // No Image Detected
        <View style={styles.messageContainer}>
          <ThemedText style={styles.text}>No image detected. Upload a flower photo to continue.</ThemedText>
          <View style={styles.buttonContainer}>
            <CustomButton text="Go Back" onPress={() => router.replace('/camera')} />
          </View>
        </View>
      ) : isLoading ? (
        // Loading Spinner
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
          <ThemedText style={styles.text}>Identification in progress...</ThemedText>
        </View>
      ) : (
        // Identification Results
        <View style={styles.resultContainer}>
                  <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Image source={item.image} style={styles.resultImage} />
              <View>
                <ThemedText style={styles.resultText}>{item.name}</ThemedText>
                <ThemedText style={styles.accuracyText}>Confidence: {item.accuracy}%</ThemedText>
              </View>
            </View>
          )}
        />
          <View style={styles.buttonContainer}>
            <CustomButton text="Start Over" icon="reload1" onPress={handleStartOver} backgroundColor={Colors.dark.primaryButton} />
          </View>
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
      width: '100%',
    },
  
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.dark.background,
      padding: 10,
      marginVertical: 5,
      borderRadius: 8,
      width: '100%',
    },
  
    resultImage: { 
      width: 150, 
      height: 150, 
      marginRight: 10,
      borderRadius: 5,
    },
  
    resultText: { 
      fontSize: 17, 
      color: Colors.dark.tint,
    },
  
    accuracyText: {
      fontSize: 14,
      color: Colors.dark.text,
    },

    buttonContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
  });
  
