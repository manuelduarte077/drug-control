export interface Drug {
  id: string;
  name: string;
  description: string;
  startTime: string;
  date: string;
  type: "once" | "daily" | "interval";
  interval?: number; // horas entre dosis (8, 12, 24)
  duration?: number; // días de tratamiento
  image: string;
  takenDates?: string[];
  lastTaken?: string;
  nextDose?: string; // Próxima dosis programada
}
