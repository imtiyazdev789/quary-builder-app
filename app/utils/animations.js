import { Animated, Easing } from 'react-native';

// ============================================
// TIMING CONSTANTS
// ============================================
export const DURATIONS = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
};

// ============================================
// EASING FUNCTIONS
// ============================================
export const EASINGS = {
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    spring: Easing.elastic(1),
    bounce: Easing.bounce,
};

// ============================================
// ANIMATION PRESETS
// ============================================

/**
 * Fade in animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Delay before animation starts in ms
 * @returns {Animated.CompositeAnimation}
 */
export const fadeIn = (animatedValue, duration = DURATIONS.NORMAL, delay = 0) => {
    return Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        easing: EASINGS.easeOut,
        useNativeDriver: true,
    });
};

/**
 * Fade out animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @returns {Animated.CompositeAnimation}
 */
export const fadeOut = (animatedValue, duration = DURATIONS.FAST) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        easing: EASINGS.easeIn,
        useNativeDriver: true,
    });
};

/**
 * Slide up animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Delay before animation starts in ms
 * @returns {Animated.CompositeAnimation}
 */
export const slideUp = (animatedValue, duration = DURATIONS.NORMAL, delay = 0) => {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        delay,
        easing: EASINGS.easeOut,
        useNativeDriver: true,
    });
};

/**
 * Slide down animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @returns {Animated.CompositeAnimation}
 */
export const slideDown = (animatedValue, duration = DURATIONS.NORMAL) => {
    return Animated.timing(animatedValue, {
        toValue: 100,
        duration,
        easing: EASINGS.easeIn,
        useNativeDriver: true,
    });
};

/**
 * Scale in animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Delay before animation starts in ms
 * @returns {Animated.CompositeAnimation}
 */
export const scaleIn = (animatedValue, duration = DURATIONS.NORMAL, delay = 0) => {
    return Animated.spring(animatedValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
    });
};

/**
 * Scale out animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} duration - Animation duration in ms
 * @returns {Animated.CompositeAnimation}
 */
export const scaleOut = (animatedValue, duration = DURATIONS.FAST) => {
    return Animated.timing(animatedValue, {
        toValue: 0.8,
        duration,
        easing: EASINGS.easeIn,
        useNativeDriver: true,
    });
};

/**
 * Bounce in animation
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @param {number} delay - Delay before animation starts in ms
 * @returns {Animated.CompositeAnimation}
 */
export const bounceIn = (animatedValue, delay = 0) => {
    return Animated.spring(animatedValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        delay,
        useNativeDriver: true,
    });
};

/**
 * Shake animation (for errors)
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @returns {Animated.CompositeAnimation}
 */
export const shake = (animatedValue) => {
    return Animated.sequence([
        Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]);
};

/**
 * Pulse animation (for loading states)
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @returns {Animated.CompositeAnimation}
 */
export const pulse = (animatedValue) => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 800,
                easing: EASINGS.easeInOut,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 800,
                easing: EASINGS.easeInOut,
                useNativeDriver: true,
            }),
        ])
    );
};

/**
 * Shimmer animation (for skeleton loaders)
 * @param {Animated.Value} animatedValue - The animated value to animate
 * @returns {Animated.CompositeAnimation}
 */
export const shimmer = (animatedValue) => {
    return Animated.loop(
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    );
};

// ============================================
// COMBINED ANIMATIONS
// ============================================

/**
 * Fade and scale in together
 * @param {Animated.Value} fadeValue - Opacity animated value
 * @param {Animated.Value} scaleValue - Scale animated value
 * @param {number} duration - Animation duration in ms
 * @param {number} delay - Delay before animation starts in ms
 * @returns {Animated.CompositeAnimation}
 */
export const fadeAndScaleIn = (fadeValue, scaleValue, duration = DURATIONS.NORMAL, delay = 0) => {
    return Animated.parallel([
        fadeIn(fadeValue, duration, delay),
        scaleIn(scaleValue, duration, delay),
    ]);
};

/**
 * Fade and scale out together
 * @param {Animated.Value} fadeValue - Opacity animated value
 * @param {Animated.Value} scaleValue - Scale animated value
 * @param {number} duration - Animation duration in ms
 * @returns {Animated.CompositeAnimation}
 */
export const fadeAndScaleOut = (fadeValue, scaleValue, duration = DURATIONS.FAST) => {
    return Animated.parallel([
        fadeOut(fadeValue, duration),
        scaleOut(scaleValue, duration),
    ]);
};

/**
 * Stagger animation for list items
 * @param {Array<Animated.Value>} animatedValues - Array of animated values
 * @param {number} staggerDelay - Delay between each item in ms
 * @param {Function} animationFn - Animation function to apply
 * @returns {Animated.CompositeAnimation}
 */
export const stagger = (animatedValues, staggerDelay = 50, animationFn = fadeIn) => {
    return Animated.stagger(
        staggerDelay,
        animatedValues.map((value, index) => animationFn(value, DURATIONS.NORMAL, index * staggerDelay))
    );
};
