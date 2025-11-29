import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../config/theme';

/**
 * Example component demonstrating theme usage
 * This shows how to use colors and typography from the theme
 */
const ThemeExample = () => {
  return (
    <ScrollView className="flex-1 bg-background-light">
      <View className="p-4">
        {/* Primary Colors Example */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            Primary Colors
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <View
                key={shade}
                className="w-16 h-16 rounded-md items-center justify-center"
                style={{ backgroundColor: theme.colors.primary[shade] }}
              >
                <Text className="text-xs font-medium text-white">
                  {shade}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Typography Example */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            Typography
          </Text>
          <Text className="text-xs text-text-secondary mb-2">Extra Small (xs)</Text>
          <Text className="text-sm text-text-secondary mb-2">Small (sm)</Text>
          <Text className="text-base text-text-secondary mb-2">Base (base)</Text>
          <Text className="text-lg text-text-secondary mb-2">Large (lg)</Text>
          <Text className="text-xl text-text-secondary mb-2">Extra Large (xl)</Text>
          <Text className="text-2xl font-bold text-text-primary mb-2">2XL Bold</Text>
          <Text className="text-3xl font-bold text-primary-600 mb-2">3XL Primary</Text>
        </View>

        {/* Color Palette Examples */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            Color Palettes
          </Text>
          
          <View className="mb-4">
            <Text className="text-base font-semibold text-text-primary mb-2">
              Success Colors
            </Text>
            <View className="bg-success-100 p-3 rounded-lg">
              <Text className="text-success-700">Success message example</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-text-primary mb-2">
              Warning Colors
            </Text>
            <View className="bg-warning-100 p-3 rounded-lg">
              <Text className="text-warning-700">Warning message example</Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-text-primary mb-2">
              Error Colors
            </Text>
            <View className="bg-error-100 p-3 rounded-lg">
              <Text className="text-error-700">Error message example</Text>
            </View>
          </View>
        </View>

        {/* Button Examples */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            Button Styles
          </Text>
          
          <TouchableOpacity className="bg-primary-500 rounded-lg py-3 px-6 mb-3">
            <Text className="text-white text-center font-semibold">
              Primary Button
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-success-500 rounded-lg py-3 px-6 mb-3">
            <Text className="text-white text-center font-semibold">
              Success Button
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-error-500 rounded-lg py-3 px-6 mb-3">
            <Text className="text-white text-center font-semibold">
              Error Button
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-2 border-primary-500 rounded-lg py-3 px-6">
            <Text className="text-primary-600 text-center font-semibold">
              Outline Button
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacing Example */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            Spacing Scale
          </Text>
          <View className="bg-gray-200 p-2 rounded">
            <View className="bg-primary-500 mb-xs" style={{ height: 20, width: 20 }} />
            <View className="bg-primary-500 mb-sm" style={{ height: 20, width: 40 }} />
            <View className="bg-primary-500 mb-md" style={{ height: 20, width: 60 }} />
            <View className="bg-primary-500 mb-lg" style={{ height: 20, width: 80 }} />
            <View className="bg-primary-500" style={{ height: 20, width: 100 }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ThemeExample;

