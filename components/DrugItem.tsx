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
  const imageSource = drug.image.startsWith('data:') 
    ? { uri: drug.image }
    : { uri: drug.image };

  return (
    <Link href={`/detail/${drug.id}`}>
      <ThemedView style={styles.item}>
        <Image
          source={imageSource}
          style={styles.image}
        />
        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.title}>{drug.name}</ThemedText>
          <ThemedText style={styles.text}>Hora: {drug.hour}</ThemedText>
          <ThemedText style={styles.text}>Repetición: {drug.repetition}</ThemedText>
        </ThemedView>
      </ThemedView>
    </Link>
  );
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 4
  },
  text: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
    fontWeight: "400"
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 6
  }
});
