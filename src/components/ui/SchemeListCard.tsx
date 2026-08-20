import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IMAGE_BASE_URL } from '@env';

import { useTheme } from '../../theme';
import { ApiScheme, METAL_COLOR } from '../../types/Scheme/Scheme';

export default function SchemeListCard({
  item,
  onJoin,
  width,
}: {
  item: ApiScheme;
  onJoin: (s: ApiScheme) => void;
  width?: number;
}) {
  const { COLORS, FONTS, SHADOWS } = useTheme();
  const [imgError, setImgError] = useState(false);
  const mColor  = METAL_COLOR[item.MetalType] ?? COLORS.brand;
  const canJoin = item.ADDNEWMEMBER === 'Y';

  return (
    <View style={[styles.card, { backgroundColor: COLORS.white, borderColor: COLORS.borderSubtle, ...SHADOWS.sm }, width ? { width } : null]}>

      {/* Image / fallback */}
      {item.image_path && !imgError ? (
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.image_path}` }}
          style={styles.banner}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={[styles.bannerFallback, { backgroundColor: mColor + '18' }]}>
          <Ionicons name="diamond-outline" size={40} color={mColor} />
          <Text style={[styles.bannerFallbackText, { color: mColor, fontFamily: FONTS.family.semiBold }]}>
            {item.schemeName}
          </Text>
        </View>
      )}

      {/* Join button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: canJoin ? COLORS.brand : COLORS.borderSubtle }]}
          onPress={() => canJoin && onJoin(item)}
          disabled={!canJoin}
          activeOpacity={0.85}
        >
          <Ionicons
            name={canJoin ? 'add-circle-outline' : 'lock-closed-outline'}
            size={20}
            color={canJoin ? COLORS.white : COLORS.contentMuted}
          />
          <Text style={[styles.btnText, { color: canJoin ? COLORS.white : COLORS.contentMuted, fontFamily: FONTS.family.semiBold }]}>
            {canJoin ? 'Join Scheme' : 'Enrolment Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:              { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  banner:            { width: '100%', height: 200 },
  bannerFallback:    { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center', gap: 10 },
  bannerFallbackText:{ fontSize: 15, letterSpacing: 0.5 },
  footer:            { padding: 12 },
  btn:               { flexDirection: 'row', paddingVertical: 13, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText:           { fontSize: 14 },
});
