// src/screens/faq/FaqScreen.tsx

import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import AppContentHtml from '../../components/ui/AppContentHtml';
import { useAppContent } from '../../api/hooks/AppContent/useAppContent';

export default function FaqScreen() {
  const { COLORS } = useTheme();
  const navigation = useNavigation<any>();

  // FAQ HTML is stored in AppContent with id = "FAQ".
  const { html, loading, error, refetch } = useAppContent('FAQ');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surfacePage }} edges={[ 'bottom']}>
      <AppHeader
        title="FAQ"
        showBack
        onBackPress={() => navigation.goBack()}
        
      />
      <View style={{ flex: 1 }}>
        <AppContentHtml html={html} loading={loading} error={error} onRetry={refetch} />
      </View>
    </SafeAreaView>
  );
}
