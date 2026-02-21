import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import theme from '../config/theme';

/**
 * Icon Component
 * Wrapper around Ionicons for consistent icon usage throughout the app
 * 
 * @param {string} name - Icon name from Ionicons
 * @param {number|string} size - Icon size (xs, sm, md, lg, xl, xxl or number)
 * @param {string} color - Icon color (hex or theme color path)
 * @param {object} style - Additional styles
 */
const Icon = ({ name, size = 'md', color = theme.colors.text.primary, style, ...props }) => {
    // Convert size string to number
    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        xxl: 48,
    };

    const iconSize = typeof size === 'number' ? size : iconSizes[size] || iconSizes.md;

    return (
        <Ionicons
            name={name}
            size={iconSize}
            color={color}
            style={style}
            {...props}
        />
    );
};

export default Icon;

// Common icon names for easy reference
export const IconNames = {
    // User & Profile
    person: 'person-outline',
    personCircle: 'person-circle-outline',
    people: 'people-outline',

    // Communication
    mail: 'mail-outline',
    chatbubble: 'chatbubble-outline',
    call: 'call-outline',
    notifications: 'notifications-outline',

    // Navigation
    home: 'home-outline',
    search: 'search-outline',
    menu: 'menu-outline',
    close: 'close-outline',
    arrowBack: 'arrow-back-outline',
    arrowForward: 'arrow-forward-outline',
    chevronBack: 'chevron-back-outline',
    chevronForward: 'chevron-forward-outline',
    chevronDown: 'chevron-down-outline',
    chevronUp: 'chevron-up-outline',

    // Actions
    add: 'add-outline',
    remove: 'remove-outline',
    create: 'create-outline',
    trash: 'trash-outline',
    save: 'save-outline',
    share: 'share-outline',
    download: 'download-outline',
    upload: 'cloud-upload-outline',

    // Status
    checkmark: 'checkmark-outline',
    checkmarkCircle: 'checkmark-circle-outline',
    closeCircle: 'close-circle-outline',
    alert: 'alert-circle-outline',
    information: 'information-circle-outline',
    warning: 'warning-outline',

    // Security
    lock: 'lock-closed-outline',
    lockOpen: 'lock-open-outline',
    eye: 'eye-outline',
    eyeOff: 'eye-off-outline',
    shield: 'shield-checkmark-outline',

    // Location
    location: 'location-outline',
    map: 'map-outline',
    navigate: 'navigate-outline',

    // Settings
    settings: 'settings-outline',
    options: 'ellipsis-horizontal-outline',
    optionsVertical: 'ellipsis-vertical-outline',
    filter: 'filter-outline',

    // Media
    image: 'image-outline',
    images: 'images-outline',
    camera: 'camera-outline',
    videocam: 'videocam-outline',
    document: 'document-outline',
    documentText: 'document-text-outline',
    attach: 'attach-outline',

    // Data & Analytics
    analytics: 'analytics-outline',
    folder: 'folder-outline',
    thumbsUp: 'thumbs-up-outline',
    alertCircle: 'alert-circle-outline',

    // Time
    time: 'time-outline',
    calendar: 'calendar-outline',
    today: 'today-outline',

    // Business
    briefcase: 'briefcase-outline',
    card: 'card-outline',
    cash: 'cash-outline',
    wallet: 'wallet-outline',
    receipt: 'receipt-outline',

    // Other
    star: 'star-outline',
    starFilled: 'star',
    heart: 'heart-outline',
    heartFilled: 'heart',
    bookmark: 'bookmark-outline',
    bookmarkFilled: 'bookmark',
    flag: 'flag-outline',
    pin: 'pin-outline',
    logOut: 'log-out-outline',
    help: 'help-circle-outline',
    refresh: 'refresh-outline',
    sync: 'sync-outline',
    chevronForward: 'chevron-forward-outline',
    checkmark: 'checkmark-outline',
    checkmarkCircle: 'checkmark-circle-outline',
};
