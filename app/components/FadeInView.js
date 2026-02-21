import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { fadeIn, DURATIONS } from '../utils/animations';

/**
 * FadeInView - A reusable component that fades in its children on mount
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to fade in
 * @param {number} props.duration - Animation duration in ms (default: 300)
 * @param {number} props.delay - Delay before animation starts in ms (default: 0)
 * @param {Object} props.style - Additional styles to apply
 */
const FadeInView = ({ children, duration = DURATIONS.NORMAL, delay = 0, style }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeIn(fadeAnim, duration, delay).start();
    }, [fadeAnim, duration, delay]);

    return (
        <Animated.View
            style={{
                ...style,
                opacity: fadeAnim,
            }}
        >
            {children}
        </Animated.View>
    );
};

export default FadeInView;
