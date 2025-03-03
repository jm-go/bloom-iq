# Welcome to BloomIQ 🌼

BloomIQ is a mobile app designed to help users identify common UK flowers by simply taking a photo. This project is built using **React Native** and **Expo**, ensuring a smooth and efficient user experience.

---

## **Get Started**

### 1. Install dependencies
```bash
npm install
```

### 2. Start the app
```bash
npx expo start
npx expo start --dev-client
```

You'll be able to run the app on:
- **Development build** ([Docs](https://docs.expo.dev/develop/development-builds/introduction/))
- **Android Emulator** ([Docs](https://docs.expo.dev/workflow/android-studio-emulator/))
- **iOS Simulator** ([Docs](https://docs.expo.dev/workflow/ios-simulator/))
- **Expo Go** ([Docs](https://expo.dev/go))

This project follows **file-based routing** ([Docs](https://docs.expo.dev/router/introduction/)), making navigation easier.

---

## **Project Overview**
### **Goal of the App**
BloomIQ helps users identify flowers by analysing photos. The app is powered by a fine-tuned MobileNet CNN model, which processes the image and provides a list of possible matches with accuracy percentages. The model has been optimized for real-time flower classification, ensuring accurate results while keeping inference fast and efficient.

## **App Structure & Screens**

### **1. Home Screen (`index.tsx`)**
- Displays a **welcome message**.
- Encourages users to **take a flower photo**.
- Includes a **"Take a Photo" button**, navigating to the Camera screen.

### **2. Camera Screen (`camera.tsx`)**
- Uses **Expo Camera** to capture an image.
- Once a photo is taken, it shows a **preview**.
- Users can **Retake** or **Upload** the image for identification.

### **3. Result Screen (`result.tsx`)**
- Displays **identification results**.
- Shows the **top 3 best matches** with:
  - **Flower name**
  - **Accuracy percentage**
  - **A small image preview**
- Allows users to **start over** and take another photo.

---

## **Development Context**
This prototype has been developed as part of my **MSc thesis** at the **University of Bath**. The goal is to explore real-time **flower identification using deep learning models** and build a functional user interface for non-technical users.

---

## **Future Improvements**
- ✅ **Enhance the AI model with additional flower species**.
- ✅ **Improve UI/UX with animations and better styling**.
- ✅ **Store user history for past identifications**.

---
