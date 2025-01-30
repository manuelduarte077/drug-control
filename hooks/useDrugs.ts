import { Drug } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@drugs";

export function useDrugs() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      const storedDrugs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDrugs) {
        setDrugs(JSON.parse(storedDrugs));
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

  return {
    drugs,
    loading,
    saveDrug,
    deleteDrug,
  };
}
