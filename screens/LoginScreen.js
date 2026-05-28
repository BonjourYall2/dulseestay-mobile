import { useEffect, useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as WebBrowser from "expo-web-browser";

import * as Google from "expo-auth-session/providers/google";

import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // GOOGLE AUTH
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId:
      "475211308930-phj1o7l2021kv8p9n89dovuc6h9dga1k.apps.googleusercontent.com",

    androidClientId:
      "475211308930-utjgclgpm6t9fs8j8a38l15pe352rsah.apps.googleusercontent.com",
  });

  // GOOGLE RESPONSE
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await setDoc(
            doc(db, "users", user.uid),
            {
              name: user.displayName,

              email: user.email,

              role: "user",

              profileImage: user.photoURL,
            },
            {
              merge: true,
            },
          );

          Alert.alert("Success", "Google Login Successful!");

          navigation.replace("Main");
        })

        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);

  // EMAIL LOGIN
  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DulseeStay</Text>

      <Text style={styles.subtitle}>Welcome Back</Text>

      {/* EMAIL */}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* PASSWORD */}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* LOGIN */}

      <TouchableOpacity style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* GOOGLE */}

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
      >
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* REGISTER */}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F3F4F6",
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },

  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 40,
  },

  input: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  googleButton: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  googleText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerText: {
    marginTop: 25,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 16,
  },
});
