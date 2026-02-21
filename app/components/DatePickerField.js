import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import ErrorText from './ErrorText';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';

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
                <Text className="text-sm font-semibold text-secondary-800 mb-2 ml-1">
                    {label} {required && <Text className="text-error-500">*</Text>}
                </Text>
            )}
            <TouchableOpacity
                className={`border rounded-2xl px-4 py-4 flex-row items-center justify-between ${error ? 'border-error-500' : 'border-secondary-200'
                    } bg-white shadow-sm`}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
            >
                <Text className={value ? 'text-secondary-900 text-base font-medium' : 'text-secondary-400 text-base'}>
                    {value ? formatDisplayDate(value) : placeholder}
                </Text>
                <Icon name={IconNames.calendar} size="md" color={theme.colors.primary[600]} />
            </TouchableOpacity>
            <ErrorText error={error} />

            {/* Date Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-[32px] overflow-hidden">
                        {/* Header */}
                        <View className="px-6 py-5 border-b border-secondary-100 flex-row justify-between items-center">
                            <TouchableOpacity onPress={handleCancel} className="py-2 px-1">
                                <Text className="text-secondary-500 text-base font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <Text className="text-lg font-bold text-secondary-900">Select Date</Text>
                            <TouchableOpacity onPress={handleConfirm} className="py-2 px-1">
                                <Text className="text-primary-600 font-bold text-base">Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="max-h-[500px]" showsVerticalScrollIndicator={false} bounces={false}>
                            <View className="p-6">
                                {/* Year Selector */}
                                <View className="mb-6">
                                    <View className="flex-row items-center mb-3">
                                        <Icon name={IconNames.time} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text className="text-sm font-bold text-secondary-700 uppercase tracking-wider">Year</Text>
                                    </View>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ gap: 10 }}
                                        bounces={true}
                                    >
                                        {years.map((year) => (
                                            <TouchableOpacity
                                                key={year}
                                                className={`py-3 px-6 rounded-2xl border ${selectedYear === year
                                                    ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-200'
                                                    : 'bg-secondary-50 border-secondary-100'
                                                    }`}
                                                onPress={() => setSelectedYear(year)}
                                            >
                                                <Text className={`font-bold ${selectedYear === year ? 'text-white' : 'text-secondary-700'}`}>
                                                    {year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Month Selector */}
                                <View className="mb-6">
                                    <View className="flex-row items-center mb-3">
                                        <Icon name={IconNames.calendar} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text className="text-sm font-bold text-secondary-700 uppercase tracking-wider">Month</Text>
                                    </View>
                                    <View className="flex-row flex-wrap gap-2.5">
                                        {months.map((month) => (
                                            <TouchableOpacity
                                                key={month.key}
                                                className={`py-2.5 px-4 rounded-xl border ${selectedMonth === month.key
                                                    ? 'bg-primary-600 border-primary-600 shadow-sm'
                                                    : 'bg-secondary-50 border-secondary-100'
                                                    }`}
                                                onPress={() => setSelectedMonth(month.key)}
                                            >
                                                <Text className={`text-sm font-bold ${selectedMonth === month.key ? 'text-white' : 'text-secondary-700'}`}>
                                                    {month.label.slice(0, 3)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Day Selector */}
                                <View className="mb-8">
                                    <View className="flex-row items-center mb-3">
                                        <Icon name={IconNames.today} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text className="text-sm font-bold text-secondary-700 uppercase tracking-wider">Day</Text>
                                    </View>
                                    <View className="flex-row flex-wrap gap-2.5">
                                        {days.map((day) => (
                                            <TouchableOpacity
                                                key={day}
                                                className={`w-11 h-11 rounded-2xl border items-center justify-center ${selectedDay === day
                                                    ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-200'
                                                    : 'bg-secondary-50 border-secondary-100'
                                                    }`}
                                                onPress={() => setSelectedDay(day)}
                                            >
                                                <Text className={`font-bold ${selectedDay === day ? 'text-white' : 'text-secondary-700'}`}>
                                                    {day}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Selected Date Preview */}
                                <View className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                                    <Text className="text-xs text-primary-600 font-bold uppercase text-center mb-1 tracking-widest">Selected Date</Text>
                                    <Text className="text-center text-primary-900 font-extrabold text-xl">
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
