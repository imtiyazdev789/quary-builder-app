# Theme Configuration Guide

This guide explains how to customize fonts and colors in the app.

## 📁 File Structure

- `app/config/theme.js` - Main theme configuration (colors, typography, spacing, etc.)
- `app/config/fonts.js` - Font loading and configuration
- `tailwind.config.js` - Tailwind CSS configuration that uses theme.js

## 🎨 Colors

### Using Colors in Components

#### Method 1: Using Tailwind Classes (Recommended)

```jsx
import { View, Text } from 'react-native';

// Primary colors
<View className="bg-primary-500">
  <Text className="text-primary-600">Hello</Text>
</View>

// Success colors
<View className="bg-success-500">
  <Text className="text-success-700">Success!</Text>
</View>

// Custom colors
<View className="bg-accent-400">
  <Text className="text-error-500">Error</Text>
</View>
```

#### Method 2: Using Theme Object Directly

```jsx
import { theme } from "../config/theme";

<View style={{ backgroundColor: theme.colors.primary[500] }}>
  <Text style={{ color: theme.colors.text.primary }}>Hello</Text>
</View>;
```

#### Method 3: Using Helper Function

```jsx
import { getColor } from "../config/theme";

<View style={{ backgroundColor: getColor("primary.500") }}>
  <Text style={{ color: getColor("text.primary") }}>Hello</Text>
</View>;
```

### Available Color Palettes

- **Primary**: Blue shades (main brand color)
- **Secondary**: Gray shades
- **Accent**: Purple shades
- **Success**: Green shades
- **Warning**: Yellow/Orange shades
- **Error**: Red shades
- **Neutral**: Black, white, and gray shades
- **Background**: Background colors
- **Text**: Text colors
- **Border**: Border colors

### Modifying Colors

Edit `app/config/theme.js` and update the color values:

```javascript
colors: {
  primary: {
    500: '#3b82f6', // Change this to your brand color
    // ... other shades
  },
}
```

After modifying, restart your development server to see changes.

## 🔤 Fonts

### Current Setup

The app currently uses system fonts (San Francisco on iOS, Roboto on Android).

### Adding Custom Fonts

1. **Add font files to `assets/fonts/` directory:**

   ```
   assets/
     fonts/
       YourFont-Regular.ttf
       YourFont-Bold.ttf
       YourFont-Medium.ttf
   ```

2. **Update `app/config/fonts.js`:**

   ```javascript
   import YourFontRegular from "../assets/fonts/YourFont-Regular.ttf";
   import YourFontBold from "../assets/fonts/YourFont-Bold.ttf";

   export const customFonts = {
     "YourFont-Regular": YourFontRegular,
     "YourFont-Bold": YourFontBold,
   };
   ```

3. **Update `app/config/theme.js`:**

   ```javascript
   fontFamily: {
     primary: ['YourFont-Regular', 'System'],
     primaryBold: ['YourFont-Bold', 'System'],
   },
   ```

4. **Update `tailwind.config.js`:**

   ```javascript
   fontFamily: {
     primary: theme.typography.fontFamily.primary,
     primaryBold: theme.typography.fontFamily.primaryBold,
   },
   ```

5. **Use in components:**
   ```jsx
   <Text className="font-primary text-lg">Hello</Text>
   <Text className="font-primaryBold text-xl">Bold Text</Text>
   ```

### Font Sizes

Available font sizes (defined in `theme.js`):

- `xs`: 12
- `sm`: 14
- `base`: 16
- `lg`: 18
- `xl`: 20
- `2xl`: 24
- `3xl`: 30
- `4xl`: 36
- `5xl`: 48
- `6xl`: 60

Usage:

```jsx
<Text className="text-sm">Small text</Text>
<Text className="text-xl">Large text</Text>
<Text className="text-3xl font-bold">Heading</Text>
```

## 📏 Spacing

Use spacing values in Tailwind classes:

```jsx
<View className="p-4">     {/* padding: 16px */}
<View className="m-8">      {/* margin: 24px */}
<View className="gap-2">    {/* gap: 8px */}
```

Available spacing values:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## 🎯 Border Radius

```jsx
<View className="rounded-md">   {/* 8px */}
<View className="rounded-lg">   {/* 12px */}
<View className="rounded-xl">  {/* 16px */}
<View className="rounded-full"> {/* 9999px */}
```

## 💡 Best Practices

1. **Use Tailwind classes** for most styling (faster, more maintainable)
2. **Use theme object** when you need dynamic values or calculations
3. **Keep colors consistent** - use the predefined color palette
4. **Test on both platforms** - iOS and Android may render fonts slightly differently
5. **Use semantic color names** - `text-primary` instead of `text-blue-500`

## 🔄 Updating Theme

1. Edit `app/config/theme.js`
2. Restart Metro bundler: `npm run start:clear`
3. Changes will be reflected throughout the app

## 📝 Example: Complete Component

```jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ExampleComponent = () => {
  return (
    <View className="flex-1 bg-background-light p-4">
      <Text className="text-2xl font-bold text-primary-600 mb-4">Welcome</Text>

      <Text className="text-base text-text-secondary mb-6">
        This is an example component using the theme system.
      </Text>

      <TouchableOpacity className="bg-primary-500 rounded-lg py-3 px-6">
        <Text className="text-white text-center font-semibold">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExampleComponent;
```

## 🆘 Troubleshooting

- **Colors not updating?** Clear cache: `npm run start:clear`
- **Fonts not loading?** Check font file paths in `fonts.js`
- **Tailwind classes not working?** Ensure `tailwind.config.js` is properly configured
