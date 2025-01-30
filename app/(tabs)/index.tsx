import { AntDesign } from "@expo/vector-icons";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import DrugItem from "@/components/DrugItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Drug } from "@/types/types";
import { Link } from "expo-router";
import React from "react";

const drug: Drug[] = [
  {
    id: "1",
    name: "Aspirin",
    description:
      "Aspirin es un medicamento que se utiliza para tratar la fiebre y la tos.",
    hour: "12:00",
    date: "2023-05-01",
    repetition: "Diariamente",
    image: "https://loremflickr.com/300/300",
  },
  {
    id: "2",
    name: "Paracetamol",
    description:
      "Paracetamol es un medicamento que se utiliza para tratar la tos y la fiebre.",
    hour: "12:00",
    date: "2023-05-01",
    repetition: "Diariamente",
    image: "https://loremflickr.com/300/300",
  },
  {
    id: "3",
    name: "Ibuprofeno",
    description:
      "Ibuprofeno es un medicamento que se utiliza para tratar la tos y la fiebre.",
    hour: "12:00",
    date: "2023-05-01",
    repetition: "Diariamente",
    image: "https://loremflickr.com/300/300",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: Platform.OS === "ios" ? 44 : 55,
      }}>
      <ThemedView style={styles.appBar}>
        <ThemedText type="title" style={styles.appBarTitle}>
          Medicamentos
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {drug.map((drug) => (
          <DrugItem key={drug.id} drug={drug} />
        ))}
      </ThemedView>

      <Link href="/addMedicine" asChild>
        <TouchableOpacity style={styles.fab}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196F3",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#2196F3",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: Platform.OS === "ios" ? 90 : 20,
    backgroundColor: "#2196F3",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
