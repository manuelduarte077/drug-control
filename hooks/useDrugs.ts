import { Drug } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addHours, format } from "date-fns";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@drugs";

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
        setDrugs([]);
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
          const now = new Date();
          const nextDose =
            drug.type === "interval"
              ? format(
                  addHours(now, drug.interval || 24),
                  "yyyy-MM-dd HH:mm:ss"
                )
              : drug.type === "daily"
              ? format(addHours(now, 24), "yyyy-MM-dd HH:mm:ss")
              : undefined;

          return {
            ...drug,
            lastTaken: format(now, "yyyy-MM-dd HH:mm:ss"),
            takenDates: [...(drug.takenDates || []), today],
            nextDose,
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
