// src/components/ui/AppContentHtml.tsx
//
// Renders an HTML string (as returned by GET /api/v1/app-content/{id}) inside
// a WebView, with loading / error / empty states. Used for scheme Terms &
// Conditions (id = SchemeId) and the FAQ page (id = "FAQ").

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';

interface Props {
  html: string;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  minHeight?: number;
}

// Wrap the raw HTML fragment with a responsive viewport + base styling so it
// reads well inside the app without any extra work from whoever authored it.
const wrapHtml = (bodyHtml: string, textColor: string, bgColor: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 16px;
        color: ${textColor};
        background-color: ${bgColor};
        font-family: -apple-system, Roboto, sans-serif;
        font-size: 15px;
        line-height: 1.6;
      }
      img { max-width: 100%; height: auto; }
      a { color: #C9A84C; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 6px; border: 1px solid rgba(128,128,128,0.3); }
    </style>
  </head>
  <body>${bodyHtml}</body>
</html>`;

export default function AppContentHtml({ html, loading, error, onRetry, minHeight = 300 }: Props) {
  const { COLORS } = useTheme();

  if (loading) {
    return (
      <View style={[styles.center, { minHeight }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { minHeight }]}>
        <Ionicons name="alert-circle-outline" size={32} color={COLORS.textTertiary} />
        <Text style={[styles.msg, { color: COLORS.textSecondary }]}>{error}</Text>
      </View>
    );
  }

  if (!html || !html.trim()) {
    return (
      <View style={[styles.center, { minHeight }]}>
        <Ionicons name="document-outline" size={32} color={COLORS.textTertiary} />
        <Text style={[styles.msg, { color: COLORS.textSecondary }]}>No content available.</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ html: wrapHtml(html, COLORS.textPrimary, COLORS.background) }}
      style={{ flex: 1, backgroundColor: 'transparent' }}
      originWhitelist={['*']}
    />
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  msg:    { fontSize: 13, textAlign: 'center' },
});
