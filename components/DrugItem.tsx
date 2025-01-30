import { Drug } from "@/types/types";
import { MaterialIcons } from '@expo/vector-icons';
import { format, isAfter, parseISO } from 'date-fns';
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface DrugItemProps {
  drug: Drug;
}

export default function DrugItem({ drug }: DrugItemProps) {
  const imageSource = drug.image.startsWith('data:') 
    ? { uri: drug.image }
    : { uri: drug.image };

  const nextDoseDate = drug.nextDose ? parseISO(drug.nextDose) : null;
  const isOverdue = nextDoseDate && isAfter(new Date(), nextDoseDate);

  const renderStatus = () => {
    if (drug.type === 'once') {
      return (
        <View style={styles.statusContainer}>
          <MaterialIcons 
            name={drug.lastTaken ? "check-circle" : "schedule"} 
            size={16} 
            color={drug.lastTaken ? "#4CAF50" : "#FFA000"}
          />
          <ThemedText style={[
            styles.status,
            { color: drug.lastTaken ? "#4CAF50" : "#FFA000" }
          ]}>
            {drug.lastTaken ? "Tomada" : "Pendiente"}
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.statusContainer}>
        <MaterialIcons 
          name={isOverdue ? "warning" : "schedule"} 
          size={16} 
          color={isOverdue ? "#F44336" : "#2196F3"}
        />
        <ThemedText style={[
          styles.status,
          { color: isOverdue ? "#F44336" : "#2196F3" }
        ]}>
          {drug.nextDose 
            ? `Próxima: ${format(parseISO(drug.nextDose), 'HH:mm')}`
            : "No programada"}
        </ThemedText>
      </View>
    );
  };

  const renderInterval = () => {
    switch (drug.type) {
      case 'once':
        return "Dosis única";
      case 'daily':
        return "Diariamente";
      case 'interval':
        return `Cada ${drug.interval} horas`;
    }
  };

  return (
    <Link href={`/detail/${drug.id}`}>
      <ThemedView style={styles.item}>
        <Image
          source={imageSource}
          style={styles.image}
        />
        <ThemedView style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {drug.name}
            </ThemedText>
            {renderStatus()}
          </View>
          
          <ThemedText style={styles.description} numberOfLines={2}>
            {drug.description}
          </ThemedText>
          
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <MaterialIcons name="repeat" size={14} color="#64748B" />
              <ThemedText style={styles.footerText}>
                {renderInterval()}
              </ThemedText>
            </View>
            
            {drug.duration && drug.duration > 1 && (
              <View style={styles.footerItem}>
                <MaterialIcons name="event" size={14} color="#64748B" />
                <ThemedText style={styles.footerText}>
                  {drug.duration} días
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>
      </ThemedView>
    </Link>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
    lineHeight: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
});
