import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDrugs } from "@/hooks/useDrugs";
import { format, isAfter, parseISO } from 'date-fns';
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
  const nextDoseDate = drug.nextDose ? parseISO(drug.nextDose) : null;
  const canTakeNow = nextDoseDate && !isAfter(new Date(), nextDoseDate);

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

  const renderTreatmentInfo = () => {
    switch (drug.type) {
      case 'once':
        return (
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>Dosis única</ThemedText>
            <ThemedText style={styles.infoValue}>
              Tomada: {drug.lastTaken ? format(parseISO(drug.lastTaken), 'dd/MM/yyyy HH:mm') : 'No tomada'}
            </ThemedText>
          </View>
        );
      case 'daily':
        return (
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>Tratamiento diario</ThemedText>
            <ThemedText style={styles.infoValue}>
              Duración: {drug.duration} días
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              Hora programada: {format(parseISO(drug.startTime), 'HH:mm')}
            </ThemedText>
          </View>
        );
      case 'interval':
        return (
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>Tratamiento por intervalos</ThemedText>
            <ThemedText style={styles.infoValue}>
              Cada {drug.interval} horas
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              Duración: {drug.duration} días
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              Próxima dosis: {drug.nextDose ? format(parseISO(drug.nextDose), 'dd/MM/yyyy HH:mm') : 'No programada'}
            </ThemedText>
          </View>
        );
    }
  };

  const renderActionButton = () => {
    if (drug.type === 'once') {
      if (!drug.lastTaken) {
        return (
          <TouchableOpacity
            style={[styles.button, styles.takenButton]}
            onPress={handleMarkAsTaken}
          >
            <ThemedText style={styles.buttonText}>
              Marcar como tomada
            </ThemedText>
          </TouchableOpacity>
        );
      }
      return null;
    }

    if (canTakeNow) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.takenButton]}
          onPress={handleMarkAsTaken}
        >
          <ThemedText style={styles.buttonText}>
            Registrar dosis
          </ThemedText>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
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

          {renderTreatmentInfo()}

          <View style={styles.buttonContainer}>
            {renderActionButton()}
            
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <ThemedText style={styles.buttonText}>
                Eliminar medicamento
              </ThemedText>
            </TouchableOpacity>
          </View>

          {drug.type !== 'once' && (
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
          )}
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
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2196F3',
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});
