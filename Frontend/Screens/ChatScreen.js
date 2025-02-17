import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Modal,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../services/Context';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';

import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { v4 as uuidv4 } from 'uuid'; 

const ChatScreen = ({ route }) => {
  const { isDarkMode } = useTheme();
    const { isSpanish } = useLanguage(); 

  const { token, setToken } = useContext(Context);
  const { user, setUser } = useContext(Context);
  const { chatId, userTwo } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(null);
  const [tempUri, setTempUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const audioPlayerRef = useRef(null);
  const flatListRef = useRef(null);


  useEffect(() => {
    fetchMessages();


    const intervalId = setInterval(fetchMessages, 500);

    return () => clearInterval(intervalId);
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://34.232.87.107:8080/API/chat/messages?chatId=${chatId}`,{
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Error response no ok:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (inputText.trim()) {
      try {
        const url = new URL('http://34.232.87.107:8080/API/chat/send-message');
        url.searchParams.append('chatId', chatId);
        url.searchParams.append('senderId', user.id); 
        url.searchParams.append('content', inputText);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setInputText('');

          fetchMessages();
        } else {
          const errorData = await response.json();
          console.error('Error sending message:', errorData);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const pickImage = async () => {
    Alert.alert("Future implementation", "This image feature will be implemented in the future.");
  };

  const startRecording = async () => {
    Alert.alert("Future implementation", "This audio feature will be implemented in the future.");
  };

  const stopRecording = async () => {
    Alert.alert("Future implementation", "This feature will be implemented in the future.");
  };

  const sendAudioMessage = () => {
    Alert.alert("Future implementation", "This feature will be implemented in the future.");
  };

  const playAudio = async (audioUri) => {
    if (!audioUri) return;
    const { sound, status } = await Audio.Sound.createAsync({ uri: audioUri });
    audioPlayerRef.current = sound;
    await sound.playAsync();
  };

  const openImage = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

 const renderMessage = ({ item }) => {
  const isCurrentUser = item.senderId === user.id;

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser
          ? styles.userMessage 
          : [
              styles.otherMessage, 
              isDarkMode && styles.darkOtherMessageContainer, 
            ],
        isDarkMode && isCurrentUser && styles.darkMessageContainer, 
      ]}>
      {item.content && (
        <Text
          style={[
            styles.messageText,
            isCurrentUser
              ? styles.userMessageText 
              : styles.otherMessageText,
            isDarkMode && styles.darkMessageText,
          ]}>
          {item.content}
        </Text>
      )}
      {item.media && (
        <TouchableOpacity onPress={() => openImage(item.media)}>
          <Image source={{ uri: item.media }} style={styles.media} />
        </TouchableOpacity>
      )}
      {item.audio && (
        <TouchableOpacity onPress={() => playAudio(item.audio)}>
          <Text
            style={[styles.audioText, isDarkMode && styles.darkAudioText]}>
            🎵 Click to Play Audio
          </Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.timeText, isDarkMode && styles.darkTimeText]}>
        {new Date(
          new Date(item.timestamp).getTime() + 3600000
        ).toLocaleTimeString()}
      </Text>
    </View>
  );
};

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <Image source={userTwo.profileImage} style={styles.userImage} />
          <Text style={[styles.username, isDarkMode && styles.darkUsername]}>
            {userTwo.name}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            isDarkMode && styles.darkInputContainer,
          ]}>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Icon name="image" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isSpanish ? 'Escribe un mensaje' : 'Type a message'}
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            multiline={true}
            scrollEnabled={true}
          />

          {recording ? (
            <TouchableOpacity onPress={stopRecording} style={styles.iconButton}>
              <Icon name="stop" size={24} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={startRecording}
              style={styles.iconButton}>
              <Icon name="mic" size={24} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
            <Icon name="send" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  darkSafeArea: { backgroundColor: '#0B0804' },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  darkHeader: { backgroundColor: '#1c1c1c' },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  username: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  darkUsername: { color: '#fff' },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  darkMessageContainer: { backgroundColor: '#DC143C' },
  darkOtherMessageContainer: { backgroundColor: 'grey' },
  userMessage: {
    alignSelf: 'flex-end', 
    backgroundColor: '#007bff',
    marginLeft: '30%',
  },
  otherMessage: {
    alignSelf: 'flex-start', 
    backgroundColor: '#e1e1e1',
    marginRight: '30%',
  },
  messageText: { color: '#fff' },
  userMessageText: { color: '#fff' }, 
  otherMessageText: { color: '#000' }, 
  darkMessageText: { color: '#fff' },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    top:0,
    paddingBottom: 50,
  },
  darkInputContainer: { backgroundColor: '#1c1c1c', borderTopColor: '#333' },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    maxHeight: 100,
    marginHorizontal: 5,
    color: '#000',
  },
  darkInput: { backgroundColor: '#333', color: '#fff' },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullScreenImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  audioText: { color: '#000' },
  darkAudioText: { color: '#fff' },
  timeText: { color: '#000', fontSize: 12, marginTop: 5 },
  darkTimeText: { color: '#fff' },
});

export default ChatScreen;