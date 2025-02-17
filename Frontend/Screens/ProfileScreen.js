import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 
import Context from '../services/Context';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isSpanish } = useLanguage(); 
  const defaultImage = require('../imgs/imgb64.jpg');
  const { token, setToken, user, setUser } = useContext(Context);
  console.log('Valor de user en Context:', user);

  const [profile, setProfile] = useState({
    name: user.name,
    image: user.image,
    age: user.age,
    email: user.email,
    gender: user.gender,
    programming_languages: user.programming_languages,
  });

  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (user && typeof user === 'object') {
      setProfile({
        name: user.name || (isSpanish ? 'Sin nombre' : 'No name'),
        image: user.image || '',
        age: user.age || (isSpanish ? 'Desconocido' : 'Unknown'),
        email: user.email || (isSpanish ? 'Sin correo' : 'No email'),
        gender: user.gender || (isSpanish ? 'No especificado' : 'Not specified'),
        programming_languages: user.programming_languages || (isSpanish ? 'Ninguno' : 'None'),
      });
    }
  }, [user, isSpanish]);

  const toggleProfileCard = () => {
    setIsProfileCardVisible(!isProfileCardVisible);
  };

  const handleLogout = async () => {
    try {
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://34.232.87.107:8080/API/logout', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log('Logout successful');
        setToken(null);
        navigation.replace('Login');
      } else {
        const errorText = await response.text();
        console.error('Logout failed:', errorText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}>
      <View style={styles.toggleContainer}>
        <Ionicons
          name={isDarkMode ? 'moon' : 'sunny'}
          size={24}
          color={isDarkMode ? '#FFF' : '#000'}
        />
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
        />
      </View>

      {/* Language Toggle */}


      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: profile.image }} style={styles.profilePicture} />
      </View>

      <View style={styles.profileInfo}>
        <Text
          style={[styles.userName, { color: isDarkMode ? '#FFF' : '#333' }]}>
          {profile.name}
        </Text>
        <Text
          style={[
            styles.userDescription,
            { color: isDarkMode ? '#AAA' : '#777' },
          ]}>
          {isSpanish ? 'Edad' : 'Age'}: {profile.age}
        </Text>
        <Text
          style={[
            styles.userDescription,
            { color: isDarkMode ? '#AAA' : '#777' },
          ]}>
          {isSpanish ? 'Correo' : 'Email'}: {profile.email}
        </Text>
        <Text
          style={[
            styles.userDescription,
            { color: isDarkMode ? '#AAA' : '#777' },
          ]}>
          {isSpanish ? 'Género' : 'Gender'}: {profile.gender}
        </Text>
        <Text
          style={[
            styles.userDescription,
            { color: isDarkMode ? '#AAA' : '#777' },
          ]}>
          {isSpanish ? 'Lenguajes' : 'Languages'}: {profile.programming_languages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.showProfileButton, { backgroundColor: '#f2738c' }]}
        onPress={toggleProfileCard}>
        <Text style={styles.buttonText}>
          {isSpanish ? 'Mostrar Perfil' : 'Show Profile'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: '#ee4466' }]}
        onPress={() =>
          navigation.navigate('EditProfile', {
            name: profile.name,
            image: profile.image,
            age: profile.age,
            email: profile.email,
            gender: profile.gender,
            programming_languages: profile.programming_languages,
          })
        }>
        <Text style={styles.buttonText}>
          {isSpanish ? 'Editar Perfil' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: '#DC143C' }]}
        onPress={() =>
          navigation.navigate('ChangePassword', { email: profile.email })
        }>
        <Text style={styles.buttonText}>
          {isSpanish ? 'Cambiar Contraseña' : 'Change Password'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: '#bb1133' }]}
        onPress={() => navigation.navigate('TermsAndConditions')}>
        <Text style={styles.buttonText}>
          {isSpanish ? 'Términos y Condiciones' : 'Terms and Conditions'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#8c0d26' }]}
        onPress={() => setIsLogoutModalVisible(true)}>
        <Text style={styles.buttonText}>
          {isSpanish ? 'Cerrar Sesión' : 'Close Session'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isProfileCardVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? '#C7C7C7' : '#FAF8F6' },
            ]}>
            <Image
              source={
                profile.image
                  ? typeof profile.image === 'string'
                    ? { uri: profile.image }
                    : profile.image
                  : defaultImage
              }
              style={styles.cardImage}
            />
            <Text style={[styles.cardText, { fontWeight: 'bold' }]}>
              {profile.name}, {profile.age},
            </Text>
            <Text style={styles.cardText}>
              {isSpanish ? 'Lenguajes' : 'Languages'}: {profile.programming_languages}
            </Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: isDarkMode ? '#444' : '#C7C7C7' },
              ]}
              onPress={toggleProfileCard}>
              <Text style={styles.buttonText}>
                {isSpanish ? 'Cerrar' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? 'black' : '#FAF8F6' },
            ]}>
            <Image
              source={require('../imgs/logoCompleto.jpg')}
              style={styles.logo}
            />
            <Text
              style={[
                styles.cardText,
                { color: isDarkMode ? 'white' : '#0B0804' },
              ]}>
              {isSpanish
                ? '¿Estás seguro de que quieres cerrar sesión?'
                : 'Are you sure you want to log out?'}
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: '#DC143C' }]}
                onPress={handleLogout}>
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? 'white' : '#0B0804' },
                  ]}>
                  {isSpanish ? 'Sí' : 'Yes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: '#444' }]}
                onPress={() => setIsLogoutModalVisible(false)}>
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? 'white' : '#0B0804' },
                  ]}>
                  {isSpanish ? 'No' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  showProfileButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F6',
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
    marginTop: 10,
    color: '#0B0804',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  profilePictureContainer: { marginBottom: 20 },
  profilePicture: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  profileInfo: { alignItems: 'center', marginBottom: 30 },
  userName: { fontSize: 24, fontWeight: 'bold', fontFamily: 'tahoma' },
  userDescription: { fontSize: 16, marginTop: 5, fontFamily: 'tahoma' },
  toggleContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleContainer: {
    position: 'absolute',
    top: '12%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleText: {
    fontSize: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '60%',
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default ProfileScreen;