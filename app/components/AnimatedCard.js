import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

/**
 * AnimatedCard Component
 * A reusable wrapper that adds press feedback animation to any card
 * 
 * @param {ReactNode} children - Card content
 * @param {function} onPress - Press handler
 * @param {string} className - Tailwind classes
 * @param {object} style - Additional styles
 * @param {number} activeOpacity - Opacity when pressed (default: 0.9)
 * @param {number} scaleValue - Scale when pressed (default: 0.98)
 */
const AnimatedCard = ({
    children,
    onPress,
    className = '',
    style = {},
    activeOpacity = 0.9,
    scaleValue = 0.98,
    ...props
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: scaleValue,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={activeOpacity}
            {...props}
        >
            <Animated.View
                className={className}
                style={[
                    style,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default AnimatedCard;
