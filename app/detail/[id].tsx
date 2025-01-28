import DrugItem from "@/components/DrugItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";

export default function DetailMedicine() {
  const { id } = useLocalSearchParams();

  console.log(id);

  const data = [
    {
      id: id as string,
      name: "Aspirin",
      description:
        "Aspirin es un medicamento que se utiliza para tratar la fiebre y la tos.",
      hour: "12:00",
      date: "2023-05-01",
      repetition: "Diariamente",
      image: "https://loremflickr.com/300/300",
    },
  ];

  return (
    <ThemedView>
      <Stack.Screen
        options={{ title: "Detail Medicine", headerBackTitle: "Back" }}
      />
      <ThemedText>Detalle de medicamento</ThemedText>
      <FlatList
        data={data}
        renderItem={({ item }) => <DrugItem drug={item} />}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
