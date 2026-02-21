import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ErrorText from './ErrorText';
import Icon, { IconNames } from './Icon';
import theme from '../config/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
        if (value && value.includes('-')) {
            const parsed = parseInt(value.split('-')[0]);
            if (!isNaN(parsed)) return parsed;
        }
        return maximumDate ? maximumDate.getFullYear() : new Date().getFullYear();
    });
    const [selectedMonth, setSelectedMonth] = useState(() => {
        if (value && value.includes('-')) {
            const parsed = parseInt(value.split('-')[1]);
            if (!isNaN(parsed)) return parsed;
        }
        return (maximumDate ? maximumDate.getMonth() : new Date().getMonth()) + 1;
    });
    const [selectedDay, setSelectedDay] = useState(() => {
        if (value && value.includes('-')) {
            const parsed = parseInt(value.split('-')[2]);
            if (!isNaN(parsed)) return parsed;
        }
        return maximumDate ? maximumDate.getDate() : new Date().getDate();
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

    const currentYear = new Date().getFullYear();
    const minYear = minimumDate ? minimumDate.getFullYear() : 1950;
    const maxYear = maximumDate ? maximumDate.getFullYear() : currentYear;
    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y);
    }

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

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
        onChange(`${selectedYear}-${formattedMonth}-${formattedDay}`);
        setShowPicker(false);
    };

    const handleCancel = () => {
        // Reset selection to the currently committed value
        if (value && value.includes('-')) {
            const parts = value.split('-');
            if (parts.length === 3) {
                const y = parseInt(parts[0]);
                const m = parseInt(parts[1]);
                const d = parseInt(parts[2]);
                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    setSelectedYear(y);
                    setSelectedMonth(m);
                    setSelectedDay(d);
                }
            }
        }
        setShowPicker(false);
    };

    // All bound-checking is done directly in the handler — no useEffect needed
    const handleYearSelect = (year) => {
        let updatedMonth = selectedMonth;
        let updatedDay = selectedDay;

        if (maximumDate && year === maximumDate.getFullYear() && updatedMonth > (maximumDate.getMonth() + 1)) {
            updatedMonth = maximumDate.getMonth() + 1;
        }
        if (minimumDate && year === minimumDate.getFullYear() && updatedMonth < (minimumDate.getMonth() + 1)) {
            updatedMonth = minimumDate.getMonth() + 1;
        }

        const maxDays = getDaysInMonth(year, updatedMonth);
        if (updatedDay > maxDays) updatedDay = maxDays;

        if (maximumDate && year === maximumDate.getFullYear() && updatedMonth === (maximumDate.getMonth() + 1) && updatedDay > maximumDate.getDate()) {
            updatedDay = maximumDate.getDate();
        }
        if (minimumDate && year === minimumDate.getFullYear() && updatedMonth === (minimumDate.getMonth() + 1) && updatedDay < minimumDate.getDate()) {
            updatedDay = minimumDate.getDate();
        }

        setSelectedYear(year);
        setSelectedMonth(updatedMonth);
        setSelectedDay(updatedDay);
    };

    const handleMonthSelect = (monthKey) => {
        let updatedDay = selectedDay;
        const maxDays = getDaysInMonth(selectedYear, monthKey);

        if (updatedDay > maxDays) updatedDay = maxDays;

        if (maximumDate && selectedYear === maximumDate.getFullYear() && monthKey === (maximumDate.getMonth() + 1) && updatedDay > maximumDate.getDate()) {
            updatedDay = maximumDate.getDate();
        }
        if (minimumDate && selectedYear === minimumDate.getFullYear() && monthKey === (minimumDate.getMonth() + 1) && updatedDay < minimumDate.getDate()) {
            updatedDay = minimumDate.getDate();
        }

        setSelectedMonth(monthKey);
        setSelectedDay(updatedDay);
    };

    const handleDaySelect = (day) => setSelectedDay(day);

    const isMonthDisabled = (monthKey) => {
        if (maximumDate && selectedYear === maximumDate.getFullYear() && monthKey > (maximumDate.getMonth() + 1)) return true;
        if (minimumDate && selectedYear === minimumDate.getFullYear() && monthKey < (minimumDate.getMonth() + 1)) return true;
        return false;
    };

    const isDayDisabled = (day) => {
        if (maximumDate && selectedYear === maximumDate.getFullYear() && selectedMonth === (maximumDate.getMonth() + 1) && day > maximumDate.getDate()) return true;
        if (minimumDate && selectedYear === minimumDate.getFullYear() && selectedMonth === (minimumDate.getMonth() + 1) && day < minimumDate.getDate()) return true;
        return false;
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}{required ? <Text style={styles.required}> *</Text> : null}
                </Text>
            )}
            <TouchableOpacity
                style={[styles.trigger, error ? styles.triggerError : styles.triggerNormal]}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
            >
                <Text style={value ? styles.triggerTextValue : styles.triggerTextPlaceholder}>
                    {value ? formatDisplayDate(value) : placeholder}
                </Text>
                <Icon name={IconNames.calendar} size="md" color={theme.colors.primary[600]} />
            </TouchableOpacity>
            <ErrorText error={error} />

            {/* Modal is safe here — the crash was caused by useEffect cascades + NotificationProvider
                placement, both of which are now fixed. Modal renders above everything correctly. */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={handleCancel}
                statusBarTranslucent
            >
                <View style={styles.modalBackdrop}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFillObject}
                        activeOpacity={1}
                        onPress={handleCancel}
                    />
                    <View style={styles.sheet}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleCancel} style={styles.headerBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Select Date</Text>
                            <TouchableOpacity onPress={handleConfirm} style={styles.headerBtn}>
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            keyboardShouldPersistTaps="handled"
                            style={styles.scrollView}
                        >
                            <View style={styles.scrollContent}>
                                {/* Year */}
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Icon name={IconNames.time} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text style={styles.sectionLabel}>YEAR</Text>
                                    </View>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.rowGap}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        {years.map((year) => (
                                            <TouchableOpacity
                                                key={year}
                                                style={[styles.chip, selectedYear === year ? styles.chipActive : styles.chipInactive]}
                                                onPress={() => handleYearSelect(year)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[styles.chipText, selectedYear === year ? styles.chipTextActive : styles.chipTextInactive]}>
                                                    {year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Month */}
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Icon name={IconNames.calendar} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text style={styles.sectionLabel}>MONTH</Text>
                                    </View>
                                    <View style={styles.wrapRow}>
                                        {months.map((month) => {
                                            const disabled = isMonthDisabled(month.key);
                                            return (
                                                <TouchableOpacity
                                                    key={month.key}
                                                    disabled={disabled}
                                                    style={[
                                                        styles.monthChip,
                                                        selectedMonth === month.key ? styles.chipActive : (disabled ? styles.chipDisabled : styles.chipInactive),
                                                    ]}
                                                    onPress={() => handleMonthSelect(month.key)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={[styles.chipText, selectedMonth === month.key ? styles.chipTextActive : (disabled ? styles.chipTextDisabled : styles.chipTextInactive)]}>
                                                        {month.label.slice(0, 3)}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Day */}
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Icon name={IconNames.today} size="sm" color={theme.colors.secondary[400]} style={{ marginRight: 6 }} />
                                        <Text style={styles.sectionLabel}>DAY</Text>
                                    </View>
                                    <View style={styles.wrapRow}>
                                        {days.map((day) => {
                                            const disabled = isDayDisabled(day);
                                            return (
                                                <TouchableOpacity
                                                    key={day}
                                                    disabled={disabled}
                                                    style={[
                                                        styles.dayChip,
                                                        selectedDay === day ? styles.chipActive : (disabled ? styles.chipDisabled : styles.chipInactive),
                                                    ]}
                                                    onPress={() => handleDaySelect(day)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={[styles.chipText, selectedDay === day ? styles.chipTextActive : (disabled ? styles.chipTextDisabled : styles.chipTextInactive)]}>
                                                        {day}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Preview */}
                                <View style={styles.preview}>
                                    <Text style={styles.previewLabel}>SELECTED DATE</Text>
                                    <Text style={styles.previewDate}>
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

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
        marginLeft: 4,
    },
    required: {
        color: '#ef4444',
    },
    trigger: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
    },
    triggerNormal: {
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    triggerError: {
        borderWidth: 1.5,
        borderColor: '#ef4444',
    },
    triggerTextValue: {
        color: '#0f172a',
        fontSize: 16,
        fontWeight: '500',
    },
    triggerTextPlaceholder: {
        color: '#94a3b8',
        fontSize: 16,
    },

    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: 'hidden',
        maxHeight: SCREEN_HEIGHT * 0.78,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerBtn: {
        paddingVertical: 4,
        paddingHorizontal: 4,
        minWidth: 60,
    },
    cancelText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
    },
    doneText: {
        color: '#0d9488',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
    },
    scrollView: {
        flexGrow: 0,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 32,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    rowGap: {
        flexDirection: 'row',
        gap: 10,
    },
    wrapRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    // Chips
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    monthChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    dayChip: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: '#0d9488',
        borderColor: '#0d9488',
    },
    chipInactive: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
    },
    chipDisabled: {
        backgroundColor: '#f8fafc',
        borderColor: '#f1f5f9',
        opacity: 0.4,
    },
    chipText: {
        fontWeight: '700',
        fontSize: 14,
    },
    chipTextActive: { color: '#ffffff' },
    chipTextInactive: { color: '#334155' },
    chipTextDisabled: { color: '#94a3b8' },

    // Preview
    preview: {
        backgroundColor: '#f0fdfa',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccfbf1',
        alignItems: 'center',
        marginTop: 4,
    },
    previewLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0d9488',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    previewDate: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
});

export default DatePickerField;
