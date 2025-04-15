import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseconfig";
import useUserStore from "../store/useuserStore";

// Type definition for user data
export interface UserData {
  name: string;
  email: string;
  stepsGoal?: number;
  waterGoal?: number;
  stepsTaken?: number;
  waterTaken?: number;
  createdAt?: Date;
}

/**
 * Load user data from Firestore and update the user store
 */
export const loadUserDataFromFirestore = async (
  userId: string,
): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;

      // Update the user store with the loaded data
      const { setUser, updateGoals } = useUserStore.getState();

      // First update the user basic info
      setUser({
        userId,
        email: userData.email,
        name: userData.name,
      });

      // Then update the goals
      if (userData.stepsGoal || userData.waterGoal) {
        updateGoals({
          stepsGoal: userData.stepsGoal,
          waterGoal: userData.waterGoal,
        });
        console.log(
          "Goals loaded from Firestore:",
          userData.stepsGoal,
          userData.waterGoal,
        );
      }

      return userData;
    }
    return null;
  } catch (error) {
    console.error("Error loading user data from Firestore:", error);
    return null;
  }
};

/**
 * Save user data to Firestore
 */
export const saveUserData = async (
  userId: string,
  userData: UserData,
): Promise<boolean> => {
  try {
    const dataToSave = {
      ...userData,
      name: userData.name || "",
      stepsTaken: userData.stepsTaken ?? 0,
      waterTaken: userData.waterTaken ?? 0,

      createdAt: userData.createdAt || new Date(),
    };

    await setDoc(doc(db, "users", userId), dataToSave, { merge: true });
    console.log("User data saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

/**
 * Save steps data to Firestore
 */
export const saveStepsToFirestore = async (steps: number): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      stepsTaken: steps,
      lastStepUpdateTimestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving steps:", error);
  }
};

/**
 * Save water intake to Firestore
 */
export const saveWaterIntakeToFirestore = async (
  glasses: number,
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      waterTaken: glasses,
      lastWaterUpdateTimestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving water intake:", error);
  }
};

/**
 * Update user goals in Firestore
 */
export const updateUserGoals = async (
  stepsGoal?: number,
  waterGoal?: number,
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const updateData: Record<string, any> = {};
    if (stepsGoal !== undefined) updateData.stepsGoal = stepsGoal;
    if (waterGoal !== undefined) updateData.waterGoal = waterGoal;

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, updateData);

    // Also update the store
    useUserStore.getState().updateGoals({
      stepsGoal,
      waterGoal,
    });
  } catch (error) {
    console.error("Error updating user goals:", error);
  }
};
