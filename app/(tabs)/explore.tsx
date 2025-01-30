import DrugItem from "@/components/DrugItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDrugs } from "@/hooks/useDrugs";
import { parseISO } from "date-fns";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function ExploreScreen() {
  const { drugs, loading } = useDrugs();

  const getTakenDrugs = () => {
    return drugs.filter(drug => {
      if (drug.type === 'once') {
        return drug.lastTaken; // Si tiene lastTaken, fue tomada
      }
      
      if (drug.type === 'daily' || drug.type === 'interval') {
        const duration = drug.duration || 1;
        const firstTakenDate = drug.takenDates?.[0];
        if (!firstTakenDate) return false;
        
        // Calcular si ya se completó el tratamiento
        const startDate = parseISO(firstTakenDate);
        const expectedTakes = drug.type === 'daily' 
          ? duration 
          : Math.floor((duration * 24) / (drug.interval || 24));
        
        return drug.takenDates?.length === expectedTakes;
      }
      
      return false;
    });
  };

  const takenDrugs = getTakenDrugs();

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
        ) : takenDrugs.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No hay medicamentos completados
          </ThemedText>
        ) : (
          takenDrugs.map((drug) => (
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
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
