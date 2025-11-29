import { View, Text } from 'react-native';

const ExampleCard = ({ title, description }) => {
    return (
        <View className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <Text className="text-xl font-bold text-gray-900 mb-2">
                {title}
            </Text>
            <Text className="text-base text-gray-600">
                {description}
            </Text>
        </View>
    );
};

export default ExampleCard;

