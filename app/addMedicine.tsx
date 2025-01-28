import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function AddMedicine() {
  const [drugName, setDrugName] = useState("");
  const [description, setDescription] = useState("");
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [repetition, setRepetition] = useState("");
  const [image, setImage] = useState("");

  return (
    <ThemedView>
      <Stack.Screen
        options={{ title: "Add Medicine", headerBackTitle: "Back" }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
