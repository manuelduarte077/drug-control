import { StyleSheet } from "react-native";

import DrugItem from "@/components/DrugItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

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
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedText type="title" style={styles.title}>
        Historial de medicamentos
      </ThemedText>

      {data.map((drug) => (
        <DrugItem key={drug.id} drug={drug} />
      ))}
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
});
