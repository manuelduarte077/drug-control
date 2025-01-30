import { ActivityIndicator, StyleSheet } from "react-native";

import DrugItem from "@/components/DrugItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDrugs } from "@/hooks/useDrugs";


const data = [
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

export default function TabTwoScreen() {
  const { drugs, loading } = useDrugs();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={210}
          color="#808080"
          name="heart"
          style={styles.headerImage}
        />
      }
    >
      <ThemedText type="title" style={styles.title}>
        Historial de medicamentos
      </ThemedText>

      <ThemedView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : drugs.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No hay medicamentos agregados
          </ThemedText>
        ) : (
          drugs.map((drug) => <DrugItem key={drug.id} drug={drug} />)
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  title: {
    fontSize: 24,
  },
  content: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
