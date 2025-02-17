import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 
import Context from '../services/Context';
import Icon from 'react-native-vector-icons/Ionicons';

const TeacherList = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { isSpanish } = useLanguage(); 
  const { token, user } = useContext(Context); 
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasAccess = user.teacher || user.premium;

  useEffect(() => {
    if (hasAccess && token) {
      fetchTeachers();
    }
  }, [token, hasAccess]);

   const createChat = async (teacherId) => {
    try {

      const url = new URL('http://34.232.87.107:8080/API/chat/create');
      url.searchParams.append('user1Id', user.id); 
      url.searchParams.append('user2Id', teacherId); 

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text(); 
        if (response.status === 409) {
           Alert.alert(
            isSpanish ? 'Chat existente' : 'Existing Chat',
            isSpanish ? 'Ya tienes un chat con este profesor.' : 'You already have a chat with this teacher.'
          );
        } else {
          throw new Error(errorData.message || (isSpanish ? 'Error al crear el chat' : 'Error creating chat'));
        }
      } else {
        const successData = await response.text(); 
        Alert.alert(
          isSpanish ? 'Éxito' : 'Success',
          successData.message || (isSpanish ? 'Chat creado exitosamente.' : 'Chat created successfully.')
        );
      }
    } catch (error) {
      console.error('Error creating chat:', error);
        error.message || (isSpanish ? 'No se pudo crear el chat. Inténtalo de nuevo.' : 'Could not create chat. Please try again.')
    }
  };

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://34.232.87.107:8080/API/users/teachers', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(isSpanish ? 'Error al obtener profesores' : 'Error fetching teachers');
      }

      const data = await response.json();

      const filteredTeachers = data.filter((teacher) => teacher.id !== user.id);

      setTeachers(filteredTeachers); 
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTeacherItem = ({ item }) => {
    const imageSource = item.image
      ? { uri: item.image }
      : require('../imgs/imgb64.jpg');

    return (
      <TouchableOpacity
        style={[
          styles.teacherItem,
          { backgroundColor: isDarkMode ? '#333' : '#FFF' },
        ]}
        onPress={() => createChat(item.id)}
        disabled={!hasAccess} 
      >
        <Image source={imageSource} style={styles.profileImage} />
        <View style={styles.chatContent}>
          <Text style={[styles.name, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.lastMessage,
              { color: isDarkMode ? '#C7C7C7' : '#666' },
            ]}
          >
            {item.programming_languages}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}
    >
      {/* Header con el título dinámico */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDarkMode ? '#FFFF00' : '#FFFF00' },
        ]}
      >
        <Text style={[styles.appName, { color: isDarkMode ? '#FFF' : '#000' }]}>
          👑 {isSpanish ? 'Profesores' : 'Teachers'}
        </Text>
        <TouchableOpacity
          onPress={() => console.log('Botón de búsqueda presionado')}
        >
          <Icon name="search" size={24} color={isDarkMode ? '#FFF' : '#000'} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} />
        </View>
      ) : teachers.length === 0 ? (
        <View style={styles.noTeachersContainer}>
            <Text style={[styles.noTeachersText, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish
              ? `No hay ${user.teacher ? 'estudiantes' : 'profesores'} disponibles en este momento.`
              : `No ${user.teacher ? 'students' : 'teachers'} available at the moment.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacherItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Superposición semitransparente con mensaje si user.teacher y user.premium son false */}
      {!user.teacher && !user.premium && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayText}>
              {isSpanish
                ? 'Debes ser profesor o tener una suscripción premium para acceder a esta función.'
                : 'You must be a teacher or have a premium subscription to access this feature.'}
            </Text>
          </View>
        </View>
      )}
    </View>
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
  teacherItem: {
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
  noTeachersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTeachersText: {
    fontSize: 18,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
});

export default TeacherList;