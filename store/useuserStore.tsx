import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the user state interface
interface UserState {
  userId: string | null;
  email: string | null;
  name: string | null;
  stepsGoal: number;
  waterGoal: number;
  isAuthenticated: boolean;
  isLoggingOut: boolean;

  // Actions to update user state
  setUser: (userData: { userId: string; email: string; name?: string }) => void;

  updateGoals: (goals: { stepsGoal?: number; waterGoal?: number }) => void;

  clearUser: () => void;
  setLoggingOut: (isLoggingOut: boolean) => void;
}

// Create the Zustand store with persist middleware
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      name: null,
      stepsGoal: 8000, // Default steps goal
      waterGoal: 10, // Default water goal
      isAuthenticated: false,
      isLoggingOut: false,

      // Set user data when logging in or signing up
      setUser: (userData) =>
        set({
          userId: userData.userId,
          email: userData.email,
          name: userData.name || null,
          isAuthenticated: true,
          isLoggingOut: false,
        }),

      // Update goals separately

      updateGoals: (goals) =>
        set((state) => ({
          stepsGoal: goals.stepsGoal ?? state.stepsGoal,
          waterGoal: goals.waterGoal ?? state.waterGoal,
        })),

      // Clear user data on logout
      clearUser: () =>
        set({
          userId: null,
          email: null,
          name: null,
          stepsGoal: 8000,
          waterGoal: 10,
          isAuthenticated: false,
          isLoggingOut: false,
        }),
      setLoggingOut: (isLoggingOut) => set({ isLoggingOut }),
    }),
    {
      name: "user-storage", // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        name: state.name,
        stepsGoal: state.stepsGoal,
        waterGoal: state.waterGoal,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useUserStore;
