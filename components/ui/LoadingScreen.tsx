import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Svg, Path, Circle, G } from "react-native-svg";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const birdMoveAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let soundObject: Audio.Sound;

    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sunrise.mp3"),
          {
            isLooping: true,
            volume: 0.3,
          },
        );
        soundObject = sound;
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.log("Error loading sound:", error);
      }
    };

    loadSound();

    // ✅ Clean up the sound when the screen unmounts
    return () => {
      if (soundObject) {
        soundObject.stopAsync();
        soundObject.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(birdMoveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(birdMoveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const birdTranslateY = birdMoveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Svg height={200} width={200} viewBox="0 0 200 200">
          {/* Sun */}
          <Circle cx="100" cy="80" r="40" fill="#F9A826" />

          {/* Rotating Sun Rays */}
          <AnimatedSvg
            height={200}
            width={200}
            viewBox="0 0 200 200"
            style={{
              position: "absolute",
              transform: [{ rotate: rotation }],
            }}
          >
            <Path
              d="M100 20 L100 30 M100 130 L100 140 M40 80 L50 80 M150 80 L160 80 M58 38 L65 45 M135 45 L142 38 M58 122 L65 115 M135 115 L142 122"
              stroke="#F9A826"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </AnimatedSvg>

          {/* Person */}
          <Path
            d="M100 140 C95 125 90 120 90 105 C90 95 95 85 100 85 C105 85 110 95 110 105 C110 120 105 125 100 140 Z"
            fill="#2F7E79"
          />
          <Circle cx="100" cy="75" r="15" fill="#2F7E79" />

          {/* Leaf */}
          <Path
            d="M70 160 C60 140 70 120 90 130 C110 140 85 170 70 160 Z"
            fill="#4CAF50"
          />

          {/* Bird Animation */}
          <G>
            <Animated.View
              style={{ transform: [{ translateY: birdTranslateY }] }}
            >
              <Svg height={200} width={200} viewBox="0 0 200 200">
                <Path
                  d="M130 80 C140 70 150 75 145 85 L130 95 C125 100 115 100 110 90 C105 80 115 70 130 80 Z"
                  fill="#F9A826"
                />
                <Path
                  d="M145 85 L160 70 C165 65 170 65 170 70 C170 75 165 80 160 80 L145 85 Z"
                  fill="#F9A826"
                />
                <Circle cx="125" cy="85" r="2" fill="#FFF" />
              </Svg>
            </Animated.View>
          </G>
        </Svg>
      </Animated.View>

      {/* App Name */}
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        Bihani
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Nurturing growth every day
      </Animated.Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontFamily: "PoppinsBold",
    fontSize: 36,
    color: "#2F7E79",
    marginTop: 10,
  },
  tagline: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 30,
  },
  progressContainer: {
    width: width * 0.7,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2F7E79",
    borderRadius: 10,
  },
});

export default LoadingScreen;
