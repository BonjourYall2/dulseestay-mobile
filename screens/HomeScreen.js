import { useEffect, useState } from "react";

import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { addDoc, collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/config";

function HomeScreen() {
  const [rooms, setRooms] = useState([]);

  const [search, setSearch] = useState("");

  // GET ROOMS
  const getRooms = async () => {
    try {
      const roomsCollection = collection(db, "rooms");

      const data = await getDocs(roomsCollection);

      setRooms(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  // BOOK ROOM
  const bookRoom = async (room) => {
    try {
      await addDoc(collection(db, "bookings"), {
        roomName: room.name,

        location: room.location,

        price: room.price,

        image: room.image,

        userName: "Sample User",

        checkIn: "May 26 2026",

        checkOut: "May 28 2026",

        status: "Pending",

        createdAt: new Date(),
      });

      Alert.alert("Success", "Booking Successful!");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", error.message);
    }
  };

  // SEARCH FILTER
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DulseeStay</Text>

          <Text style={styles.subtitle}>Find your perfect hotel</Text>
        </View>

        <Ionicons name="notifications-outline" size={32} color="black" />
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={24} color="gray" />

        <TextInput
          placeholder="Search hotels..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ROOMS */}

      {filteredRooms.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.cardContent}>
            <Text style={styles.roomName}>{item.name}</Text>

            <Text style={styles.location}>{item.location}</Text>

            <Text style={styles.price}>₱{item.price} / night</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => bookRoom(item)}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 25,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 25,
  },

  searchInput: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 30,
  },

  image: {
    width: "100%",
    height: 250,
  },

  cardContent: {
    padding: 20,
  },

  roomName: {
    fontSize: 24,
    fontWeight: "bold",
  },

  location: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2F80ED",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
