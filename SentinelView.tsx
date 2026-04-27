import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { processSentinelVision } from '../functions/sentinel';
import { useCrisisStore } from '../store/useCrisisStore';

/**
 * MISSION: SentinelView Real-time Vision Interface
 * GOAL: UN SDG 11.5 - Autonomous hazard triage via Computer Vision.
 */

export const SentinelView = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const setScanning = useCrisisStore((state) => state.setScanning);
  
  let camera: any;

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera access is required for Sentinel AI</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (camera) {
      setIsAnalyzing(true);
      setScanning(true);
      
      try {
        // 1. Capture the image
        const photo = await camera.takePictureAsync({ base64: true, quality: 0.5 });
        
        // 2. Mock Location (Replace with actual GPS coordinate logic for production)
        const location = { latitude: 22.5726, longitude: 88.3639 };

        // 3. Trigger the Sentinel AI Brain
        await processSentinelVision(photo.base64, location);
        
        alert("Hazard Synced Successfully via SentinelMesh");
      } catch (error) {
        console.error("Vision Capture Error:", error);
      } finally {
        setIsAnalyzing(false);
        setScanning(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={(ref) => { camera = ref; }}
      >
        <View style={styles.overlay}>
          {isAnalyzing ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#00ff00" />
              <Text style={styles.loadingText}>SENTINEL TRIAGE IN PROGRESS...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  message: { color: '#fff', textAlign: 'center', marginBottom: 20 },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff0000',
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: { color: '#00ff00', marginTop: 10, fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});