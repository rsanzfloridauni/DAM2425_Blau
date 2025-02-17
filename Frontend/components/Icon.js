import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Icon = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.container}>
      <Image source={require('../imgs/logo.jpg')} style={styles.logo} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default Icon;
