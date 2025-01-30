import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDrugs } from "@/hooks/useDrugs";
import { Drug } from "@/types/types";
import { MaterialIcons } from "@expo/vector-icons";
import { addHours, format } from 'date-fns';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddMedicine() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'once' | 'daily' | 'interval'>('once');
  const [interval, setInterval] = useState<number>(24);
  const [duration, setDuration] = useState<number>(1);
  const [image, setImage] = useState<string | null>(null);
  const { saveDrug } = useDrugs();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        try {
          const manipResult = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 300, height: 300 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
          );

          if (manipResult.base64) {
            const base64Image = `data:image/jpeg;base64,${manipResult.base64}`;
            setImage(base64Image);
            console.log('Imagen procesada correctamente');
          } else {
            console.error('No se generó base64');
            Alert.alert('Error', 'No se pudo procesar la imagen');
          }
        } catch (manipError) {
          console.error('Error manipulando imagen:', manipError);
          Alert.alert('Error', 'No se pudo procesar la imagen');
        }
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Por favor seleccione una imagen');
      return;
    }

    const now = new Date();
    const startTime = format(now, 'HH:mm:ss');
    const nextDose = type === 'interval' 
      ? format(addHours(now, interval), 'yyyy-MM-dd HH:mm:ss')
      : type === 'daily' 
        ? format(addHours(now, 24), 'yyyy-MM-dd HH:mm:ss')
        : null;

    try {
      const newDrug: Drug = {
        id: Date.now().toString(),
        name,
        description,
        startTime,
        date: format(now, 'yyyy-MM-dd'),
        type,
        interval: type === 'interval' ? interval : undefined,
        duration: type !== 'once' ? duration : 1,
        image: image,
        takenDates: type !== 'once' ? [format(now, 'yyyy-MM-dd')] : [],
        lastTaken: type !== 'once' ? format(now, 'yyyy-MM-dd') : undefined,
        nextDose: nextDose || undefined
      };

      const success = await saveDrug(newDrug);
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert('Error', 'No se pudo guardar el medicamento');
      }
    } catch (error) {
      console.error('Error guardando medicamento:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el medicamento');
    }
  };

  return (
    <ScrollView style={styles.container} 
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.content}>
        <Stack.Screen options={{ title: "Nuevo Medicamento" , headerBackTitle: "Atrás" }} />

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Nombre del medicamento</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Paracetamol"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Descripción</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Ej: Para el dolor de cabeza"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Tipo de tratamiento</ThemedText>
          <View style={styles.typeContainer}>
            {['once', 'daily', 'interval'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  type === t && styles.typeButtonActive
                ]}
                onPress={() => setType(t as typeof type)}
              >
                <ThemedText style={[
                  styles.typeButtonText,
                  type === t && styles.typeButtonTextActive
                ]}>
                  {t === 'once' ? 'Una vez' : t === 'daily' ? 'Diario' : 'Intervalo'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {type === 'interval' && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Intervalo de horas</ThemedText>
            <View style={styles.typeContainer}>
              {[8, 12, 24].map((hrs) => (
                <TouchableOpacity
                  key={hrs}
                  style={[
                    styles.typeButton,
                    interval === hrs && styles.typeButtonActive
                  ]}
                  onPress={() => setInterval(hrs)}
                >
                  <ThemedText style={[
                    styles.typeButtonText,
                    interval === hrs && styles.typeButtonTextActive
                  ]}>
                    {`${hrs} hrs`}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {type !== 'once' && (
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Duración (días)</ThemedText>
            <TextInput
              style={styles.input}
              value={duration.toString()}
              onChangeText={(text) => setDuration(parseInt(text) || 1)}
              keyboardType="number-pad"
            />
          </View>
        )}

        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={handleImagePick}
        >
          <MaterialIcons name="photo-camera" size={24} color="#666" />
          <ThemedText style={styles.imageButtonText}>
            Tomar foto del medicamento
          </ThemedText>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.previewImage} />
          </View>
        )}

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitButtonText}>
            Guardar medicamento
          </ThemedText>
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreview: {
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

});
