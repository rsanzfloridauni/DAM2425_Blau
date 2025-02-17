import { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View } from 'react-native';


export default function LoadingScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.1;
        if (newProgress >= 5) {
          clearInterval(interval);
          navigation.replace('MainTabs');
          return 5;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../imgs/logo.jpg')} />
      <View style={styles.sliderContainer}>
        <View style={styles.triangleTrack}>
          <View style={[styles.triangleBar, { width: `${(progress / 5) * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.progressText}>{Math.min(Math.round(progress * 20), 100)}%</Text>
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