import { Image, StyleSheet } from "react-native";

import DrugItem from "@/components/DrugItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedText type="title" style={styles.title}>
        Lista de medicamentos
      </ThemedText>

      {drug.map((drug) => (
        <DrugItem key={drug.id} drug={drug} />
      ))}

      <Link href="/addMedicine" style={styles.link}>
        Agregar Medicamento
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },

  link: {
    color: "blue",
  },
});
