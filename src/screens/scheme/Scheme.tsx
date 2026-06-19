// src/screens/scheme/SchemeScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../../theme';
import type { ThemeColors, ThemeFonts, ThemeSizes, ThemeShadows } from '../../theme/types';

const { width } = Dimensions.get('window');

// ── Types ────────────────────────────────────────────────────────
interface SchemeItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  returnRate: string;
  minInvestment: string;
  maxInvestment: string;
  status?: 'active' | 'completed' | 'pending';
  nextInstallment?: string;
  totalInvested?: string;
  totalReturns?: string;
  installmentsPaid?: number;
  totalInstallments?: number;
  termsAndConditions?: string[];
}

interface ExpandableCardProps {
  item: SchemeItem;
  isMyScheme: boolean;
  onActionPress: (item: SchemeItem) => void;
}

// ── Mock Data ──────────────────────────────────────────────────
const ALL_SCHEMES: SchemeItem[] = [
  {
    id: '1',
    title: 'Gold Savings Plan',
    description: 'Invest in gold with flexible monthly savings. Get returns based on gold price appreciation.',
    duration: '12 Months',
    returnRate: '12-15%',
    minInvestment: '₹5,000',
    maxInvestment: '₹50,000',
    termsAndConditions: [
      'Minimum investment of ₹5,000 required',
      'Lock-in period of 6 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
  {
    id: '2',
    title: 'Silver Investment Scheme',
    description: 'Secure your future with silver investments. Perfect for long-term wealth building.',
    duration: '24 Months',
    returnRate: '10-12%',
    minInvestment: '₹2,500',
    maxInvestment: '₹25,000',
    termsAndConditions: [
      'Minimum investment of ₹2,500 required',
      'Lock-in period of 12 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
  {
    id: '3',
    title: 'Platinum Plus Plan',
    description: 'Premium investment plan with higher returns. Limited slots available.',
    duration: '36 Months',
    returnRate: '18-22%',
    minInvestment: '₹10,000',
    maxInvestment: '₹1,00,000',
    termsAndConditions: [
      'Minimum investment of ₹10,000 required',
      'Lock-in period of 24 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
  {
    id: '4',
    title: 'Diamond Savings Scheme',
    description: 'Exclusive diamond-backed investment with guaranteed returns.',
    duration: '18 Months',
    returnRate: '15-18%',
    minInvestment: '₹7,500',
    maxInvestment: '₹75,000',
    termsAndConditions: [
      'Minimum investment of ₹7,500 required',
      'Lock-in period of 12 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
];

const MY_SCHEMES: SchemeItem[] = [
  {
    id: '1',
    title: 'Gold Savings Plan',
    description: 'Invest in gold with flexible monthly savings. Get returns based on gold price appreciation.',
    duration: '12 Months',
    returnRate: '12-15%',
    minInvestment: '₹5,000',
    maxInvestment: '₹50,000',
    status: 'active',
    nextInstallment: '2026-07-15',
    totalInvested: '₹45,000',
    totalReturns: '₹54,000',
    installmentsPaid: 9,
    totalInstallments: 12,
    termsAndConditions: [
      'Minimum investment of ₹5,000 required',
      'Lock-in period of 6 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
  {
    id: '3',
    title: 'Platinum Plus Plan',
    description: 'Premium investment plan with higher returns. Limited slots available.',
    duration: '36 Months',
    returnRate: '18-22%',
    minInvestment: '₹10,000',
    maxInvestment: '₹1,00,000',
    status: 'pending',
    nextInstallment: '2026-07-20',
    totalInvested: '₹30,000',
    totalReturns: '₹36,000',
    installmentsPaid: 3,
    totalInstallments: 36,
    termsAndConditions: [
      'Minimum investment of ₹10,000 required',
      'Lock-in period of 24 months',
      'Returns are subject to market conditions',
      'Early withdrawal subject to penalty',
      'KYC compliance required',
      'Terms and conditions apply',
    ],
  },
];

// ── Terms & Conditions Modal ──────────────────────────────────
interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  schemeName: string;
  terms: string[];
}

const TermsModal: React.FC<TermsModalProps> = ({
  visible,
  onClose,
  onAccept,
  schemeName,
  terms,
}) => {
  const theme = useTheme();
  const { COLORS, FONTS, SIZES, moderateScale, verticalScale } = theme;
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
    setTimeout(() => {
      setAccepted(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: COLORS.overlayDark }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <View style={[
          styles.modalContent,
          {
            backgroundColor: COLORS.white,
            borderTopLeftRadius: SIZES.radius.xxl,
            borderTopRightRadius: SIZES.radius.xxl,
          }
        ]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: COLORS.borderLight }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { 
              color: COLORS.textPrimary,
              fontFamily: FONTS.family.semiBold,
              fontSize: SIZES.font.xl,
            }]}>
              Terms & Conditions
            </Text>
            <Text style={[styles.modalSubtitle, {
              color: COLORS.textSecondary,
              fontFamily: FONTS.family.regular,
              fontSize: SIZES.font.sm,
            }]}>
              {schemeName}
            </Text>
          </View>

          {/* Terms List */}
          <ScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalBodyContent}
          >
            {terms.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <View style={[styles.termBullet, { backgroundColor: COLORS.primary }]} />
                <Text style={[styles.termText, {
                  color: COLORS.textSecondary,
                  fontFamily: FONTS.family.regular,
                  fontSize: SIZES.font.md,
                }]}>
                  {term}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Fixed Bottom Buttons */}
          <View style={[
            styles.modalFooter,
            {
              borderTopColor: COLORS.borderLight,
              backgroundColor: COLORS.white,
            }
          ]}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: COLORS.borderMedium }]}
              onPress={onClose}
            >
              <Text style={[styles.modalCancelText, {
                color: COLORS.textSecondary,
                fontFamily: FONTS.family.medium,
              }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalAcceptButton, { backgroundColor: COLORS.primary }]}
              onPress={handleAccept}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={[styles.modalAcceptText, {
                color: COLORS.white,
                fontFamily: FONTS.family.semiBold,
              }]}>
                Accept & Join
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ── Expandable Card Component ──────────────────────────────────
const ExpandableSchemeCard: React.FC<ExpandableCardProps> = ({ 
  item, 
  isMyScheme,
  onActionPress,
}) => {
  const theme = useTheme();
  const { COLORS, moderateScale, verticalScale, FONTS, SIZES, SHADOWS } = theme;
  
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: expanded ? 1 : 0,
      useNativeDriver: false,
      damping: 12,
      stiffness: 100,
    }).start();
  }, [expanded, animation]);

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleExpand = () => setExpanded(!expanded);

  const getStatusColor = (status?: string): string => {
    switch(status) {
      case 'active': return COLORS.success;
      case 'completed': return COLORS.goldPrimary;
      case 'pending': return COLORS.warning;
      default: return COLORS.textTertiary;
    }
  };

  const getStatusLabel = (status?: string): string => {
    switch(status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return '';
    }
  };

  const getStatusIcon = (status?: string): keyof typeof Ionicons.glyphMap => {
    switch(status) {
      case 'active': return 'checkmark-circle';
      case 'completed': return 'checkmark-done-circle';
      case 'pending': return 'time-outline';
      default: return 'ellipse-outline';
    }
  };

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderLight,
        ...SHADOWS.sm,
      },
    ]}>
      {/* Card Header */}
      <TouchableOpacity 
        onPress={toggleExpand} 
        activeOpacity={0.7}
        style={styles.cardHeader}
      >
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '10' }]}>
            <Ionicons name="diamond-outline" size={moderateScale(20)} color={COLORS.primary} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardTitle, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
              {item.title}
            </Text>
            {isMyScheme && item.status && (
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Ionicons name={getStatusIcon(item.status)} size={12} color={getStatusColor(item.status)} />
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Ionicons name="chevron-down" size={moderateScale(24)} color={COLORS.textTertiary} />
        </Animated.View>
      </TouchableOpacity>

      {/* Card Content - Always Visible */}
      <View style={styles.cardContent}>
        <Text style={[styles.description, { color: COLORS.textSecondary, fontFamily: FONTS.family.regular }]}>
          {item.description}
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
              Duration
            </Text>
            <Text style={[styles.statValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
              {item.duration}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
              Returns
            </Text>
            <Text style={[styles.statValue, { color: COLORS.primary, fontFamily: FONTS.family.semiBold }]}>
              {item.returnRate}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
              Investment
            </Text>
            <Text style={[styles.statValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
              {item.minInvestment}
            </Text>
          </View>
        </View>
      </View>

      {/* Expandable Content */}
      <Animated.View style={[styles.expandableContent, { maxHeight }]}>
        {expanded && (
          <View style={styles.expandedDetails}>
            {isMyScheme ? (
              // My Scheme Details
              <>
                <View style={[styles.divider, { backgroundColor: COLORS.borderLight }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                    Total Invested
                  </Text>
                  <Text style={[styles.detailValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
                    {item.totalInvested}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                    Total Returns
                  </Text>
                  <Text style={[styles.detailValue, { color: COLORS.success, fontFamily: FONTS.family.semiBold }]}>
                    {item.totalReturns}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                    Installments
                  </Text>
                  <Text style={[styles.detailValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
                    {item.installmentsPaid}/{item.totalInstallments}
                  </Text>
                </View>
                {item.nextInstallment && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                      Next Installment
                    </Text>
                    <Text style={[styles.detailValue, { color: COLORS.primary, fontFamily: FONTS.family.semiBold }]}>
                      {item.nextInstallment}
                    </Text>
                  </View>
                )}
                
                {/* Progress Bar */}
                {item.totalInstallments && item.installmentsPaid && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={[styles.progressLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                        Progress
                      </Text>
                      <Text style={[styles.progressValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
                        {Math.round((item.installmentsPaid / item.totalInstallments) * 100)}%
                      </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: COLORS.borderLight }]}>
                      <View style={[
                        styles.progressFill, 
                        { 
                          width: `${(item.installmentsPaid / item.totalInstallments) * 100}%`,
                          backgroundColor: COLORS.primary 
                        }
                      ]} />
                    </View>
                  </View>
                )}
              </>
            ) : (
              // View All Scheme Details
              <>
                <View style={[styles.divider, { backgroundColor: COLORS.borderLight }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                    Max Investment
                  </Text>
                  <Text style={[styles.detailValue, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>
                    {item.maxInvestment}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                    Risk Level
                  </Text>
                  <Text style={[styles.detailValue, { color: COLORS.warning, fontFamily: FONTS.family.semiBold }]}>
                    Medium
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </Animated.View>

      {/* Action Button */}
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={() => onActionPress(item)}
        >
          <Ionicons 
            name={isMyScheme ? 'card-outline' : 'add-circle-outline'} 
            size={20} 
            color={COLORS.white} 
          />
          <Text style={[styles.actionButtonText, { color: COLORS.white, fontFamily: FONTS.family.semiBold }]}>
            {isMyScheme ? 'Pay Installment' : 'Join Scheme'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ── Main Screen ──────────────────────────────────────────────────
const SchemeScreen: React.FC = () => {
  const theme = useTheme();
  const { COLORS, moderateScale, verticalScale, FONTS, SIZES, SHADOWS } = theme;
  
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('my'); // Default to 'my'
  const [schemes, setSchemes] = useState<SchemeItem[]>(MY_SCHEMES); // Start with MY_SCHEMES
  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    setSchemes(activeTab === 'all' ? ALL_SCHEMES : MY_SCHEMES);
  }, [activeTab]);

  const handleActionPress = (item: SchemeItem) => {
    if (activeTab === 'all') {
      // Show Terms & Conditions for joining scheme
      setSelectedScheme(item);
      setShowTermsModal(true);
    } else {
      // Pay Installment action
      console.log('Pay Installment:', item.title);
    }
  };

  const handleAcceptTerms = () => {
    if (selectedScheme) {
      console.log('Accepted terms for:', selectedScheme.title);
      // Navigate to payment/join flow
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.background }]}>
        <View>
          <Text style={[styles.headerTitle, { 
            color: COLORS.textPrimary, 
            fontFamily: FONTS.family.bold 
          }]}>
            Schemes
          </Text>
          <Text style={[styles.headerSubtitle, { 
            color: COLORS.textSecondary, 
            fontFamily: FONTS.family.regular 
          }]}>
            {activeTab === 'all' ? 'Browse all investment schemes' : 'Track your active schemes'}
          </Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: COLORS.background }]}>
        <View style={[styles.tabWrapper, { backgroundColor: COLORS.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'all' && [styles.activeTab, { backgroundColor: COLORS.primary }]
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Ionicons 
              name={activeTab === 'all' ? 'grid' : 'grid-outline'} 
              size={16} 
              color={activeTab === 'all' ? COLORS.white : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { fontFamily: FONTS.family.medium },
              activeTab === 'all' && { color: COLORS.white }
            ]}>
              View All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'my' && [styles.activeTab, { backgroundColor: COLORS.primary }]
            ]}
            onPress={() => setActiveTab('my')}
          >
            <Ionicons 
              name={activeTab === 'my' ? 'folder' : 'folder-outline'} 
              size={16} 
              color={activeTab === 'my' ? COLORS.white : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              { fontFamily: FONTS.family.medium },
              activeTab === 'my' && { color: COLORS.white }
            ]}>
              My Schemes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scheme List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {schemes.map((item) => (
          <ExpandableSchemeCard
            key={item.id}
            item={item}
            isMyScheme={activeTab === 'my'}
            onActionPress={handleActionPress}
          />
        ))}
      </ScrollView>

      {/* Terms & Conditions Modal */}
      {selectedScheme && (
        <TermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={handleAcceptTerms}
          schemeName={selectedScheme.title}
          terms={selectedScheme.termsAndConditions || ['Terms and conditions apply']}
        />
      )}
    </SafeAreaView>
  );
};

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tabWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    height: 44,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 36,
    gap: 6,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: '#6B5740',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
    alignSelf: 'flex-start',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
  },
  expandableContent: {
    overflow: 'hidden',
  },
  expandedDetails: {
    paddingTop: 12,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4C5A9',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  termBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  termText: {
    flex: 1,
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 16,
  },
  modalAcceptButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalAcceptText: {
    fontSize: 16,
  },
});

export default SchemeScreen;