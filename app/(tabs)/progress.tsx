import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';

export default function ProgressScreen() {
  const [stats, setStats] = useState({
    totalPoints: 0,
    progress: 0,
    daysActive: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      // Get total points
      const { data: pointsData, error: pointsError } = await supabase
        .from('entries')
        .select('points');

      if (pointsError) throw pointsError;

      const totalPoints = pointsData.reduce((sum, entry) => sum + entry.points, 0);
      const progress = (totalPoints / 1000) * 100;

      // Get unique days
      const { data: daysData, error: daysError } = await supabase
        .from('entries')
        .select('created_at');

      if (daysError) throw daysError;

      const uniqueDays = new Set(
        daysData.map((entry) => entry.created_at.split('T')[0])
      ).size;

      setStats({
        totalPoints,
        progress: Math.min(progress, 100),
        daysActive: uniqueDays,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#7f5af0"
        />
      }>
      <LinearGradient
        colors={['#7f5af0', '#2cb67d']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.title}>Your Journey</Text>
        <Text style={styles.subtitle}>Vaidushi Yuga Progress</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Points</Text>
          <Text style={styles.statValue}>{stats.totalPoints.toFixed(1)}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Progress</Text>
          <Text style={styles.statValue}>{stats.progress.toFixed(1)}%</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Days Active</Text>
          <Text style={styles.statValue}>{stats.daysActive}</Text>
        </View>

        <View style={[styles.statCard, styles.targetCard]}>
          <Text style={styles.statTitle}>Points to Goal</Text>
          <Text style={styles.statValue}>
            {Math.max(0, 1000 - stats.totalPoints).toFixed(1)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16161a',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fffffe',
  },
  subtitle: {
    fontSize: 16,
    color: '#fffffe',
    opacity: 0.8,
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#242629',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  targetCard: {
    borderColor: '#7f5af0',
    borderWidth: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#94a1b2',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffffe',
  },
});