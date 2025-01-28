import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddMedicine() {
  const [drugName, setDrugName] = useState("");
  const [description, setDescription] = useState("");
  const [hour, setHour] = useState(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [repetition, setRepetition] = useState("none");
  const [image, setImage] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!drugName || !description) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically save to a database
    const newDrug = {
      id: Date.now().toString(),
      name: drugName,
      description,
      hour: hour.toLocaleTimeString(),
      date: (date || new Date()).toISOString().split("T")[0] + "Z",
      repetition,
      image: image || "https://loremflickr.com/300/300",
    };

    // Navigate back after saving
    router.canGoBack();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <Stack.Screen
          options={{
            title: "Add Medicine",
            headerBackTitle: "Back",
          }}
        />

        <View style={styles.card}>
          <MaterialIcons
            name="medical-services"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Medicine Name"
            value={drugName}
            onChangeText={setDrugName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <MaterialIcons
            name="description"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.card}>
          <MaterialIcons
            name="access-time"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.dateTimeInput}
          >
            <ThemedText style={styles.dateTimeText}>
              {hour.toLocaleTimeString()}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {showTimePicker && Platform.OS === "ios" && (
          <DateTimePicker
            value={hour}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setHour(selectedTime);
            }}
          />
        )}

        <View style={styles.card}>
          <MaterialIcons
            name="event"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTimeInput}
          >
            <ThemedText style={styles.dateTimeText}>
              {date ? date.toLocaleDateString() : "Optional - Today by default"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {showDatePicker && Platform.OS === "ios" && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <View style={styles.card}>
          <MaterialIcons
            name="repeat"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPicker(true)}
          >
            <ThemedText style={styles.pickerButtonText}>
              {repetition === "none"
                ? "No Repetition"
                : repetition === "daily"
                ? "Daily"
                : repetition === "weekly"
                ? "Weekly"
                : "Monthly"}
            </ThemedText>
            <MaterialIcons name="arrow-drop-down" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {showPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={repetition}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setRepetition(itemValue);
                setShowPicker(false);
              }}
            >
              <Picker.Item label="No Repetition" value="none" />
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
            </Picker>
          </View>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialIcons name="add-photo-alternate" size={24} color="#666" />
          <ThemedText style={styles.imageButtonText}>Add Photo</ThemedText>
        </TouchableOpacity>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <MaterialIcons name="check" size={24} color="#fff" />
          <ThemedText style={styles.submitButtonText}>Save Medicine</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  content: {
    padding: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: {
    marginRight: 16,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#2C3E50",
    fontWeight: "500",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  dateTimeInput: {
    flex: 1,
  },
  dateTimeText: {
    fontSize: 17,
    color: "#2C3E50",
    fontWeight: "500",
  },
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerButtonText: {
    fontSize: 17,
    color: "#2C3E50",
    fontWeight: "500",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  picker: {
    height: 200,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  imageButtonText: {
    marginLeft: 12,
    fontSize: 17,
    color: "#2C3E50",
    fontWeight: "500",
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
