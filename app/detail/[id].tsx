import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDrugs } from "@/hooks/useDrugs";
import { format } from 'date-fns';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Calendar } from 'react-native-calendars';

export default function DetailMedicine() {
  const { id } = useLocalSearchParams();
  const { drugs, deleteDrug, markAsTaken } = useDrugs();
  const drug = drugs.find(d => d.id === id);

  if (!drug) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Medicamento no encontrado</ThemedText>
      </ThemedView>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const canTakeToday = drug.repetition === 'daily' && 
                       drug.lastTaken !== today;

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            await deleteDrug(drug.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleMarkAsTaken = async () => {
    if (await markAsTaken(drug.id)) {
      Alert.alert("¡Éxito!", "Medicamento marcado como tomado");
    } else {
      Alert.alert("Error", "No se pudo marcar el medicamento como tomado");
    }
  };
  

  const markedDates = drug.takenDates?.reduce((acc, date) => ({
    ...acc,
    [date]: { selected: true, marked: true, selectedColor: '#2196F3' }
  }), {});

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.content}>
        <Stack.Screen
          options={{ 
            title: "Detalle del Medicamento",
            headerBackTitle: "Atrás"
          }}
        />

        <View style={styles.imageContainer}>
          <Image source={{ uri: drug.image }} style={styles.image} />
        </View>

        <View style={styles.detailsContainer}>
          <ThemedText style={styles.title}>{drug.name}</ThemedText>
          <ThemedText style={styles.description}>{drug.description}</ThemedText>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Hora</ThemedText>
              <ThemedText style={styles.infoValue}>{drug.hour}</ThemedText>
            </View>

            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Fecha inicio</ThemedText>
              <ThemedText style={styles.infoValue}>{drug.date}</ThemedText>
            </View>

            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Repetición</ThemedText>
              <ThemedText style={styles.infoValue}>{drug.repetition}</ThemedText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {canTakeToday && (
              <TouchableOpacity
                style={[styles.button, styles.takenButton]}
                onPress={handleMarkAsTaken}
              >
                <ThemedText style={styles.buttonText}>
                  Marcar como tomada hoy
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <ThemedText style={styles.buttonText}>
                Eliminar medicamento
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            <ThemedText style={styles.calendarTitle}>
              Registro de tomas
            </ThemedText>
            <Calendar
              markedDates={markedDates}
              theme={{
                todayTextColor: '#2196F3',
                selectedDayBackgroundColor: '#2196F3',
                selectedDayTextColor: '#ffffff',
                arrowColor: '#2196F3',
              }}
            />
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
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  takenButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
