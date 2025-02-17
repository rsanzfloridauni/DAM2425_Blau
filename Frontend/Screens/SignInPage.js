import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import SHA256 from 'crypto-js/sha256';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TermsAndConditionsScreen from './TermsAndConditionsScreen';
const placeholderImage = require('../imgs/logo.jpg');
const defaultImage = require('../imgs/imgb64.jpg');

const programmingLanguages = [
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'PHP',
  'TypeScript',
  'Ruby',
  'Swift',
  'Go',
  'Kotlin',
  'Rust',
  'Dart',
  'R',
  'Scala',
];

export default function SignInPage({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redoPassword, setRedoPassword] = useState('');
  const [image, setImage] = useState(null);
  const [programming_languages, setProgramming_languages] = useState([]);
  const [gender, setGender] = useState(null);
  const [errors, setErrors] = useState({});
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isSpanish, setIsSpanish } = useLanguage();
  const [premium, setPremium] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [premiumExpirationDate, setPremiumExpirationDate] = useState('');
  const [matched, setMatched] = useState([]);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [database_name, setDatabase_name] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const handleInputChange = (setter, field) => (value) => {
    setter(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSignIn = async () => {
    setIsLoading(true);

    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!database_name)
      newErrors.database_name = isSpanish
        ? 'El nombre de usuario es obligatorio'
        : 'Username is required';
    if (!name)
      newErrors.name = isSpanish
        ? 'El nombre es obligatorio'
        : 'Name is required';
    if (!age || isNaN(age) || age <= 0)
      newErrors.age = isSpanish
        ? 'Se requiere una edad válida'
        : 'Valid age is required';
    if (age < 18)
      newErrors.age = isSpanish
        ? 'La edad mínima es 18'
        : 'The minimum age is 18';
    if (!email)
      newErrors.email = isSpanish
        ? 'El correo electrónico es obligatorio'
        : 'Email is required';
    if (!emailRegex.test(email))
      newErrors.email = isSpanish
        ? 'Formato de correo electrónico inválido'
        : 'Invalid email format';
    if (!password)
      newErrors.password = isSpanish
        ? 'La contraseña es obligatoria'
        : 'Password is required';
    if (!redoPassword)
      newErrors.redoPassword = isSpanish
        ? 'Debe repetir la contraseña'
        : 'Redo password is required';
    if (password !== redoPassword)
      newErrors.redoPassword = isSpanish
        ? 'Las contraseñas no coinciden'
        : 'Passwords do not match';
    if (programming_languages.length === 0)
      newErrors.languages = isSpanish
        ? 'Seleccione al menos un lenguaje de programación'
        : 'Please select at least one language';
    if (!gender)
      newErrors.gender = isSpanish
        ? 'Seleccione un género'
        : 'Please select a gender';
    if (!isTermsAccepted)
      newErrors.terms = isSpanish
        ? 'Debe aceptar los términos y condiciones'
        : 'You must accept the terms and conditions';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(
        isSpanish
          ? `Ocurrieron errores:\n${Object.values(newErrors).join('\n')}`
          : `Errors Occurred:\n${Object.values(newErrors).join('\n')}`
      );
      setIsLoading(false);
      return;
    }
    try {
      let imageBase64 = null;
      if (image) {
        imageBase64 = await convertImageToBase64(image);
      } else {
        imageBase64 = await convertImageToBase64(
          Image.resolveAssetSource(defaultImage).uri
        );
      }

      const programmingLanguagesString = programming_languages.join(',');
      const hashedPassword = SHA256(password).toString();

      const userData = {
        name,
        age,
        email,
        password: hashedPassword,
        programming_languages: programmingLanguagesString,
        gender,
        image: imageBase64,
        database_name,
        premium,
        teacher,
        premiumExpirationDate,
        matched,
        liked,
        disliked,
      };

      console.log(JSON.stringify(userData));

      const response = await fetch('http://34.232.87.107:8080/API/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsLoading(false);
        alert(isSpanish ? 'Registro exitoso' : 'Sign In Successful');
        navigation.navigate('Login');
      } else {
        const result = await response.json();
        alert(`Error: ${result.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing in');
    } finally {
      setIsLoading(false);
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleLanguage = (language) => {
    if (programming_languages.includes(language)) {
      setProgramming_languages(
        programming_languages.filter((lang) => lang !== language)
      );
    } else {
      if (programming_languages.length < 5) {
        setProgramming_languages([...programming_languages, language]);
      } else {
        alert(
          isSpanish
            ? 'Puedes seleccionar hasta 5 lenguajes.'
            : 'You can select up to 5 languages.'
        );
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      keyboardShouldPersistTaps="handled">
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
        ]}>
        <Icon />

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

        <Image
          source={image ? { uri: image } : placeholderImage}
          style={styles.image}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {isSpanish ? 'Subir Imagen' : 'Upload Image'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Nombre de usuario' : 'Username'}
          value={database_name}
          onChangeText={handleInputChange(setDatabase_name, 'database_name')}
          autoCapitalize="none"
        />
        {errors.database_name && (
          <Text style={styles.errorText}>{errors.database_name}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Nombre de perfil' : 'Profile Name'}
          value={name}
          onChangeText={handleInputChange(setName, 'name')}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Edad' : 'Age'}
          keyboardType="phone-pad"
          value={age}
          onChangeText={handleInputChange(setAge, 'age')}
        />
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Correo electrónico' : 'Email'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={handleInputChange(setEmail, 'email')}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Contraseña' : 'Password'}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={handleInputChange(setPassword, 'password')}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder={isSpanish ? 'Repetir Contraseña' : 'Redo Password'}
          secureTextEntry
          value={redoPassword}
          autoCapitalize="none"
          onChangeText={handleInputChange(setRedoPassword, 'redoPassword')}
        />
        {errors.redoPassword && (
          <Text style={styles.errorText}>{errors.redoPassword}</Text>
        )}

        <Text
          style={[styles.genderText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish ? 'Seleccionar Género:' : 'Select Gender:'}
        </Text>
        <View style={styles.radioContainer}>
          {[
            { en: 'Male', es: 'Masculino' },
            { en: 'Female', es: 'Femenino' },
            { en: 'Prefer Not to Say', es: 'Prefiero no decirlo' },
          ].map((gender1) => (
            <TouchableOpacity
              key={gender1.en}
              style={styles.radioButton}
              onPress={() => setGender(gender1.en)}>
              <View style={styles.radioOuter}>
                {gender === gender1.en && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.radioLabel,
                  { color: isDarkMode ? '#FFF' : '#000' },
                ]}>
                {isSpanish ? gender1.es : gender1.en}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        <Text
          style={[styles.genderText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {isSpanish
            ? 'Seleccionar Lenguajes de Programación (hasta 5):'
            : 'Select Programming Languages (up to 5):'}
        </Text>
        <ScrollView
          style={styles.languagesContainer}
          nestedScrollEnabled={true}>
          {programmingLanguages.map((language) => (
            <TouchableOpacity
              key={language}
              style={[
                styles.languageButton,
                programming_languages.includes(language) &&
                  styles.selectedLanguageButton,
              ]}
              onPress={() => toggleLanguage(language)}>
              <Text
                style={[
                  styles.languageText,
                  { color: isDarkMode ? '#FFF' : '#000' },
                ]}>
                {language}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {errors.languages && (
          <Text style={styles.errorText}>{errors.languages}</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text
            style={[styles.termsText, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish
              ? 'Ver Términos y Condiciones'
              : 'View Terms and Conditions'}
          </Text>
        </TouchableOpacity>
        </View>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.loadingText}>
                {isSpanish ? 'Cargando...' : 'Loading...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.signInButtonText}>
              {isSpanish ? 'Registrarse' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>
     <Modal
  animationType="slide"
  transparent={false}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View
    style={[
      styles.modalContainer,
      { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' }, // Dark mode background
    ]}
  >
    <ScrollView style={styles.termsContainer}>
      <TermsAndConditionsScreen />
    </ScrollView>

    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[
          styles.customCheckbox,
          isTermsAccepted && styles.customCheckboxChecked,
        ]}
        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
      >
        {isTermsAccepted && <Ionicons name="checkmark" size={16} color="#FFF" />}
      </TouchableOpacity>
      <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#FFF' : '#000' }]}>
        {isSpanish ? 'Acepto los términos y condiciones' : 'I accept the terms and conditions'}
      </Text>
    </View>

    {/* Updated Close Button */}
    <TouchableOpacity style={styles.signInButton} onPress={() => setIsModalVisible(false)}>
      <Text style={styles.signInButtonText}>
        {isSpanish ? 'Cerrar' : 'Close'}
      </Text>
    </TouchableOpacity>
  </View>
</Modal>

      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: '5%',
    paddingTop: '10%',
    width: '100%',
  },
  toggleContainer: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: '5%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#c51d34',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#C7C7C7',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: '2%',
    fontSize: 14,
  },
  imagePicker: {
    backgroundColor: '#DC143C',
    paddingVertical: '2.5%',
    paddingHorizontal: '5%',
    borderRadius: 5,
    marginBottom: '5%',
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#DC143C',
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    borderRadius: 5,
    marginTop: '5%',
    width: '90%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  radioContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '90%',
    marginBottom: '3%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '1.5%',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC143C',
  },
  radioLabel: {
    fontSize: 16,
  },
  genderText: {
    fontSize: 16,
    marginBottom: '3%',
  },
  languagesContainer: {
    width: '90%',
    maxHeight: 160,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DC143C',
    borderRadius: 5,
    paddingVertical: 5,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DC143C',
    alignItems: 'center',
  },
  selectedLanguageButton: {
    backgroundColor: '#DC143C',
  },
  languageText: {
    fontSize: 16,
    color: '#000',
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
  termsText: {
    fontSize: 14,
    marginTop: '3%',
    textDecorationLine: 'underline',
  },
 modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5%',
},


  termsContainer: {
    flex: 1,
    padding: 15,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customCheckboxChecked: {
    backgroundColor: '#DC143C',
  },
  checkboxLabel: {
    fontSize: 14,
  },
});