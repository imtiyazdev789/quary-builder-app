import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * SafeAreaWrapper Component
 * 
 * A reusable wrapper component that handles safe area insets.
 * Use this to wrap screens that need to respect the StatusBar and device notches.
 * 
 * @param {Object} props
 * @param {string} props.className - Tailwind classes for styling
 * @param {Array} props.edges - Edges to apply safe area (default: ['top', 'bottom'])
 * @param {React.ReactNode} props.children - Child components
 */
const SafeAreaWrapper = ({ 
  children, 
  className = 'flex-1 bg-white', 
  edges = ['top', 'bottom'] 
}) => {
  return (
    <SafeAreaView className={className} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;

