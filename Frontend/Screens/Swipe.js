import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Switch,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import Context from '../services/Context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MatchPopup = ({ name, onClose }) => {
  const { isDarkMode } = useTheme();
  const { isSpanish } = useLanguage();

  return (
    <View style={styles.matchPopupContainer}>
      <View
        style={[
          styles.heartWrapper,
          {
            backgroundColor: isDarkMode ? '#000' : '#FFF',
            borderWidth: isDarkMode ? 2 : 0,
            borderColor: isDarkMode ? '#DC143C' : 'transparent',
          },
        ]}>
        <View style={styles.heart}>
          <Ionicons
            name="heart"
            size={80}
            color="#FF6B6B"
            style={styles.heartIcon}
          />
          <Text
            style={[styles.matchText, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish ? '¡Es un match!' : 'It\'s a match!'}
          </Text>
          <Text
            style={[styles.matchName, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish ? `Has hecho match con ${name}` : `You matched with ${name}`}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{isSpanish ? 'Cerrar' : 'Close'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PremiumPopup = ({ onClose, onAccept }) => {
  const { isDarkMode } = useTheme();
  const {isSpanish} = useLanguage();
  return (
    <View style={styles.matchPopupContainer}>
      <View
        style={[
          styles.heartWrapper,
          { backgroundColor: isDarkMode ? '#000' : '#FFF' },
        ]}>
        <View style={styles.heart}>
          <Ionicons
            name="logo-euro"
            size={80}
            color="#DC143C"
            style={styles.heartIcon}
          />
          <Text
            style={[styles.matchText, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {isSpanish ? 'Mejora a Premium' : 'Upgrade to Premium'}
          </Text>
          <View style={styles.popupButtons}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.popupButton,
                {
                  backgroundColor: isDarkMode ? '#000' : '#FFF',
                  borderWidth: 2,
                  borderColor: '#DC143C',
                },
              ]}>
              <Text
                style={[
                  styles.popupButtonText,
                  { color: isDarkMode ? '#FFF' : '#DC143C' },
                ]}>
                {isSpanish ? 'No' : 'No'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.popupButton, { backgroundColor: '#DC143C' }]}>
              <Text style={[styles.popupButtonText, { color: '#FFF' }]}>
              <Text style={styles.popupButtonText}>{isSpanish ? 'Sí' : 'Yes'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const Swipe = () => {
  const [decision, setDecision] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notifications, setNotifications] = useState(2);
    const { isSpanish } = useLanguage();

  const { isDarkMode, setIsDarkMode } = useTheme();
  const [cards, setCards] = useState([]);
  const swipeThreshold = 50;
  const { token, setToken, user, setUser } = useContext(Context);
  const swiperRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [matchedUserName, setMatchedUserName] = useState('');
  const navigation = useNavigation();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true); 
      const response = await fetch(
        'http://34.232.87.107:8080/API/users?userId=' + user.id,
        {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error fetching users');
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      const filteredUsers = data.filter(
        (fetchedUser) => fetchedUser.id !== user.id
      );

      const formattedCards = filteredUsers.map((user) => ({
        id: user.id,
        name: user.name,
        age: user.age,
        programming_languages: user.programming_languages,
        image: user.image,
      }));

      const shuffledCards = shuffleArray(formattedCards);
      setCards(shuffledCards); 
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los usuarios. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false); 
    }
  }, [user.id, token]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const renderCard = (card) => {
    if (!card) {
      return (
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? '#333' : '#FAF8F6' },
          ]}></View>
      );
    }
    return <CardComponent card={card} isDarkMode={isDarkMode} />;
  };

  const onSwiping = (x) => {
    if (x > swipeThreshold) {
      setDecision('YES');
    } else if (x < -swipeThreshold) {
      setDecision('NO');
    } else {
      setDecision(null);
    }
  };

  const onSwiped = async (index, direction) => {
    console.log(
      'onSwiped called with index:',
      index,
      'and direction:',
      direction
    );

    const targetUserId = cards[index].id;
    console.log('User ID:', user.id, 'Target User ID:', targetUserId);

    try {
      let endpoint, method;
      if (direction === 'right') {
        endpoint = 'http://34.232.87.107:8080/API/like';
        method = 'PUT';
      } else if (direction === 'left') {
        endpoint = 'http://34.232.87.107:8080/API/dislike';
        method = 'PUT';
      } else {
        return;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          targetUserId: targetUserId,
        }),
      });

      console.log(`${direction === 'right' ? 'Like' : 'Dislike'} enviado`);

      if (!response.ok) {
        const errorResult = await response.text();
        throw new Error(
          errorResult ||
            `Error al enviar el ${direction === 'right' ? 'like' : 'dislike'}`
        );
      }

      const result = await response.text();

      console.log('Result:', result);

      if (direction === 'right' && result === '¡Es un match!') {
        setMatchedUserName(cards[index].name);
        setShowMatchPopup(true);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        `No se pudo enviar el ${
          direction === 'right' ? 'like' : 'dislike'
        }. Inténtalo de nuevo.`
      );
    }

    setCurrentIndex(index + 1);
    setDecision(null);
  };



  const handlePromo = () => {
    const message = isSpanish
      ? 'Conecta con otros programadores. Descarga la app aquí: https://linktr.ee/alsivi01?utm_source=linktree_admin_share'
      : 'Connect with other programmers. Download the app here: https://linktr.ee/alsivi01?utm_source=linktree_admin_share';
    Share.share({
      message: message,
    });
  };

  const handleInformationPage = () => {
  navigation.navigate('Information'); 
};

  const handlePremiumUpgrade = () => {
    setShowPremiumPopup(true);
  };

  const handleAcceptPremium = () => {
    setShowPremiumPopup(false);
    navigation.navigate('PricesPremium');
  };

  const handleDeclinePremium = () => {
    setShowPremiumPopup(false);
    console.log('User declined premium upgrade');
  };

  const CardComponent = ({ card, isDarkMode }) => {
    if (!card) {
      return (
        <View
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? '#333' : '#FAF8F6' },
          ]}></View>
      );
    }

    const imageSource = card.image
      ? { uri: card.image }
      : require('../imgs/imgb64.jpg');

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: isDarkMode ? '#333' : '#FAF8F6' },
        ]}>
        <Image source={imageSource} style={styles.cardImage} />
        <Text
          style={[styles.cardText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {card.name}, {card.age}
        </Text>
        <Text
          style={[styles.cardText, { color: isDarkMode ? '#AAA' : '#555' }]}>
          {card.programming_languages}
        </Text>
      </View>
    );
  };

  const noMoreCards = currentIndex >= cards.length;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0B0804' : '#FAF8F6' },
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleInformationPage} 
          style={styles.iconContainer}>
          <Ionicons
            name="information-circle-outline" 
            size={24}
            color={isDarkMode ? '#FFF' : '#000'}
          />
        </TouchableOpacity>
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
        <TouchableOpacity
          onPress={handlePremiumUpgrade}
          style={styles.iconContainer}>
          <Ionicons
            name="logo-euro"
            size={24}
            color={isDarkMode ? '#FFF' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#FFF' : '#000'}
          />
          <Text
            style={[
              styles.loadingText,
              { color: isDarkMode ? '#FFF' : '#000' },
            ]}>
               {isSpanish ? 'Buscando usuarios...' : 'Searching for users...'}

          </Text>
        </View>
      ) : noMoreCards ? (
        <View style={styles.noUsersContainer}>
          <Text
            style={[
              styles.noUsersText,
              { color: isDarkMode ? '#FFF' : '#000' },
            ]}>
            {isSpanish ? 'No hay más usuarios disponibles.' : 'No more users available.'}
          </Text>
          <TouchableOpacity style={styles.promoteButton} onPress={handlePromo}>
            <Text style={styles.promoteButtonText}>
              {isSpanish ? '¡Comparte la aplicación!' : 'Share the app!'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Swiper
            ref={swiperRef}
            cards={cards}
            renderCard={renderCard}
            onSwiping={onSwiping}
            onSwiped={(index) =>
              onSwiped(index, decision === 'YES' ? 'right' : 'left')
            }
            backgroundColor={'transparent'}
            stackSize={3}
            stackSeparation={15}
            infinite={false}
            showSecondCard
            cardIndex={currentIndex}
            containerStyle={styles.swiperContainer}
            overlayLabels={{
              left: {
                title: 'NO',
                style: styles.noLabel,
              },
              right: {
                title: 'YES',
                style: styles.yesLabel,
              },
            }}
            verticalSwipe={false}
            horizontalSwipe={true}
            horizontalThreshold={swipeThreshold}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.iconContainer}>
              <Icon name="times" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}>
              <Icon name="heart" size={30} color="green" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {showMatchPopup && (
        <MatchPopup
          name={matchedUserName}
          onClose={() => setShowMatchPopup(false)}
        />
      )}

      {showPremiumPopup && (
        <PremiumPopup
          onClose={handleDeclinePremium}
          onAccept={handleAcceptPremium}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  matchPopupContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  heartWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  heart: {
    alignItems: 'center',
  },
  heartIcon: {
    marginBottom: 20,
  },
  matchText: {
    fontSize: 28,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchName: {
    fontSize: 20,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  popupButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  popupButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  iconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    padding: 20,
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
  },
  noLabel: {
    label: {
      backgroundColor: 'red',
      borderColor: 'red',
      color: 'white',
      borderWidth: 1,
      fontSize: 44,
    },
    wrapper: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginTop: 30,
      marginLeft: 0,
    },
  },
  yesLabel: {
    label: {
      backgroundColor: 'green',
      borderColor: 'green',
      color: 'white',
      borderWidth: 1,
      fontSize: 44,
    },
    wrapper: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginTop: 30,
      marginLeft: 0,
    },
  },
  card: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  cardImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  noUsersContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noUsersText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  promoteButton: { backgroundColor: '#DC143C', padding: 12, borderRadius: 10 },
  promoteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Swipe;