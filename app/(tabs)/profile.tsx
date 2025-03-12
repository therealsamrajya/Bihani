import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import SignUp from "@/components/form/SignUp";
import Login from "@/components/form/Login";

const Profile = () => {
  const [showLogin, setShowLogin] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width } = Dimensions.get("window");

  const navigateToRegister = () => {
    // Animate out current form
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLogin(false);
      // Reset animations for next form
      slideAnim.setValue(50);
      // Animate in new form
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const navigateToLogin = () => {
    // Animate out current form
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLogin(true);
      // Reset animations for next form
      slideAnim.setValue(50);
      // Animate in new form
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Set initial animation values
  useEffect(() => {
    slideAnim.setValue(0);
    fadeAnim.setValue(1);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {showLogin ? (
              <Login onNavigatetoRegister={navigateToRegister} />
            ) : (
              <SignUp onNavigatetoLogin={navigateToLogin} />
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30, // Add extra padding at bottom
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerContainer: {
    paddingVertical: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",

    color: "#333",
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    color: "#666",
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 20,
  },
});

export default Profile;
