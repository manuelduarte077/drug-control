import { Drug } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@drugs";

// Datos de ejemplo
const sampleDrug: Drug = {
  id: "1698523698745",
  name: "Paracetamol",
  description: "Para el dolor de cabeza",
  hour: "08:00:00",
  date: "2024-02-20",
  repetition: "Diariamente",
  image: "https://loremflickr.com/300/300",
  takenDates: ["2024-02-20", "2024-02-21", "2024-02-22"],
  lastTaken: "2024-02-22",
};

export function useDrugs() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    setLoading(true);
    try {
      const storedDrugs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDrugs) {
        setDrugs(JSON.parse(storedDrugs));
      } else {
        // Si no hay datos guardados, usar el ejemplo
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([sampleDrug]));
        setDrugs([sampleDrug]);
      }
    } catch (error) {
      console.error("Error loading drugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveDrug = async (newDrug: Drug) => {
    try {
      const updatedDrugs = [...drugs, newDrug];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrugs));
      setDrugs(updatedDrugs);
      return true;
    } catch (error) {
      console.error("Error saving drug:", error);
      return false;
    }
  };

  const deleteDrug = async (id: string) => {
    try {
      const updatedDrugs = drugs.filter((drug) => drug.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrugs));
      setDrugs(updatedDrugs);
      return true;
    } catch (error) {
      console.error("Error deleting drug:", error);
      return false;
    }
  };

  const markAsTaken = async (id: string) => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const updatedDrugs = drugs.map((drug) => {
        if (drug.id === id) {
          return {
            ...drug,
            lastTaken: today,
            takenDates: [...(drug.takenDates || []), today],
          };
        }
        return drug;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrugs));
      setDrugs(updatedDrugs);
      return true;
    } catch (error) {
      console.error("Error marking drug as taken:", error);
      return false;
    }
  };

  return {
    drugs,
    loading,
    saveDrug,
    deleteDrug,
    markAsTaken,
    refresh: loadDrugs,
  };
}
