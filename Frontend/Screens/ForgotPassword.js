import { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from '../components/Icon';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext'; 
import Context from '../services/Context';

export default function ForgotPasswordPage({ navigation }) {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({});
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isSpanish } = useLanguage(); 
  const { gmailResetContrasena, setGmailResetContrasena } = useContext(Context);

  useEffect(() => {
    return () => {
      setInput('');
      setErrors({});
    };
  }, []);

  const validateInput = (text) => {
    setInput(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(text) || text.length >= 1);
  };

  const handleSendLink = async () => {
    const navigateWithKeyboardDismiss = (screenName) => {
      Keyboard.dismiss();
      navigation.navigate(screenName);
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isInputValid = emailRegex.test(input) || input.length >= 1;

    let newErrors = {};
    if (!input) {
      newErrors.input = isSpanish ? 'El correo electrónico es obligatorio' : 'Email is required';
    } else if (!isInputValid) {
      newErrors.input = isSpanish ? 'Formato de correo inválido' : 'Invalid email format';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://34.232.87.107:8080/API/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: input }),
        });
        if (response.ok) {
          setGmailResetContrasena(input);
          navigateWithKeyboardDismiss('ResetPasswordPage');
        } else {
          Alert.alert(isSpanish ? 'Error' : 'Error', isSpanish ? 'El correo electrónico no existe' : 'Email does not exist', [
            { text: 'OK', onPress: () => {} },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          isSpanish ? 'Error' : 'Error',
          isSpanish ? 'Ocurrió un error al verificar el correo electrónico' : 'An error occurred while verifying the email',
          [{ text: 'OK', onPress: () => {} }]
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' }]}>
        <Icon />

        <View style={styles.toggleContainer}>
          <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={isDarkMode ? '#FFF' : '#000'} />
          <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
        </View>

        <TextInput
          style={[styles.input, !isValid && styles.inputError]}
          placeholder={isSpanish ? 'Correo electrónico' : 'Email'}
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={input}
          onChangeText={validateInput}
        />
        {!isValid && <Text style={styles.errorText}>{isSpanish ? 'Correo inválido o nombre de usuario demasiado corto' : 'Invalid email or too short username'}</Text>}
        {errors.input && <Text style={styles.errorText}>{errors.input}</Text>}

        <TouchableOpacity style={styles.sendLinkButton} onPress={handleSendLink}>
          <Text style={styles.sendLinkButtonText}>{isSpanish ? 'Indica Tu correo' : 'Enter your Email'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%',
  },
  toggleContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  sendLinkButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  sendLinkButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});