// packages/database/prisma/seed.ts
// Complete seed file for EduMind AI

import { PrismaClient, AchievementRarity, Subject } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════════════════════
// SUBJECTS DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const SUBJECTS_DATA = [
  // ─────────────────────────────────────────────────────────────────────────────
  // CORE ACADEMIC - Mathematics
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'MATHEMATICS', category: 'CORE_MATH', name: 'Mathematics', icon: '📐', color: '#3B82F6' },
  { id: 'ALGEBRA', category: 'CORE_MATH', name: 'Algebra', icon: '🔢', color: '#3B82F6' },
  { id: 'GEOMETRY', category: 'CORE_MATH', name: 'Geometry', icon: '📏', color: '#3B82F6' },
  { id: 'CALCULUS', category: 'CORE_MATH', name: 'Calculus', icon: '∫', color: '#3B82F6' },
  { id: 'STATISTICS', category: 'CORE_MATH', name: 'Statistics', icon: '📊', color: '#3B82F6' },
  { id: 'TRIGONOMETRY', category: 'CORE_MATH', name: 'Trigonometry', icon: '📐', color: '#3B82F6' },
  { id: 'ARITHMETIC', category: 'CORE_MATH', name: 'Arithmetic', icon: '➕', color: '#3B82F6' },
  { id: 'PRE_CALCULUS', category: 'CORE_MATH', name: 'Pre-Calculus', icon: '📈', color: '#3B82F6' },
  { id: 'LINEAR_ALGEBRA', category: 'CORE_MATH', name: 'Linear Algebra', icon: '🔣', color: '#3B82F6' },
  { id: 'DISCRETE_MATH', category: 'CORE_MATH', name: 'Discrete Math', icon: '🔢', color: '#3B82F6' },

  // ─────────────────────────────────────────────────────────────────────────────
  // CORE ACADEMIC - Science
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'BIOLOGY', category: 'CORE_SCIENCE', name: 'Biology', icon: '🧬', color: '#22C55E' },
  { id: 'CHEMISTRY', category: 'CORE_SCIENCE', name: 'Chemistry', icon: '🧪', color: '#22C55E' },
  { id: 'PHYSICS', category: 'CORE_SCIENCE', name: 'Physics', icon: '⚛️', color: '#22C55E' },
  { id: 'EARTH_SCIENCE', category: 'CORE_SCIENCE', name: 'Earth Science', icon: '🌍', color: '#22C55E' },
  { id: 'ENVIRONMENTAL_SCIENCE', category: 'CORE_SCIENCE', name: 'Environmental Science', icon: '🌿', color: '#22C55E' },
  { id: 'ASTRONOMY', category: 'CORE_SCIENCE', name: 'Astronomy', icon: '🔭', color: '#22C55E' },
  { id: 'GEOLOGY', category: 'CORE_SCIENCE', name: 'Geology', icon: '🪨', color: '#22C55E' },
  { id: 'ANATOMY', category: 'CORE_SCIENCE', name: 'Anatomy', icon: '🫀', color: '#22C55E' },
  { id: 'ZOOLOGY', category: 'CORE_SCIENCE', name: 'Zoology', icon: '🦁', color: '#22C55E' },
  { id: 'BOTANY', category: 'CORE_SCIENCE', name: 'Botany', icon: '🌱', color: '#22C55E' },
  { id: 'MARINE_BIOLOGY', category: 'CORE_SCIENCE', name: 'Marine Biology', icon: '🐋', color: '#22C55E' },

  // ─────────────────────────────────────────────────────────────────────────────
  // CORE ACADEMIC - English/Language Arts
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'ENGLISH', category: 'CORE_ENGLISH', name: 'English', icon: '🇬🇧', color: '#EF4444' },
  { id: 'LITERATURE', category: 'CORE_ENGLISH', name: 'Literature', icon: '📚', color: '#EF4444' },
  { id: 'CREATIVE_WRITING', category: 'CORE_ENGLISH', name: 'Creative Writing', icon: '✍️', color: '#EF4444' },
  { id: 'JOURNALISM', category: 'CORE_ENGLISH', name: 'Journalism', icon: '📰', color: '#EF4444' },
  { id: 'PUBLIC_SPEAKING', category: 'CORE_ENGLISH', name: 'Public Speaking', icon: '🎤', color: '#EF4444' },
  { id: 'ESSAY_WRITING', category: 'CORE_ENGLISH', name: 'Essay Writing', icon: '📝', color: '#EF4444' },
  { id: 'POETRY', category: 'CORE_ENGLISH', name: 'Poetry', icon: '🎭', color: '#EF4444' },
  { id: 'READING', category: 'CORE_ENGLISH', name: 'Reading', icon: '📖', color: '#EF4444' },

  // ─────────────────────────────────────────────────────────────────────────────
  // CORE ACADEMIC - Social Studies/Humanities
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'HISTORY', category: 'SOCIAL_STUDIES', name: 'History', icon: '📜', color: '#F59E0B' },
  { id: 'WORLD_HISTORY', category: 'SOCIAL_STUDIES', name: 'World History', icon: '🌍', color: '#F59E0B' },
  { id: 'US_HISTORY', category: 'SOCIAL_STUDIES', name: 'US History', icon: '🇺🇸', color: '#F59E0B' },
  { id: 'EUROPEAN_HISTORY', category: 'SOCIAL_STUDIES', name: 'European History', icon: '🇪🇺', color: '#F59E0B' },
  { id: 'GEOGRAPHY', category: 'SOCIAL_STUDIES', name: 'Geography', icon: '🗺️', color: '#F59E0B' },
  { id: 'ECONOMICS', category: 'SOCIAL_STUDIES', name: 'Economics', icon: '📈', color: '#F59E0B' },
  { id: 'CIVICS', category: 'SOCIAL_STUDIES', name: 'Civics', icon: '🏛️', color: '#F59E0B' },
  { id: 'POLITICAL_SCIENCE', category: 'SOCIAL_STUDIES', name: 'Political Science', icon: '⚖️', color: '#F59E0B' },
  { id: 'SOCIOLOGY', category: 'SOCIAL_STUDIES', name: 'Sociology', icon: '👥', color: '#F59E0B' },
  { id: 'ANTHROPOLOGY', category: 'SOCIAL_STUDIES', name: 'Anthropology', icon: '🦴', color: '#F59E0B' },

  // ─────────────────────────────────────────────────────────────────────────────
  // LANGUAGES
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'SPANISH', category: 'LANGUAGES', name: 'Spanish', icon: '🇪🇸', color: '#DC2626', hasLevels: true },
  { id: 'FRENCH', category: 'LANGUAGES', name: 'French', icon: '🇫🇷', color: '#3B82F6', hasLevels: true },
  { id: 'GERMAN', category: 'LANGUAGES', name: 'German', icon: '🇩🇪', color: '#1F2937', hasLevels: true },
  { id: 'MANDARIN', category: 'LANGUAGES', name: 'Mandarin Chinese', icon: '🇨🇳', color: '#DC2626', hasLevels: true },
  { id: 'JAPANESE', category: 'LANGUAGES', name: 'Japanese', icon: '🇯🇵', color: '#DC2626', hasLevels: true },
  { id: 'ITALIAN', category: 'LANGUAGES', name: 'Italian', icon: '🇮🇹', color: '#22C55E', hasLevels: true },
  { id: 'PORTUGUESE', category: 'LANGUAGES', name: 'Portuguese', icon: '🇵🇹', color: '#22C55E', hasLevels: true },
  { id: 'RUSSIAN', category: 'LANGUAGES', name: 'Russian', icon: '🇷🇺', color: '#3B82F6', hasLevels: true },
  { id: 'ARABIC', category: 'LANGUAGES', name: 'Arabic', icon: '🇸🇦', color: '#22C55E', hasLevels: true },
  { id: 'KOREAN', category: 'LANGUAGES', name: 'Korean', icon: '🇰🇷', color: '#3B82F6', hasLevels: true },
  { id: 'LATIN', category: 'LANGUAGES', name: 'Latin', icon: '🏛️', color: '#6B7280', hasLevels: true },
  { id: 'GREEK', category: 'LANGUAGES', name: 'Greek', icon: '🇬🇷', color: '#3B82F6', hasLevels: true },
  { id: 'UKRAINIAN', category: 'LANGUAGES', name: 'Ukrainian', icon: '🇺🇦', color: '#FBBF24', hasLevels: true },
  { id: 'DUTCH', category: 'LANGUAGES', name: 'Dutch', icon: '🇳🇱', color: '#F97316', hasLevels: true },
  { id: 'POLISH', category: 'LANGUAGES', name: 'Polish', icon: '🇵🇱', color: '#DC2626', hasLevels: true },
  { id: 'HINDI', category: 'LANGUAGES', name: 'Hindi', icon: '🇮🇳', color: '#F97316', hasLevels: true },
  { id: 'TURKISH', category: 'LANGUAGES', name: 'Turkish', icon: '🇹🇷', color: '#DC2626', hasLevels: true },
  { id: 'VIETNAMESE', category: 'LANGUAGES', name: 'Vietnamese', icon: '🇻🇳', color: '#DC2626', hasLevels: true },
  { id: 'SWEDISH', category: 'LANGUAGES', name: 'Swedish', icon: '🇸🇪', color: '#FBBF24', hasLevels: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // ARTS & MUSIC
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'VISUAL_ARTS', category: 'ARTS', name: 'Visual Arts', icon: '🎨', color: '#EC4899' },
  { id: 'DRAWING', category: 'ARTS', name: 'Drawing', icon: '✏️', color: '#EC4899' },
  { id: 'PAINTING', category: 'ARTS', name: 'Painting', icon: '🖼️', color: '#EC4899' },
  { id: 'SCULPTURE', category: 'ARTS', name: 'Sculpture', icon: '🗿', color: '#EC4899' },
  { id: 'PHOTOGRAPHY', category: 'ARTS', name: 'Photography', icon: '📷', color: '#EC4899' },
  { id: 'DIGITAL_ART', category: 'ARTS', name: 'Digital Art', icon: '🖥️', color: '#EC4899' },
  { id: 'ART_HISTORY', category: 'ARTS', name: 'Art History', icon: '🏛️', color: '#EC4899' },
  { id: 'MUSIC', category: 'MUSIC', name: 'Music', icon: '🎵', color: '#8B5CF6' },
  { id: 'MUSIC_THEORY', category: 'MUSIC', name: 'Music Theory', icon: '🎼', color: '#8B5CF6' },
  { id: 'BAND', category: 'MUSIC', name: 'Band', icon: '🎷', color: '#8B5CF6' },
  { id: 'ORCHESTRA', category: 'MUSIC', name: 'Orchestra', icon: '🎻', color: '#8B5CF6' },
  { id: 'CHOIR', category: 'MUSIC', name: 'Choir', icon: '🎤', color: '#8B5CF6' },
  { id: 'PIANO', category: 'MUSIC', name: 'Piano', icon: '🎹', color: '#8B5CF6' },
  { id: 'GUITAR', category: 'MUSIC', name: 'Guitar', icon: '🎸', color: '#8B5CF6' },
  { id: 'VIOLIN', category: 'MUSIC', name: 'Violin', icon: '🎻', color: '#8B5CF6' },
  { id: 'DRUMS', category: 'MUSIC', name: 'Drums', icon: '🥁', color: '#8B5CF6' },
  { id: 'DRAMA', category: 'PERFORMING', name: 'Drama', icon: '🎭', color: '#F97316' },
  { id: 'THEATER', category: 'PERFORMING', name: 'Theater', icon: '🎬', color: '#F97316' },
  { id: 'ACTING', category: 'PERFORMING', name: 'Acting', icon: '🎭', color: '#F97316' },
  { id: 'FILM_STUDIES', category: 'PERFORMING', name: 'Film Studies', icon: '🎥', color: '#F97316' },
  { id: 'DANCE', category: 'PERFORMING', name: 'Dance', icon: '💃', color: '#F97316' },
  { id: 'BALLET', category: 'PERFORMING', name: 'Ballet', icon: '🩰', color: '#F97316' },

  // ─────────────────────────────────────────────────────────────────────────────
  // TECHNOLOGY & COMPUTER SCIENCE
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'COMPUTER_SCIENCE', category: 'TECHNOLOGY', name: 'Computer Science', icon: '💻', color: '#6366F1' },
  { id: 'PROGRAMMING', category: 'TECHNOLOGY', name: 'Programming', icon: '👨‍💻', color: '#6366F1' },
  { id: 'WEB_DEVELOPMENT', category: 'TECHNOLOGY', name: 'Web Development', icon: '🌐', color: '#6366F1' },
  { id: 'APP_DEVELOPMENT', category: 'TECHNOLOGY', name: 'App Development', icon: '📱', color: '#6366F1' },
  { id: 'GAME_DEVELOPMENT', category: 'TECHNOLOGY', name: 'Game Development', icon: '🎮', color: '#6366F1' },
  { id: 'DATA_SCIENCE', category: 'TECHNOLOGY', name: 'Data Science', icon: '📊', color: '#6366F1' },
  { id: 'MACHINE_LEARNING', category: 'TECHNOLOGY', name: 'Machine Learning', icon: '🤖', color: '#6366F1' },
  { id: 'CYBERSECURITY', category: 'TECHNOLOGY', name: 'Cybersecurity', icon: '🔐', color: '#6366F1' },
  { id: 'ROBOTICS', category: 'TECHNOLOGY', name: 'Robotics', icon: '🤖', color: '#6366F1' },
  { id: 'DATABASE_MANAGEMENT', category: 'TECHNOLOGY', name: 'Database Management', icon: '🗄️', color: '#6366F1' },
  { id: 'NETWORKING', category: 'TECHNOLOGY', name: 'Networking', icon: '🔗', color: '#6366F1' },
  { id: 'CLOUD_COMPUTING', category: 'TECHNOLOGY', name: 'Cloud Computing', icon: '☁️', color: '#6366F1' },
  { id: 'IT_FUNDAMENTALS', category: 'TECHNOLOGY', name: 'IT Fundamentals', icon: '🖥️', color: '#6366F1' },

  // ─────────────────────────────────────────────────────────────────────────────
  // BUSINESS
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'BUSINESS', category: 'BUSINESS', name: 'Business', icon: '💼', color: '#14B8A6' },
  { id: 'FINANCE', category: 'BUSINESS', name: 'Finance', icon: '💰', color: '#14B8A6' },
  { id: 'ACCOUNTING', category: 'BUSINESS', name: 'Accounting', icon: '📒', color: '#14B8A6' },
  { id: 'MARKETING', category: 'BUSINESS', name: 'Marketing', icon: '📣', color: '#14B8A6' },
  { id: 'ENTREPRENEURSHIP', category: 'BUSINESS', name: 'Entrepreneurship', icon: '🚀', color: '#14B8A6' },
  { id: 'MANAGEMENT', category: 'BUSINESS', name: 'Management', icon: '👔', color: '#14B8A6' },
  { id: 'PERSONAL_FINANCE', category: 'BUSINESS', name: 'Personal Finance', icon: '💳', color: '#14B8A6' },
  { id: 'INVESTMENT', category: 'BUSINESS', name: 'Investment', icon: '📈', color: '#14B8A6' },

  // ─────────────────────────────────────────────────────────────────────────────
  // PHYSICAL & HEALTH EDUCATION
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'PHYSICAL_EDUCATION', category: 'HEALTH_PE', name: 'Physical Education', icon: '🏃', color: '#10B981' },
  { id: 'HEALTH', category: 'HEALTH_PE', name: 'Health', icon: '❤️', color: '#10B981' },
  { id: 'NUTRITION', category: 'HEALTH_PE', name: 'Nutrition', icon: '🥗', color: '#10B981' },
  { id: 'FITNESS', category: 'HEALTH_PE', name: 'Fitness', icon: '💪', color: '#10B981' },
  { id: 'SPORTS_SCIENCE', category: 'HEALTH_PE', name: 'Sports Science', icon: '⚽', color: '#10B981' },
  { id: 'FIRST_AID', category: 'HEALTH_PE', name: 'First Aid', icon: '🩹', color: '#10B981' },
  { id: 'MENTAL_HEALTH', category: 'HEALTH_PE', name: 'Mental Health', icon: '🧠', color: '#10B981' },

  // ─────────────────────────────────────────────────────────────────────────────
  // VOCATIONAL & TECHNICAL
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'ENGINEERING', category: 'VOCATIONAL', name: 'Engineering', icon: '⚙️', color: '#64748B' },
  { id: 'MECHANICAL_ENGINEERING', category: 'VOCATIONAL', name: 'Mechanical Engineering', icon: '🔧', color: '#64748B' },
  { id: 'ELECTRICAL_ENGINEERING', category: 'VOCATIONAL', name: 'Electrical Engineering', icon: '⚡', color: '#64748B' },
  { id: 'CIVIL_ENGINEERING', category: 'VOCATIONAL', name: 'Civil Engineering', icon: '🏗️', color: '#64748B' },
  { id: 'ARCHITECTURE', category: 'VOCATIONAL', name: 'Architecture', icon: '🏛️', color: '#64748B' },
  { id: 'CULINARY_ARTS', category: 'VOCATIONAL', name: 'Culinary Arts', icon: '👨‍🍳', color: '#64748B' },
  { id: 'BAKING', category: 'VOCATIONAL', name: 'Baking', icon: '🍰', color: '#64748B' },
  { id: 'AUTOMOTIVE', category: 'VOCATIONAL', name: 'Automotive', icon: '🚗', color: '#64748B' },
  { id: 'WOODWORKING', category: 'VOCATIONAL', name: 'Woodworking', icon: '🪵', color: '#64748B' },
  { id: 'METALWORKING', category: 'VOCATIONAL', name: 'Metalworking', icon: '🔩', color: '#64748B' },
  { id: 'GRAPHIC_DESIGN', category: 'VOCATIONAL', name: 'Graphic Design', icon: '🎨', color: '#64748B' },
  { id: 'INTERIOR_DESIGN', category: 'VOCATIONAL', name: 'Interior Design', icon: '🛋️', color: '#64748B' },
  { id: 'FASHION_DESIGN', category: 'VOCATIONAL', name: 'Fashion Design', icon: '👗', color: '#64748B' },

  // ─────────────────────────────────────────────────────────────────────────────
  // OTHER / HUMANITIES
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'PHILOSOPHY', category: 'OTHER', name: 'Philosophy', icon: '🤔', color: '#78716C' },
  { id: 'PSYCHOLOGY', category: 'OTHER', name: 'Psychology', icon: '🧠', color: '#78716C' },
  { id: 'ETHICS', category: 'OTHER', name: 'Ethics', icon: '⚖️', color: '#78716C' },
  { id: 'RELIGIOUS_STUDIES', category: 'OTHER', name: 'Religious Studies', icon: '🙏', color: '#78716C' },
  { id: 'MEDIA_STUDIES', category: 'OTHER', name: 'Media Studies', icon: '📺', color: '#78716C' },
  { id: 'COMMUNICATION', category: 'OTHER', name: 'Communication', icon: '💬', color: '#78716C' },
  { id: 'LAW', category: 'OTHER', name: 'Law', icon: '⚖️', color: '#78716C' },
  { id: 'LOGIC', category: 'OTHER', name: 'Logic', icon: '🧩', color: '#78716C' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const ACHIEVEMENTS_DATA = [
  // ─────────────────────────────────────────────────────────────────────────────
  // STREAK ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    name: 'First Flame',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 3,
    xpReward: 25,
  },
  {
    id: 'streak_5',
    name: 'Getting Warm',
    description: 'Maintain a 5-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 5,
    xpReward: 40,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 7,
    xpReward: 75,
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day study streak',
    icon: '🔥🔥',
    category: 'streak',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 14,
    xpReward: 150,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day study streak',
    icon: '🌟🔥',
    category: 'streak',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 30,
    xpReward: 350,
    unlocksTitle: 'Dedicated',
  },
  {
    id: 'streak_60',
    name: 'Discipline Disciple',
    description: 'Maintain a 60-day study streak',
    icon: '💎🔥',
    category: 'streak',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 60,
    xpReward: 600,
    unlocksFrame: 'flame_border',
  },
  {
    id: 'streak_90',
    name: 'Quarterly Quest',
    description: 'Maintain a 90-day study streak',
    icon: '💎🔥',
    category: 'streak',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 90,
    xpReward: 800,
    unlocksTitle: 'Persistent',
  },
  {
    id: 'streak_100',
    name: 'Century Streak',
    description: 'Maintain a 100-day study streak',
    icon: '👑🔥',
    category: 'streak',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 100,
    xpReward: 1200,
    unlocksTitle: 'Unstoppable',
    unlocksFrame: 'legendary_flame',
  },
  {
    id: 'streak_200',
    name: 'Streak Legend',
    description: 'Maintain a 200-day study streak',
    icon: '👑🔥',
    category: 'streak',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 200,
    xpReward: 2000,
    unlocksBadge: 'streak_master',
  },
  {
    id: 'streak_365',
    name: 'Year of Dedication',
    description: 'Maintain a 365-day study streak',
    icon: '🏆👑🔥',
    category: 'streak',
    rarity: 'MYTHIC' as AchievementRarity,
    conditionType: 'streak_days',
    conditionValue: 365,
    xpReward: 5000,
    unlocksTitle: 'The Devoted',
    unlocksFrame: 'mythic_flame',
    unlocksBadge: 'year_badge',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    category: 'level',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 5,
    xpReward: 50,
  },
  {
    id: 'level_10',
    name: 'Double Digits',
    description: 'Reach Level 10',
    icon: '🌟',
    category: 'level',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 10,
    xpReward: 100,
  },
  {
    id: 'level_25',
    name: 'Quarter Century',
    description: 'Reach Level 25',
    icon: '✨',
    category: 'level',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 25,
    xpReward: 250,
    unlocksTitle: 'Adept',
  },
  {
    id: 'level_50',
    name: 'Halfway Hero',
    description: 'Reach Level 50',
    icon: '💫',
    category: 'level',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 50,
    xpReward: 500,
    unlocksFrame: 'golden_border',
  },
  {
    id: 'level_75',
    name: 'Elite Learner',
    description: 'Reach Level 75',
    icon: '🌠',
    category: 'level',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 75,
    xpReward: 750,
    unlocksTitle: 'Elite',
  },
  {
    id: 'level_100',
    name: 'Maximum Level',
    description: 'Reach Level 100',
    icon: '👑',
    category: 'level',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'level_reached',
    conditionValue: 100,
    xpReward: 1500,
    unlocksTitle: 'The Maxed',
    unlocksFrame: 'legendary_crown',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GRADE ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grade_c',
    name: 'Making Progress',
    description: 'Reach Grade C',
    icon: '📗',
    category: 'grade',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'grade_reached',
    conditionValue: 3, // C = 3
    xpReward: 50,
  },
  {
    id: 'grade_b',
    name: 'Getting Better',
    description: 'Reach Grade B',
    icon: '📙',
    category: 'grade',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'grade_reached',
    conditionValue: 4, // B = 4
    xpReward: 100,
  },
  {
    id: 'grade_a',
    name: 'Excellence',
    description: 'Reach Grade A',
    icon: '⭐',
    category: 'grade',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'grade_reached',
    conditionValue: 5, // A = 5
    xpReward: 250,
    unlocksTitle: 'Excellent',
  },
  {
    id: 'grade_s',
    name: 'Outstanding',
    description: 'Reach Grade S',
    icon: '🌟',
    category: 'grade',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'grade_reached',
    conditionValue: 6, // S = 6
    xpReward: 500,
    unlocksTitle: 'Outstanding',
  },
  {
    id: 'grade_s_plus',
    name: 'Legendary Status',
    description: 'Reach Grade S+',
    icon: '👑',
    category: 'grade',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'grade_reached',
    conditionValue: 7, // S+ = 7
    xpReward: 1000,
    unlocksTitle: 'Legendary',
    unlocksFrame: 'legendary_grade',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HOMEWORK ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hw_first',
    name: 'First Steps',
    description: 'Complete your first homework',
    icon: '📝',
    category: 'homework',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 1,
    xpReward: 25,
  },
  {
    id: 'hw_10',
    name: 'Homework Habit',
    description: 'Complete 10 homeworks',
    icon: '📚',
    category: 'homework',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 10,
    xpReward: 75,
  },
  {
    id: 'hw_25',
    name: 'Quarter Century HW',
    description: 'Complete 25 homeworks',
    icon: '📚',
    category: 'homework',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 25,
    xpReward: 150,
  },
  {
    id: 'hw_50',
    name: 'Halfway There',
    description: 'Complete 50 homeworks',
    icon: '📚',
    category: 'homework',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 50,
    xpReward: 250,
  },
  {
    id: 'hw_100',
    name: 'Homework Hero',
    description: 'Complete 100 homeworks',
    icon: '🦸📚',
    category: 'homework',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 100,
    xpReward: 400,
    unlocksTitle: 'Homework Hero',
  },
  {
    id: 'hw_250',
    name: 'HW Champion',
    description: 'Complete 250 homeworks',
    icon: '🏆📚',
    category: 'homework',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 250,
    xpReward: 700,
  },
  {
    id: 'hw_500',
    name: 'HW Legend',
    description: 'Complete 500 homeworks',
    icon: '👑📚',
    category: 'homework',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'homework_count',
    conditionValue: 500,
    xpReward: 1200,
    unlocksBadge: 'hw_master',
  },
  {
    id: 'hw_perfect_1',
    name: 'Perfectionist',
    description: 'Get 100% on a homework',
    icon: '💯',
    category: 'homework',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'homework_perfect',
    conditionValue: 1,
    xpReward: 100,
  },
  {
    id: 'hw_perfect_10',
    name: 'Perfect Ten',
    description: 'Get 100% on 10 homeworks',
    icon: '🌟💯',
    category: 'homework',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'homework_perfect',
    conditionValue: 10,
    xpReward: 300,
  },
  {
    id: 'hw_perfect_50',
    name: 'Flawless Record',
    description: 'Get 100% on 50 homeworks',
    icon: '👑💯',
    category: 'homework',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'homework_perfect',
    conditionValue: 50,
    xpReward: 1000,
    unlocksTitle: 'Flawless',
  },
  {
    id: 'hw_ontime_10',
    name: 'Punctual',
    description: 'Submit 10 homeworks on time in a row',
    icon: '⏰',
    category: 'homework',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'homework_ontime_streak',
    conditionValue: 10,
    xpReward: 150,
  },
  {
    id: 'hw_ontime_50',
    name: 'Never Late',
    description: 'Submit 50 homeworks on time in a row',
    icon: '⏰✨',
    category: 'homework',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'homework_ontime_streak',
    conditionValue: 50,
    xpReward: 600,
    unlocksBadge: 'punctual',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // QUIZ ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'quiz_first',
    name: 'Quiz Taker',
    description: 'Complete your first quiz',
    icon: '❓',
    category: 'quiz',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'quiz_count',
    conditionValue: 1,
    xpReward: 30,
  },
  {
    id: 'quiz_10',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: '❓',
    category: 'quiz',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'quiz_count',
    conditionValue: 10,
    xpReward: 100,
  },
  {
    id: 'quiz_50',
    name: 'Quiz Champion',
    description: 'Complete 50 quizzes',
    icon: '🏆❓',
    category: 'quiz',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'quiz_count',
    conditionValue: 50,
    xpReward: 350,
  },
  {
    id: 'quiz_100',
    name: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    icon: '👑❓',
    category: 'quiz',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'quiz_count',
    conditionValue: 100,
    xpReward: 600,
    unlocksBadge: 'quiz_master',
  },
  {
    id: 'quiz_perfect_1',
    name: 'Flawless Victory',
    description: 'Get 100% on a quiz',
    icon: '🎯',
    category: 'quiz',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'quiz_perfect',
    conditionValue: 1,
    xpReward: 125,
  },
  {
    id: 'quiz_perfect_5',
    name: 'Quiz Master',
    description: 'Get 100% on 5 quizzes',
    icon: '🎯🎯',
    category: 'quiz',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'quiz_perfect',
    conditionValue: 5,
    xpReward: 300,
  },
  {
    id: 'quiz_perfect_25',
    name: 'Perfection Master',
    description: 'Get 100% on 25 quizzes',
    icon: '👑🎯',
    category: 'quiz',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'quiz_perfect',
    conditionValue: 25,
    xpReward: 1000,
    unlocksTitle: 'Perfectionist',
  },
  {
    id: 'boss_first',
    name: 'Boss Slayer',
    description: 'Defeat your first Boss Battle',
    icon: '⚔️',
    category: 'quiz',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'boss_defeated',
    conditionValue: 1,
    xpReward: 200,
  },
  {
    id: 'boss_10',
    name: 'Raid Leader',
    description: 'Defeat 10 Boss Battles',
    icon: '🏆⚔️',
    category: 'quiz',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'boss_defeated',
    conditionValue: 10,
    xpReward: 700,
    unlocksFrame: 'boss_border',
  },
  {
    id: 'boss_perfect',
    name: 'Flawless Boss Kill',
    description: 'Defeat a Boss with 100%',
    icon: '⚔️👑',
    category: 'quiz',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'boss_perfect',
    conditionValue: 1,
    xpReward: 500,
    unlocksTitle: 'Boss Crusher',
  },
  {
    id: 'boss_perfect_10',
    name: 'Ultimate Slayer',
    description: '10 flawless Boss defeats',
    icon: '👑⚔️',
    category: 'quiz',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'boss_perfect',
    conditionValue: 10,
    xpReward: 1500,
    unlocksBadge: 'boss_slayer',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SKILL ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'skill_80',
    name: 'Skill Specialist',
    description: 'Reach 80% in any skill',
    icon: '📊',
    category: 'skill',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'skill_level',
    conditionValue: 80,
    xpReward: 200,
  },
  {
    id: 'skill_100',
    name: 'Skill Master',
    description: 'Max out any skill (100%)',
    icon: '🏆📊',
    category: 'skill',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'skill_level',
    conditionValue: 100,
    xpReward: 500,
    unlocksTitle: 'Master',
  },
  {
    id: 'skill_all_80',
    name: 'Complete',
    description: 'All skills 80%+ in a class',
    icon: '🌟📊',
    category: 'skill',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'all_skills_level',
    conditionValue: 80,
    xpReward: 700,
    unlocksBadge: 'balanced',
  },
  {
    id: 'skill_all_100',
    name: 'Perfect Subject',
    description: 'All skills 100% in a class',
    icon: '👑📊',
    category: 'skill',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'all_skills_level',
    conditionValue: 100,
    xpReward: 1500,
    unlocksTitle: 'Subject Master',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIAL ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'social_first_follow',
    name: 'Making Friends',
    description: 'Follow your first classmate',
    icon: '👥',
    category: 'social',
    rarity: 'COMMON' as AchievementRarity,
    conditionType: 'following_count',
    conditionValue: 1,
    xpReward: 25,
  },
  {
    id: 'social_10_followers',
    name: 'Popular',
    description: 'Get 10 followers',
    icon: '🌟👥',
    category: 'social',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'followers_count',
    conditionValue: 10,
    xpReward: 200,
  },
  {
    id: 'social_50_followers',
    name: 'Famous',
    description: 'Get 50 followers',
    icon: '👑👥',
    category: 'social',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'followers_count',
    conditionValue: 50,
    xpReward: 500,
    unlocksBadge: 'influencer',
  },
  {
    id: 'social_top10_weekly',
    name: 'Top 10',
    description: 'Reach Top 10 on weekly leaderboard',
    icon: '🏅',
    category: 'social',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'leaderboard_rank',
    conditionValue: 10,
    xpReward: 300,
  },
  {
    id: 'social_first_place',
    name: 'Number One',
    description: 'Reach #1 on any leaderboard',
    icon: '🥇',
    category: 'social',
    rarity: 'LEGENDARY' as AchievementRarity,
    conditionType: 'leaderboard_rank',
    conditionValue: 1,
    xpReward: 1000,
    unlocksTitle: 'Champion',
    unlocksFrame: 'champion_crown',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HIDDEN ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hidden_night_owl',
    name: 'Night Owl',
    description: 'Study after midnight',
    icon: '🦉',
    category: 'hidden',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'study_time',
    conditionValue: 0,
    xpReward: 100,
    isHidden: true,
  },
  {
    id: 'hidden_early_bird',
    name: 'Early Bird',
    description: 'Study before 6 AM',
    icon: '🐦',
    category: 'hidden',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'study_time',
    conditionValue: 6,
    xpReward: 100,
    isHidden: true,
  },
  {
    id: 'hidden_marathon',
    name: 'Study Marathon',
    description: 'Study for 5 hours in one day',
    icon: '🏃',
    category: 'hidden',
    rarity: 'RARE' as AchievementRarity,
    conditionType: 'daily_study_hours',
    conditionValue: 5,
    xpReward: 300,
    isHidden: true,
  },
  {
    id: 'hidden_comeback',
    name: 'The Comeback',
    description: 'Return after 30+ days away',
    icon: '🔄',
    category: 'hidden',
    rarity: 'UNCOMMON' as AchievementRarity,
    conditionType: 'comeback_days',
    conditionValue: 30,
    xpReward: 150,
    isHidden: true,
  },
  {
    id: 'hidden_speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes with 100%',
    icon: '⚡',
    category: 'hidden',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'quiz_speed_perfect',
    conditionValue: 120,
    xpReward: 500,
    isHidden: true,
  },
  {
    id: 'hidden_polyglot',
    name: 'Polyglot',
    description: 'Enroll in 3+ language classes',
    icon: '🌍',
    category: 'hidden',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'language_classes',
    conditionValue: 3,
    xpReward: 500,
    isHidden: true,
  },
  {
    id: 'hidden_renaissance',
    name: 'Renaissance Student',
    description: 'Enroll in classes from 5 different categories',
    icon: '🎭',
    category: 'hidden',
    rarity: 'EPIC' as AchievementRarity,
    conditionType: 'subject_categories',
    conditionValue: 5,
    xpReward: 600,
    isHidden: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS DATA BY SUBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const SKILLS_BY_SUBJECT: Record<string, { id: string; name: string; icon: string }[]> = {
  // Languages template (applies to all language subjects)
  LANGUAGE_TEMPLATE: [
    { id: 'grammar', name: 'Grammar', icon: '📖' },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📝' },
    { id: 'speaking', name: 'Speaking', icon: '🗣️' },
    { id: 'listening', name: 'Listening', icon: '👂' },
    { id: 'reading', name: 'Reading', icon: '📚' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'pronunciation', name: 'Pronunciation', icon: '🔊' },
    { id: 'culture', name: 'Culture', icon: '🎭' },
  ],
  
  MATHEMATICS: [
    { id: 'arithmetic', name: 'Arithmetic', icon: '🔢' },
    { id: 'algebra', name: 'Algebra', icon: '📐' },
    { id: 'geometry', name: 'Geometry', icon: '📏' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
    { id: 'logic', name: 'Logical Reasoning', icon: '🧠' },
  ],
  
  BIOLOGY: [
    { id: 'cell_biology', name: 'Cell Biology', icon: '🔬' },
    { id: 'genetics', name: 'Genetics', icon: '🧬' },
    { id: 'evolution', name: 'Evolution', icon: '🦎' },
    { id: 'ecology', name: 'Ecology', icon: '🌿' },
    { id: 'anatomy', name: 'Anatomy', icon: '🫀' },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼' },
  ],
  
  CHEMISTRY: [
    { id: 'atomic_structure', name: 'Atomic Structure', icon: '⚛️' },
    { id: 'periodic_table', name: 'Periodic Table', icon: '📊' },
    { id: 'reactions', name: 'Chemical Reactions', icon: '🧪' },
    { id: 'organic', name: 'Organic Chemistry', icon: '🧬' },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼' },
  ],
  
  PHYSICS: [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️' },
    { id: 'thermodynamics', name: 'Thermodynamics', icon: '🌡️' },
    { id: 'electromagnetism', name: 'Electromagnetism', icon: '⚡' },
    { id: 'waves', name: 'Waves', icon: '🌊' },
    { id: 'optics', name: 'Optics', icon: '🔦' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
  ],
  
  COMPUTER_SCIENCE: [
    { id: 'algorithms', name: 'Algorithms', icon: '🔄' },
    { id: 'data_structures', name: 'Data Structures', icon: '🗂️' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
    { id: 'debugging', name: 'Debugging', icon: '🐛' },
  ],
  
  HISTORY: [
    { id: 'chronology', name: 'Chronology', icon: '📅' },
    { id: 'analysis', name: 'Historical Analysis', icon: '🔍' },
    { id: 'primary_sources', name: 'Primary Sources', icon: '📜' },
    { id: 'cause_effect', name: 'Cause & Effect', icon: '🔗' },
    { id: 'geography', name: 'Historical Geography', icon: '🗺️' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Achievements
  console.log('📦 Seeding achievements...');
  for (const achievement of ACHIEVEMENTS_DATA) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: achievement,
      create: {
        ...achievement,
        nameTranslations: {},
        descriptionTranslations: {},
        isActive: true,
      },
    });
  }
  console.log(`✅ Seeded ${ACHIEVEMENTS_DATA.length} achievements`);

  // Log subjects (these are enums, not seeded to DB)
  console.log(`📚 ${SUBJECTS_DATA.length} subjects defined in enum`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Export for use in other files
export { main as seed };
