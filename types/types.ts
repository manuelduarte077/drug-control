export interface Drug {
  id: string;
  name: string;
  description: string;
  startTime: string;
  date: string;
  type: "once" | "daily" | "interval";
  interval?: number; // horas entre dosis (8, 12, 24)
  duration?: number; // días de tratamiento
  remainingDoses?: number; // Dosis restantes
  totalDoses?: number; // Total de dosis del tratamiento
  scheduledDates?: string[]; // Fechas programadas para las dosis
  image: string;
  takenDates?: string[]; // Fechas en las que se ha tomado la dosis
  lastTaken?: string; // Fecha de la última dosis tomada
  nextDose?: string; // Próxima dosis programada
  isCompleted?: boolean; // Nuevo campo para indicar si el tratamiento está completo
}
