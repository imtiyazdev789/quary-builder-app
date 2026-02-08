import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { shimmer } from '../utils/animations';

/**
 * SkeletonLoader - Animated skeleton loading placeholder
 * 
 * @param {Object} props
 * @param {number} props.width - Width of skeleton (default: '100%')
 * @param {number} props.height - Height of skeleton (default: 20)
 * @param {number} props.borderRadius - Border radius (default: 4)
 * @param {string} props.variant - Preset variant: 'text', 'title', 'card', 'circle', 'avatar'
 * @param {Object} props.style - Additional styles
 */
const SkeletonLoader = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
    variant = 'text',
    style
}) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        shimmer(shimmerAnim).start();
    }, [shimmerAnim]);

    // Variant presets
    const variants = {
        text: { width: '100%', height: 16, borderRadius: 4 },
        title: { width: '60%', height: 24, borderRadius: 4 },
        card: { width: '100%', height: 120, borderRadius: 8 },
        circle: { width: 40, height: 40, borderRadius: 20 },
        avatar: { width: 60, height: 60, borderRadius: 30 },
    };

    const variantStyle = variants[variant] || {};

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    return (
        <View
            style={[
                styles.skeleton,
                {
                    width: variantStyle.width || width,
                    height: variantStyle.height || height,
                    borderRadius: variantStyle.borderRadius || borderRadius,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX: shimmerTranslate }],
                    },
                ]}
            />
        </View>
    );
};

/**
 * SkeletonCard - Preset skeleton for card layouts
 */
export const SkeletonCard = () => (
    <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
            <SkeletonLoader variant="avatar" />
            <View style={styles.cardHeaderText}>
                <SkeletonLoader variant="title" style={{ marginBottom: 8 }} />
                <SkeletonLoader variant="text" width="80%" />
            </View>
        </View>
        <SkeletonLoader variant="card" style={{ marginTop: 12 }} />
        <View style={styles.cardFooter}>
            <SkeletonLoader width={80} height={14} />
            <SkeletonLoader width={60} height={14} />
        </View>
    </View>
);

/**
 * SkeletonList - Preset skeleton for list items
 */
export const SkeletonList = ({ count = 5 }) => (
    <>
        {Array.from({ length: count }).map((_, index) => (
            <View key={index} style={styles.listItem}>
                <SkeletonLoader variant="circle" />
                <View style={styles.listItemText}>
                    <SkeletonLoader variant="text" style={{ marginBottom: 8 }} />
                    <SkeletonLoader variant="text" width="70%" />
                </View>
            </View>
        ))}
    </>
);

/**
 * SkeletonProfile - Preset skeleton for profile screens
 */
export const SkeletonProfile = () => (
    <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
            <SkeletonLoader variant="avatar" width={100} height={100} borderRadius={50} />
            <SkeletonLoader variant="title" style={{ marginTop: 16 }} />
            <SkeletonLoader variant="text" width="50%" style={{ marginTop: 8 }} />
        </View>
        <View style={styles.profileBody}>
            <SkeletonLoader variant="text" style={{ marginBottom: 12 }} />
            <SkeletonLoader variant="text" style={{ marginBottom: 12 }} />
            <SkeletonLoader variant="text" width="80%" style={{ marginBottom: 12 }} />
            <SkeletonLoader variant="card" style={{ marginTop: 16 }} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E1E9EE',
        overflow: 'hidden',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    cardContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderText: {
        flex: 1,
        marginLeft: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E9EE',
    },
    listItemText: {
        flex: 1,
        marginLeft: 12,
    },
    profileContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E9EE',
    },
    profileBody: {
        padding: 16,
    },
});

export default SkeletonLoader;
