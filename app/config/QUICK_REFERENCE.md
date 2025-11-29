# Theme Quick Reference

## 🎨 Quick Color Usage

```jsx
// Primary colors
className="bg-primary-500 text-primary-600"

// Success/Warning/Error
className="bg-success-500 text-success-700"
className="bg-warning-500 text-warning-700"
className="bg-error-500 text-error-700"

// Text colors
className="text-text-primary"      // Main text
className="text-text-secondary"     // Secondary text
className="text-text-tertiary"     // Tertiary text

// Background colors
className="bg-background-light"    // White
className="bg-background-dark"     // Dark
className="bg-background-gray"     // Gray
```

## 🔤 Quick Font Usage

```jsx
// Font sizes
className="text-xs"    // 12px
className="text-sm"    // 14px
className="text-base"  // 16px
className="text-lg"    // 18px
className="text-xl"    // 20px
className="text-2xl"   // 24px
className="text-3xl"   // 30px

// Font weights
className="font-normal"    // 400
className="font-medium"   // 500
className="font-semibold" // 600
className="font-bold"     // 700
```

## 📝 Common Patterns

```jsx
// Button
<TouchableOpacity className="bg-primary-500 rounded-lg py-3 px-6">
  <Text className="text-white text-center font-semibold">
    Button Text
  </Text>
</TouchableOpacity>

// Card
<View className="bg-white rounded-lg p-4 shadow-md">
  <Text className="text-xl font-bold text-text-primary mb-2">
    Card Title
  </Text>
  <Text className="text-base text-text-secondary">
    Card content
  </Text>
</View>

// Input
<TextInput className="border border-gray-300 rounded-lg px-4 py-3 text-base" />

// Badge
<View className="bg-success-100 rounded-full px-3 py-1">
  <Text className="text-success-700 text-sm font-medium">
    Success
  </Text>
</View>
```

## 🔧 Modifying Theme

1. **Change colors**: Edit `app/config/theme.js` → `colors` object
2. **Change fonts**: 
   - Add font files to `assets/fonts/`
   - Update `app/config/fonts.js`
   - Update `app/config/theme.js` → `typography.fontFamily`
3. **Restart**: `npm run start:clear`

