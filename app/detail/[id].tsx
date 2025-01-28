import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

export default function DetailMedicine() {
  const { id } = useLocalSearchParams();

  const data = {
    id: id as string,
    name: "Aspirin",
    description:
      "Aspirin es un medicamento que se utiliza para tratar la fiebre y la tos.",
    hour: "12:00",
    date: "2023-05-01",
    repetition: "Diariamente",
    image: "https://loremflickr.com/300/300",
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <Stack.Screen
          options={{ title: "Detail Medicine", headerBackTitle: "Back" }}
        />

        <View style={styles.imageContainer}>
          <Image source={{ uri: data.image }} style={styles.image} />
        </View>

        <View style={styles.detailsContainer}>
          <ThemedText style={styles.title}>{data.name}</ThemedText>
          <ThemedText style={styles.description}>{data.description}</ThemedText>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Hora</ThemedText>
              <ThemedText style={styles.infoValue}>{data.hour}</ThemedText>
            </View>

            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Fecha</ThemedText>
              <ThemedText style={styles.infoValue}>{data.date}</ThemedText>
            </View>

            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Repetición</ThemedText>
              <ThemedText style={styles.infoValue}>
                {data.repetition}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1E293B",
  },
  description: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 20,
    lineHeight: 24,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 20,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
});
