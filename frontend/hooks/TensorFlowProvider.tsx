import React, { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

const TensorFlowContext = createContext<{ isModelReady: boolean; model: tf.GraphModel | null }>({
  isModelReady: false,
  model: null,
});

export const useTensorFlow = () => useContext(TensorFlowContext);

export const TensorFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const modelJson = require('../assets/model/model.json');
        const modelWeights = require('../assets/model/group1-shard1of1.bin');


        // const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
        setModel(loadedModel);
        setIsModelReady(true);
      } catch (error) {
        console.error('Error loading TensorFlow model:', error);
      }
    };

    loadModel();
  }, []);

  if (!isModelReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.dark.darkPurple} />
      </View>
    );
  }

  return (
    <TensorFlowContext.Provider value={{ isModelReady, model }}>
      {children}
    </TensorFlowContext.Provider>
  );
};
