import { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import Context from '../services/Context';
import CryptoJS from 'crypto-js';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isSpanish, toggleLanguage } = useLanguage();
  const { token, setToken } = useContext(Context);
  const { user, setUser } = useContext(Context);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const hashedPassword = CryptoJS.SHA256(password).toString();
    const body = JSON.stringify({
      database_name: email,
      password: hashedPassword,
    });

    try {
      const response = await fetch('http://34.232.87.107:8080/API/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error('El usuario y la contraseña no son correctos');
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        setToken(token);
        setUser(data);
        navigation.navigate('LoadingScreen');
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (error) {
      Alert.alert('Error', `${error.message}`);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}
    >
      <View style={styles.toggleContainer}>
        <Ionicons
          name={isDarkMode ? 'moon' : 'sunny'}
          size={24}
          color={isDarkMode ? '#FFF' : '#000'}
        />
        <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
      </View>

      <View style={styles.languageToggleContainer}>
        <TouchableOpacity onPress={toggleLanguage}>
          <Text style={styles.languageToggleText}>{isSpanish ? '🇪🇸' : '🇬🇧'}</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('../imgs/logo.jpg')} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={isSpanish ? 'Usuario' : 'Username'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={isSpanish ? 'Contraseña' : 'Password'}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        {isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#FFF" />
      <Text style={styles.loadingText}>
        {isSpanish ? 'Cargando...' : 'Loading...'}
      </Text>
    </View>
  ) : (
    <Text style={styles.loginButtonText}>{isSpanish ? 'Iniciar Sesión' : 'Login'}</Text>
  )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={[styles.link, { color: isDarkMode ? '#DC143C' : '#0B0804' }]}>
          {isSpanish ? 'Registrarse' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={[styles.link, { color: isDarkMode ? '#DC143C' : '#0B0804' }]}>
          {isSpanish ? '¿Olvidaste tu contraseña?' : 'Forgot Password?'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  toggleContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleText: {
    fontSize: 24,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#c51d34',
    borderWidth: 3,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#C7C7C7',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderColor: '#c51d34',
    borderWidth: 3,
    borderRadius: 5,
    backgroundColor: '#C7C7C7',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  loginButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'tahoma',
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'tahoma',
  },
  loadingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
loadingText: {
  color: '#FFF',
  fontSize: 16,
  marginLeft: 8, 
},
});