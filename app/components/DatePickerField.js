import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import ErrorText from './ErrorText';

/**
 * DatePickerField Component
 * A date picker with modal interface for selecting dates
 * 
 * @param {string} label - Label text for the field
 * @param {string} value - Current date value in YYYY-MM-DD format
 * @param {function} onChange - Callback when date changes (receives YYYY-MM-DD string)
 * @param {string} error - Error message to display
 * @param {string} placeholder - Placeholder text
 * @param {Date} minimumDate - Minimum selectable date
 * @param {Date} maximumDate - Maximum selectable date
 * @param {boolean} required - Show required indicator in label
 */
const DatePickerField = ({
    label,
    value,
    onChange,
    error,
    placeholder = 'Select date',
    minimumDate,
    maximumDate,
    required = false,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[0]);
        }
        return new Date().getFullYear();
    });
    const [selectedMonth, setSelectedMonth] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[1]);
        }
        return new Date().getMonth() + 1;
    });
    const [selectedDay, setSelectedDay] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[2]);
        }
        return new Date().getDate();
    });

    const months = [
        { key: 1, label: 'January' },
        { key: 2, label: 'February' },
        { key: 3, label: 'March' },
        { key: 4, label: 'April' },
        { key: 5, label: 'May' },
        { key: 6, label: 'June' },
        { key: 7, label: 'July' },
        { key: 8, label: 'August' },
        { key: 9, label: 'September' },
        { key: 10, label: 'October' },
        { key: 11, label: 'November' },
        { key: 12, label: 'December' },
    ];

    // Generate years from 1950 to current year
    const currentYear = new Date().getFullYear();
    const minYear = minimumDate ? minimumDate.getFullYear() : 1950;
    const maxYear = maximumDate ? maximumDate.getFullYear() : currentYear;
    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y);
    }

    // Get days in selected month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        const monthName = months.find(m => m.key === parseInt(month))?.label || '';
        return `${parseInt(day)} ${monthName} ${year}`;
    };

    const handleConfirm = () => {
        const formattedMonth = selectedMonth.toString().padStart(2, '0');
        const formattedDay = selectedDay.toString().padStart(2, '0');
        const dateStr = `${selectedYear}-${formattedMonth}-${formattedDay}`;
        onChange(dateStr);
        setShowPicker(false);
    };

    const handleCancel = () => {
        // Reset to current value
        if (value) {
            setSelectedYear(parseInt(value.split('-')[0]));
            setSelectedMonth(parseInt(value.split('-')[1]));
            setSelectedDay(parseInt(value.split('-')[2]));
        }
        setShowPicker(false);
    };

    // Adjust day if it exceeds days in new month
    React.useEffect(() => {
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth);
        }
    }, [selectedMonth, selectedYear, daysInMonth]);

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-sm font-medium text-secondary-800 mb-2">
                    {label} {required && <Text className="text-error-500">*</Text>}
                </Text>
            )}
            <TouchableOpacity
                className={`border rounded-xl px-4 py-3 flex-row items-center justify-between ${error ? 'border-error-500' : 'border-secondary-200'
                    } bg-white`}
                onPress={() => setShowPicker(true)}
            >
                <Text className={value ? 'text-secondary-900 text-base' : 'text-secondary-400 text-base'}>
                    {value ? formatDisplayDate(value) : placeholder}
                </Text>
                <Text className="text-xl">📅</Text>
            </TouchableOpacity>
            <ErrorText error={error} />

            {/* Date Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl max-h-[80%]">
                        {/* Header */}
                        <View className="flex-row justify-between items-center px-6 py-4 border-b border-secondary-100">
                            <TouchableOpacity onPress={handleCancel}>
                                <Text className="text-secondary-500 text-base">Cancel</Text>
                            </TouchableOpacity>
                            <Text className="text-lg font-semibold text-secondary-900">Select Date</Text>
                            <TouchableOpacity onPress={handleConfirm}>
                                <Text className="text-primary-600 font-semibold text-base">Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
                            {/* Year Selector */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-secondary-600 mb-2">Year</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 8 }}
                                >
                                    {years.map((year) => (
                                        <TouchableOpacity
                                            key={year}
                                            className={`py-2 px-4 rounded-lg border ${selectedYear === year
                                                ? 'bg-primary-600 border-primary-600'
                                                : 'bg-white border-secondary-200'
                                                }`}
                                            onPress={() => setSelectedYear(year)}
                                        >
                                            <Text className={selectedYear === year ? 'text-white' : 'text-secondary-700'}>
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Month Selector */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-secondary-600 mb-2">Month</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {months.map((month) => (
                                        <TouchableOpacity
                                            key={month.key}
                                            className={`py-2 px-3 rounded-lg border ${selectedMonth === month.key
                                                ? 'bg-primary-600 border-primary-600'
                                                : 'bg-white border-secondary-200'
                                                }`}
                                            onPress={() => setSelectedMonth(month.key)}
                                        >
                                            <Text className={`text-sm ${selectedMonth === month.key ? 'text-white' : 'text-secondary-700'}`}>
                                                {month.label.slice(0, 3)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Day Selector */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-secondary-600 mb-2">Day</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {days.map((day) => (
                                        <TouchableOpacity
                                            key={day}
                                            className={`w-10 h-10 rounded-lg border items-center justify-center ${selectedDay === day
                                                ? 'bg-primary-600 border-primary-600'
                                                : 'bg-white border-secondary-200'
                                                }`}
                                            onPress={() => setSelectedDay(day)}
                                        >
                                            <Text className={selectedDay === day ? 'text-white' : 'text-secondary-700'}>
                                                {day}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Selected Date Preview */}
                            <View className="pb-6 pt-2">
                                <View className="bg-primary-50 rounded-xl p-4">
                                    <Text className="text-center text-primary-700 font-semibold text-lg">
                                        {formatDisplayDate(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`)}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePickerField;
