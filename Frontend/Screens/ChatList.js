import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Context from '../services/Context';

const ChatList = () => {
  const { isDarkMode } = useTheme();
    const { isSpanish } = useLanguage();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { token, setToken } = useContext(Context);
  const { user, setUser } = useContext(Context);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://34.232.87.107:8080/API/user/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };


  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    date.setHours(date.getHours() + 1); 

    return date.toLocaleString(isSpanish ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(
        `http://34.232.87.107:8080/API/chat/user-chats?userId=${user.id}`,{
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      console.log('API Response:', data);


      const transformedChats = await Promise.all(
        data.map(async (chat) => {
          const otherUserId =
            chat.user1Id === user.id ? chat.user2Id : chat.user1Id;

          const otherUser = await fetchUserDetails(otherUserId);

          if (!otherUser) {
            console.warn('No se pudo obtener la información del otro usuario');
            return null;
          }

          const lastMessage =
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].content
               : isSpanish ? 'Aún no hay mensajes' : 'No messages yet';

          const lastMessageTimestamp =
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].timestamp
              : null;

          const lastMessageTime = lastMessageTimestamp
            ? formatDateTime(lastMessageTimestamp)
            : '';

          return {
            id: chat.id,
            name: otherUser.name,
            lastMessage: lastMessage,
            time: lastMessageTime,
            lastMessageTimestamp: lastMessageTimestamp,
            profileImage: otherUser.image
              ? { uri: otherUser.image }
              : require('../imgs/imgb64.jpg'),
          };
        })
      );

      const filteredChats = transformedChats.filter((chat) => chat !== null);

      const sortedChats = filteredChats.sort((a, b) => {
        if (!a.lastMessageTimestamp && !b.lastMessageTimestamp) return 0;
        if (!a.lastMessageTimestamp) return 1;
        if (!b.lastMessageTimestamp) return -1;
        return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
      });

      setChats(sortedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats])
  );

  const renderChatItem = ({ item }) => (
    <ChatItem
      name={item.name}
      lastMessage={item.lastMessage}
      time={item.time}
      profileImage={item.profileImage}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          chatId: item.id,
          userTwo: {
            name: item.name,
            profileImage: item.profileImage,
          },
        })
      }
    />
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}>
      <Header />
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const Header = () => {
  const { isDarkMode } = useTheme();
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#DC143C' : '#DC143C' },
      ]}>
      <Text style={[styles.appName, { color: isDarkMode ? '#FFF' : '#000' }]}>
        Love4Code
      </Text>
      <TouchableOpacity
        onPress={() => console.log('Botón de búsqueda presionado')}>
        <Icon name="search" size={24} color={isDarkMode ? '#FFF' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

const ChatItem = ({ name, lastMessage, time, profileImage, onPress }) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.chatItem,
        { backgroundColor: isDarkMode ? '#333' : '#FFF' },
      ]}
      onPress={onPress}>
      <Image source={profileImage} style={styles.profileImage} />
      <View style={styles.chatContent}>
        <Text style={[styles.name, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {name}
        </Text>
        <Text
          style={[
            styles.lastMessage,
            { color: isDarkMode ? '#C7C7C7' : '#666' },
          ]}>
          {lastMessage}
        </Text>
      </View>
      <Text style={[styles.time, { color: isDarkMode ? '#AAA' : '#999' }]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 30,
  },
  appName: { fontSize: 20, fontWeight: 'bold' },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  chatContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  lastMessage: { fontSize: 14 },
  time: { fontSize: 12 },
});

export default ChatList;