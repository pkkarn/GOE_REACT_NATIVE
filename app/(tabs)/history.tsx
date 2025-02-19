import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

type Entry = {
  id: string;
  created_at: string;
  hours: number;
  description: string;
  points: number;
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to fetch entries: ${errorMessage}`);
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const renderItem = ({ item }: { item: Entry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.date}>
          {format(new Date(item.created_at), 'MMM d, yyyy')}
        </Text>
        <Text style={[styles.points, item.points < 0 ? styles.negativePoints : {}]}>
          {item.points > 0 ? '+' : ''}{item.points} points
        </Text>
      </View>
      <Text style={styles.hours}>{item.hours} hours</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7f5af0"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No entries yet'}
            </Text>
            {!loading && (
              <Text style={styles.emptySubtext}>
                Start tracking your learning journey today!
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16161a',
  },
  entryCard: {
    backgroundColor: '#242629',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7f5af0',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    color: '#94a1b2',
    fontSize: 14,
  },
  points: {
    color: '#2cb67d',
    fontWeight: '600',
  },
  negativePoints: {
    color: '#ef4565',
  },
  hours: {
    color: '#fffffe',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#94a1b2',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#fffffe',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#94a1b2',
    textAlign: 'center',
  },
});