import { Drug } from "@/types/types";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface DrugItemProps {
  drug: Drug;
}

export default function DrugItem({ drug }: DrugItemProps) {
  return (
    <Link href={`/detail/${drug.id}`}>
      <ThemedView style={styles.item}>
        <Image
          source={{ uri: drug.image }}
          style={{ width: 100, height: 100 }}
        />
        <ThemedText>Nombre: {drug.name}</ThemedText>
        <ThemedText>Descripción: {drug.description}</ThemedText>
        <ThemedText>Hora: {drug.hour}</ThemedText>
        <ThemedText>Fecha: {drug.date}</ThemedText>
        <ThemedText>Repetición: {drug.repetition}</ThemedText>
      </ThemedView>
    </Link>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
