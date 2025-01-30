import { Drug } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, addHours, format, isAfter, parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@drugs";

export function useDrugs() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const loadDrugs = async () => {
    setLoading(true);
    try {
      const storedDrugs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDrugs) {
        const parsedDrugs = JSON.parse(storedDrugs);
        const updatedDrugs = parsedDrugs.map((drug: Drug) => {
          if (drug.isCompleted) return drug;

          const now = new Date();
          if (drug.type === "daily" && drug.startTime) {
            const [hours, minutes] = drug.startTime.split(":");
            const nextDate = new Date(now);
            nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            if (nextDate < now) {
              nextDate.setDate(nextDate.getDate() + 1);
            }

            drug.nextDose = format(nextDate, "yyyy-MM-dd HH:mm:ss");
          } else if (drug.type === "interval" && drug.lastTaken) {
            const lastTaken = parseISO(drug.lastTaken);
            const nextDose = addHours(lastTaken, drug.interval || 24);
            if (isAfter(nextDose, now)) {
              drug.nextDose = format(nextDose, "yyyy-MM-dd HH:mm:ss");
            }
          }
          return drug;
        });
        setDrugs(updatedDrugs);
      }
    } catch (error) {
      console.error("Error loading drugs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrugs();
  }, [refreshKey]);

  const saveDrug = async (drug: Drug) => {
    try {
      const now = new Date();
      let scheduledDates: string[] = [];
      let nextDose: string | undefined;

      if (drug.type === "daily") {
        const startTime = drug.startTime.split(":");
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0);

        nextDose = format(tomorrow, "yyyy-MM-dd HH:mm:ss");
        scheduledDates = Array.from({ length: drug.duration || 1 }, (_, i) =>
          format(addDays(now, i), "yyyy-MM-dd")
        );
      } else if (drug.type === "interval") {
        nextDose = format(
          addHours(now, drug.interval || 24),
          "yyyy-MM-dd HH:mm:ss"
        );
        const totalDoses = Math.ceil(
          ((drug.duration || 1) * 24) / (drug.interval || 24)
        );
        scheduledDates = Array.from({ length: totalDoses }, (_, i) =>
          format(addHours(now, i * (drug.interval || 24)), "yyyy-MM-dd")
        );
      }

      const newDrug = {
        ...drug,
        scheduledDates,
        remainingDoses: drug.type === "once" ? 1 : scheduledDates.length,
        totalDoses: drug.type === "once" ? 1 : scheduledDates.length,
        nextDose,
      };

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
      await loadDrugs();
      return true;
    } catch (error) {
      console.error("Error deleting drug:", error);
      return false;
    }
  };

  const markAsTaken = async (id: string) => {
    try {
      const now = new Date();
      const today = format(now, "yyyy-MM-dd");

      const updatedDrugs = drugs.map((drug) => {
        if (drug.id === id) {
          const totalTaken = (drug.takenDates?.length || 0) + 1;
          const expectedTakes =
            (drug.type === "daily"
              ? drug.duration
              : drug.type === "interval"
              ? Math.ceil(((drug.duration || 1) * 24) / (drug.interval || 24))
              : 1) || 1;

          const remainingDoses = expectedTakes - totalTaken;
          let nextDose: string | undefined;
          let isCompleted = false;

          if (remainingDoses <= 0) {
            isCompleted = true;
            nextDose = undefined;
          } else {
            if (drug.type === "daily") {
              const nextDate = addDays(parseISO(today), 1);
              nextDate.setHours(
                parseInt(drug.startTime.split(":")[0]),
                parseInt(drug.startTime.split(":")[1]),
                0,
                0
              );
              nextDose = format(nextDate, "yyyy-MM-dd HH:mm:ss");
            } else if (drug.type === "interval") {
              nextDose = format(
                addHours(now, drug.interval || 24),
                "yyyy-MM-dd HH:mm:ss"
              );
            }
          }

          return {
            ...drug,
            lastTaken: format(now, "yyyy-MM-dd HH:mm:ss"),
            takenDates: [...(drug.takenDates || []), today],
            nextDose,
            remainingDoses,
            isCompleted,
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
    refresh,
  };
}
