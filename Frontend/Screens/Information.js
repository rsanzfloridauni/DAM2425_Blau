import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
const { width, height } = Dimensions.get('window'); 

const Information = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { isSpanish } = useLanguage();
  const videoRef = React.useRef(null);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish
            ? 'Tutorial: Cómo Usar la Aplicación'
            : 'Tutorial: How to Use the App'}
        </Text>

        {/* Swipe Functionality Explanation */}
        <Text
          style={[styles.subtitle, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish ? 'Funcionalidad de Deslizar' : 'Swipe Functionality'}
        </Text>

        <Video
          ref={videoRef}
          source={require('../imgs/TutorialSwipe.mp4')}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false} 
        />

        <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish
            ? 'Desliza hacia la izquierda para pasar o hacia la derecha para dar me gusta a un perfil. También puedes tocar los botones debajo de la tarjeta.'
            : 'Swipe left to pass or right to like a profile. You can also tap the buttons below the card.'}
        </Text>

        {/* Chat Functionality Explanation */}
        <Text
          style={[styles.subtitle, { color: isDarkMode ? '#FFF' : '#000' }]}>
          Chat Functionality
        </Text>

        <Video
          ref={videoRef}
          source={require('../imgs/TutorialChat.mp4')}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false} 
        />

        <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish
            ? 'Una vez que hagas match con alguien, podrás iniciar una conversación en la sección de chat.'
            : 'Once you match with someone, you can start chatting with them in the chat section.'}
        </Text>

        {/* Understood Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText]}>
            {isSpanish ? 'Entendido' : 'Understood'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingBottom: 20, 
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  video: {
    width: '100%', 
    height: height * 0.8, 
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DC143C',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Information;
