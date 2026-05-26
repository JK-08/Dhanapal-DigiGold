import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  ImageBackground,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { useOnboardingBanners } from '../../api/hooks/Onboard/useOnboardingBanners';
import { Banner } from '../../types/onboarding';
import { FONTS, SIZES, COLORS } from '../../theme/theme';

const TITLES = ['ViserGold', 'Trust and Security', 'Invest in Gold for the Future'];
const DESCRIPTIONS = [
  'Smart & Secure Digital Gold Platform',
  'Your gold investments are fully secure. Trade with confidence, knowing your assets are protected.',
  'Gold is a timeless investment that grows with you. Start building your wealth today with smart and secure gold trading.',
];

const OnboardingScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const { banners, loading, getImageUrl } = useOnboardingBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = banners.map((item: Banner, index: number) => ({
    id: String(item.BannerId),
    image: { uri: getImageUrl(item.image_path) },
    title: TITLES[index] ?? item.title,
    description: DESCRIPTIONS[index] ?? '',
    isIntro: index === 0,
  }));

  const isLast = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Register');
    }
  };

  const handleSkip = () => {
    navigation.replace('Register');
  };
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <ActivityIndicator size="large" color="#FFCA28" />
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* Background Image */}
        <ImageBackground
          source={item.image}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Dark Overlay */}
          <View style={styles.overlay} />

          {/* Golden Gradient */}
          {!item.isIntro && <View style={styles.bottomGlow} />}

          <View style={styles.safeArea}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {slides.map((_: unknown, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    index <= currentIndex && styles.activeProgressBar,
                  ]}
                />
              ))}
            </View>

            {/* Intro Screen */}
            {item.isIntro ? (
              <View style={styles.introContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleNext}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.contentWrapper}>
                {/* Image Card */}
                <View style={styles.imageCard}>
                  <Image
                    source={item.image}
                    style={styles.cardImage}
                  />
                </View>

                {/* Text Section */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>
                    {item.title}
                  </Text>

                  <Text style={styles.description}>
                    {item.description}
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNext}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isLast ? 'Get Started' : 'Next'}
                    </Text>
                  </TouchableOpacity>

                  {!isLast && (
                    <TouchableOpacity
                      onPress={handleSkip}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.skipText}>
                        Skip
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );

          setCurrentIndex(index);
        }}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  slide: {
    width,
    height,
    backgroundColor: COLORS.black,
  },

  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  imageStyle: {
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

  },

  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: COLORS.bottomGlow,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 25,
  },

  /* ================= INTRO ================= */

  introContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },



  introBottom: {
    width: '100%',
  },

  /* ================= PROGRESS ================= */

  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },

  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  activeProgressBar: {
    backgroundColor: COLORS.primary,
  },

  /* ================= CONTENT ================= */

  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },

  imageCard: {
    width: '100%',
    height: height * 0.62,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111',
    shadowColor: '#FFC928',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  textContainer: {
    marginTop: 12,
    marginBottom: 8,
  },

  title: {
    fontFamily: FONTS.family.extraBold,
    fontSize: SIZES.heading.h3,
    color: '#fff',
    marginBottom: 10,
  },

  description: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.lg,
    lineHeight: SIZES.font.lg * 1.6,
    color: 'rgba(255,255,255,0.72)',
  },

  /* ================= BUTTONS ================= */

  buttonContainer: {
    marginTop: 12,
  },

  primaryButton: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },

  primaryButtonText: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.font.lg,
    color: COLORS.white,
  },

  skipText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.md,
    marginTop: 18,
    textAlign: 'center',
    color: COLORS.primary,
  },
});