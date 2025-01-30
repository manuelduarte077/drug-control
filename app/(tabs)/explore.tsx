import DrugItem from "@/components/DrugItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDrugs } from "@/hooks/useDrugs";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function ExploreScreen() {
  const { drugs, loading } = useDrugs();

  const completedDrugs = drugs.filter((drug) => drug.isCompleted);

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

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : completedDrugs.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          No hay medicamentos completados
        </ThemedText>
      ) : (
        completedDrugs.map((drug) => (
          <DrugItem key={drug.id} drug={drug} showCompleted />
        ))
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
