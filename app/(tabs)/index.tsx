import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';

export default function TodayScreen() {
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePoints = (hours: number) => {
    if (hours === 0) return -1;
    if (hours > 0 && hours <= 1) return -0.5;
    if (hours > 1 && hours <= 2.5) return 0;
    return hours * 0.2;
  };

  const handleSubmit = async () => {
    const numHours = parseFloat(hours);
    if (isNaN(numHours) || description.trim() === '') {
      Alert.alert('Error', 'Please enter valid hours and description');
      return;
    }

    if (numHours < 0 || numHours > 10) {
      Alert.alert('Error', 'Hours must be between 0 and 10');
      return;
    }

    setIsSubmitting(true);
    try {
      const points = calculatePoints(numHours);
      const { error } = await supabase.from('entries').insert({
        hours: numHours,
        description: description.trim(),
        points,
      });

      if (error) throw error;

      setHours('');
      setDescription('');
      Alert.alert('Success', 'Entry saved successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to save entry: ${errorMessage}`);
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#7f5af0', '#2cb67d']}
        style={styles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.cardTitle}>Vaidushi Yuga</Text>
        <Text style={styles.pointsText}>Target: 1000 points</Text>
        <Text style={styles.currentPoints}>Current: 0 points</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Hours Spent (0.0 - 10.0)</Text>
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={setHours}
          placeholder="Enter hours (e.g., 2.5)"
          keyboardType="decimal-pad"
          placeholderTextColor="#94a1b2"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="What did you learn today?"
          multiline
          numberOfLines={4}
          placeholderTextColor="#94a1b2"
          editable={!isSubmitting}
        />

        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16161a',
  },
  gradientCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffffe',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 16,
    color: '#fffffe',
    opacity: 0.8,
  },
  currentPoints: {
    fontSize: 18,
    color: '#fffffe',
    marginTop: 8,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#94a1b2',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#242629',
    borderRadius: 8,
    padding: 12,
    color: '#fffffe',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2cb67d',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#7f5af0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#4a3890',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fffffe',
    fontSize: 16,
    fontWeight: '600',
  },
});