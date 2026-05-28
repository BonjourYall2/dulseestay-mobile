import { useCallback, useState } from "react";

import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useFocusEffect } from "@react-navigation/native";

import { auth, db } from "../firebase/config";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { signOut, updatePassword } from "firebase/auth";

function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const [name, setName] = useState("");

  const [email, setEmail] = useState(user?.email);

  const [password, setPassword] = useState("");

  const [image, setImage] = useState("https://i.pravatar.cc/300");

  const [bookings, setBookings] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  // LOAD USER DATA
  const loadUserData = async () => {
    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      setName(data.name);

      setImage(data.profileImage || "https://i.pravatar.cc/300");
    }
  };

  // LOAD BOOKINGS
  const loadBookings = async () => {
    const bookingsRef = collection(db, "bookings");

    const q = query(bookingsRef, where("userEmail", "==", user.email));

    const querySnapshot = await getDocs(q);

    const bookingList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBookings(bookingList);
  };

  // REFRESH
  const onRefresh = async () => {
    setRefreshing(true);

    await loadUserData();

    await loadBookings();

    setRefreshing(false);
  };

  // AUTO REFRESH
  useFocusEffect(
    useCallback(() => {
      loadUserData();

      loadBookings();
    }, []),
  );

  // PICK IMAGE
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setImage(imageUri);

      await updateDoc(doc(db, "users", user.uid), {
        profileImage: imageUri,
      });

      Alert.alert("Success", "Profile picture updated!");
    }
  };

  // SAVE PROFILE
  const saveProfile = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      name,
    });

    Alert.alert("Success", "Profile updated!");
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    try {
      await updatePassword(user, password);

      Alert.alert("Success", "Password updated!");

      setPassword("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // LOGOUT
  const logoutUser = async () => {
    await signOut(auth);

    navigation.replace("Login");
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>My Profile</Text>

      {/* IMAGE */}

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />

        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      {/* PROFILE */}

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />

        <TextInput style={styles.input} value={email} editable={false} />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      {/* PASSWORD */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={changePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      {/* BOOKINGS */}

      <Text style={styles.sectionTitle}>Booking History</Text>

      {bookings.map((item) => (
        <View key={item.id} style={styles.bookingCard}>
          <Text style={styles.roomName}>{item.roomName}</Text>

          <Text>Status: {item.status}</Text>
        </View>
      ))}

      {/* LOGOUT */}

      <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  changePhoto: {
    marginTop: 10,
    color: "#2563EB",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 50,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  bookingCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },

  roomName: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
