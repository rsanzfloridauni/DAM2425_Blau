import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View } from 'react-native';

export default function LoadingScreen({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 3) {
          return prevProgress + 0.1;
        } else {
          clearInterval(interval);
          navigation.replace('Login'); 
          return 3;
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../imgs/logo.jpg')} />
      <View style={styles.sliderContainer}>
        <View style={styles.triangleTrack}>
          <View style={[styles.triangleBar, { width: `${(progress / 3) * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.progressText}>{Math.round(progress * 33.3)}%</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    padding: 8,
  },
  sliderContainer: {
    width: '70%',
    height: 15,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  triangleTrack: {
    height: '100%',
    backgroundColor: '#FAF8F6',
    position: 'relative',
  },
  triangleBar: {
    height: '100%',
    backgroundColor: '#0B0804',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  progressText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
