# EduMind AI — Complete Subjects & Skills

## Document Info
```
Version: 1.0.0
Purpose: Complete subject catalog with skills for all educational levels
```

---

## 1. Subject Categories Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EDUMIND SUBJECT CATALOG                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  CORE ACADEMIC  │  │   LANGUAGES     │  │  ARTS & MUSIC   │                 │
│  │                 │  │                 │  │                 │                 │
│  │  • Mathematics  │  │  • Spanish      │  │  • Visual Arts  │                 │
│  │  • English      │  │  • French       │  │  • Music        │                 │
│  │  • Science      │  │  • German       │  │  • Drama        │                 │
│  │  • Social Stud. │  │  • Mandarin     │  │  • Dance        │                 │
│  │                 │  │  • Japanese     │  │  • Photography  │                 │
│  │                 │  │  • Italian      │  │                 │                 │
│  │                 │  │  • Latin        │  │                 │                 │
│  │                 │  │  • Ukrainian    │  │                 │                 │
│  │                 │  │  • Dutch        │  │                 │                 │
│  │                 │  │  • Russian      │  │                 │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   TECHNOLOGY    │  │  HEALTH & PE    │  │   VOCATIONAL    │                 │
│  │                 │  │                 │  │                 │                 │
│  │  • Comp. Sci.   │  │  • Phys. Ed.    │  │  • Engineering  │                 │
│  │  • Web Dev      │  │  • Health       │  │  • Culinary     │                 │
│  │  • Programming  │  │  • Nutrition    │  │  • Automotive   │                 │
│  │  • Robotics     │  │  • Sports       │  │  • Woodworking  │                 │
│  │  • Data Science │  │                 │  │  • Graphic Des. │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                                      │
│  │    BUSINESS     │  │     OTHER       │                                      │
│  │                 │  │                 │                                      │
│  │  • Finance      │  │  • Philosophy   │                                      │
│  │  • Accounting   │  │  • Psychology   │                                      │
│  │  • Marketing    │  │  • Ethics       │                                      │
│  │  • Entrepren.   │  │  • Religion     │                                      │
│  │                 │  │  • Media Studies│                                      │
│  └─────────────────┘  └─────────────────┘                                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Subject Enum

```typescript
export enum Subject {
  // ═══════════════════════════════════════════════════════════════
  // CORE ACADEMIC - Mathematics
  // ═══════════════════════════════════════════════════════════════
  MATHEMATICS = 'MATHEMATICS',
  ALGEBRA = 'ALGEBRA',
  GEOMETRY = 'GEOMETRY',
  CALCULUS = 'CALCULUS',
  STATISTICS = 'STATISTICS',
  TRIGONOMETRY = 'TRIGONOMETRY',
  ARITHMETIC = 'ARITHMETIC',
  PRE_CALCULUS = 'PRE_CALCULUS',
  LINEAR_ALGEBRA = 'LINEAR_ALGEBRA',
  DISCRETE_MATH = 'DISCRETE_MATH',
  
  // ═══════════════════════════════════════════════════════════════
  // CORE ACADEMIC - Science
  // ═══════════════════════════════════════════════════════════════
  BIOLOGY = 'BIOLOGY',
  CHEMISTRY = 'CHEMISTRY',
  PHYSICS = 'PHYSICS',
  EARTH_SCIENCE = 'EARTH_SCIENCE',
  ENVIRONMENTAL_SCIENCE = 'ENVIRONMENTAL_SCIENCE',
  ASTRONOMY = 'ASTRONOMY',
  GEOLOGY = 'GEOLOGY',
  ANATOMY = 'ANATOMY',
  ZOOLOGY = 'ZOOLOGY',
  BOTANY = 'BOTANY',
  MARINE_BIOLOGY = 'MARINE_BIOLOGY',
  
  // ═══════════════════════════════════════════════════════════════
  // CORE ACADEMIC - English/Language Arts
  // ═══════════════════════════════════════════════════════════════
  ENGLISH = 'ENGLISH',
  LITERATURE = 'LITERATURE',
  CREATIVE_WRITING = 'CREATIVE_WRITING',
  JOURNALISM = 'JOURNALISM',
  PUBLIC_SPEAKING = 'PUBLIC_SPEAKING',
  ESSAY_WRITING = 'ESSAY_WRITING',
  POETRY = 'POETRY',
  
  // ═══════════════════════════════════════════════════════════════
  // CORE ACADEMIC - Social Studies/Humanities
  // ═══════════════════════════════════════════════════════════════
  HISTORY = 'HISTORY',
  WORLD_HISTORY = 'WORLD_HISTORY',
  US_HISTORY = 'US_HISTORY',
  EUROPEAN_HISTORY = 'EUROPEAN_HISTORY',
  GEOGRAPHY = 'GEOGRAPHY',
  ECONOMICS = 'ECONOMICS',
  CIVICS = 'CIVICS',
  POLITICAL_SCIENCE = 'POLITICAL_SCIENCE',
  SOCIOLOGY = 'SOCIOLOGY',
  ANTHROPOLOGY = 'ANTHROPOLOGY',
  
  // ═══════════════════════════════════════════════════════════════
  // LANGUAGES
  // ═══════════════════════════════════════════════════════════════
  SPANISH = 'SPANISH',
  FRENCH = 'FRENCH',
  GERMAN = 'GERMAN',
  MANDARIN = 'MANDARIN',
  JAPANESE = 'JAPANESE',
  ITALIAN = 'ITALIAN',
  PORTUGUESE = 'PORTUGUESE',
  RUSSIAN = 'RUSSIAN',
  ARABIC = 'ARABIC',
  KOREAN = 'KOREAN',
  LATIN = 'LATIN',
  GREEK = 'GREEK',
  UKRAINIAN = 'UKRAINIAN',
  DUTCH = 'DUTCH',
  POLISH = 'POLISH',
  HINDI = 'HINDI',
  
  // ═══════════════════════════════════════════════════════════════
  // ARTS & MUSIC
  // ═══════════════════════════════════════════════════════════════
  VISUAL_ARTS = 'VISUAL_ARTS',
  DRAWING = 'DRAWING',
  PAINTING = 'PAINTING',
  SCULPTURE = 'SCULPTURE',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  DIGITAL_ART = 'DIGITAL_ART',
  ART_HISTORY = 'ART_HISTORY',
  
  MUSIC = 'MUSIC',
  MUSIC_THEORY = 'MUSIC_THEORY',
  BAND = 'BAND',
  ORCHESTRA = 'ORCHESTRA',
  CHOIR = 'CHOIR',
  PIANO = 'PIANO',
  GUITAR = 'GUITAR',
  VIOLIN = 'VIOLIN',
  
  DRAMA = 'DRAMA',
  THEATER = 'THEATER',
  ACTING = 'ACTING',
  FILM_STUDIES = 'FILM_STUDIES',
  
  DANCE = 'DANCE',
  BALLET = 'BALLET',
  CONTEMPORARY_DANCE = 'CONTEMPORARY_DANCE',
  
  // ═══════════════════════════════════════════════════════════════
  // TECHNOLOGY & COMPUTER SCIENCE
  // ═══════════════════════════════════════════════════════════════
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  PROGRAMMING = 'PROGRAMMING',
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  APP_DEVELOPMENT = 'APP_DEVELOPMENT',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  DATA_SCIENCE = 'DATA_SCIENCE',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  CYBERSECURITY = 'CYBERSECURITY',
  ROBOTICS = 'ROBOTICS',
  DATABASE_MANAGEMENT = 'DATABASE_MANAGEMENT',
  NETWORKING = 'NETWORKING',
  CLOUD_COMPUTING = 'CLOUD_COMPUTING',
  IT_FUNDAMENTALS = 'IT_FUNDAMENTALS',
  
  // ═══════════════════════════════════════════════════════════════
  // BUSINESS
  // ═══════════════════════════════════════════════════════════════
  BUSINESS = 'BUSINESS',
  FINANCE = 'FINANCE',
  ACCOUNTING = 'ACCOUNTING',
  MARKETING = 'MARKETING',
  ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
  MANAGEMENT = 'MANAGEMENT',
  PERSONAL_FINANCE = 'PERSONAL_FINANCE',
  INVESTMENT = 'INVESTMENT',
  
  // ═══════════════════════════════════════════════════════════════
  // PHYSICAL & HEALTH EDUCATION
  // ═══════════════════════════════════════════════════════════════
  PHYSICAL_EDUCATION = 'PHYSICAL_EDUCATION',
  HEALTH = 'HEALTH',
  NUTRITION = 'NUTRITION',
  FITNESS = 'FITNESS',
  SPORTS_SCIENCE = 'SPORTS_SCIENCE',
  FIRST_AID = 'FIRST_AID',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  
  // ═══════════════════════════════════════════════════════════════
  // VOCATIONAL & TECHNICAL
  // ═══════════════════════════════════════════════════════════════
  ENGINEERING = 'ENGINEERING',
  MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
  ELECTRICAL_ENGINEERING = 'ELECTRICAL_ENGINEERING',
  CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
  ARCHITECTURE = 'ARCHITECTURE',
  
  CULINARY_ARTS = 'CULINARY_ARTS',
  BAKING = 'BAKING',
  
  AUTOMOTIVE = 'AUTOMOTIVE',
  WOODWORKING = 'WOODWORKING',
  METALWORKING = 'METALWORKING',
  
  GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
  INTERIOR_DESIGN = 'INTERIOR_DESIGN',
  FASHION_DESIGN = 'FASHION_DESIGN',
  
  // ═══════════════════════════════════════════════════════════════
  // OTHER / HUMANITIES
  // ═══════════════════════════════════════════════════════════════
  PHILOSOPHY = 'PHILOSOPHY',
  PSYCHOLOGY = 'PSYCHOLOGY',
  ETHICS = 'ETHICS',
  RELIGIOUS_STUDIES = 'RELIGIOUS_STUDIES',
  MEDIA_STUDIES = 'MEDIA_STUDIES',
  COMMUNICATION = 'COMMUNICATION',
  LIBRARY_SCIENCE = 'LIBRARY_SCIENCE',
  LAW = 'LAW',
  LOGIC = 'LOGIC',
}
```

---

## 3. Complete Skills by Subject

### 3.1 Mathematics Family

```typescript
export const MATH_SKILLS = {
  MATHEMATICS: [
    { id: 'arithmetic', name: 'Arithmetic', icon: '🔢' },
    { id: 'algebra', name: 'Algebra', icon: '📐' },
    { id: 'geometry', name: 'Geometry', icon: '📏' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
    { id: 'logic', name: 'Logical Reasoning', icon: '🧠' },
    { id: 'number_theory', name: 'Number Theory', icon: '🔣' },
  ],
  
  ALGEBRA: [
    { id: 'equations', name: 'Equations', icon: '⚖️' },
    { id: 'inequalities', name: 'Inequalities', icon: '📊' },
    { id: 'functions', name: 'Functions', icon: '📈' },
    { id: 'polynomials', name: 'Polynomials', icon: '📉' },
    { id: 'factoring', name: 'Factoring', icon: '🔧' },
    { id: 'graphing', name: 'Graphing', icon: '📋' },
  ],
  
  GEOMETRY: [
    { id: 'shapes', name: 'Shapes & Properties', icon: '🔷' },
    { id: 'angles', name: 'Angles', icon: '📐' },
    { id: 'area_perimeter', name: 'Area & Perimeter', icon: '📏' },
    { id: 'volume', name: 'Volume', icon: '📦' },
    { id: 'proofs', name: 'Proofs', icon: '✅' },
    { id: 'transformations', name: 'Transformations', icon: '🔄' },
  ],
  
  CALCULUS: [
    { id: 'limits', name: 'Limits', icon: '♾️' },
    { id: 'derivatives', name: 'Derivatives', icon: '📈' },
    { id: 'integrals', name: 'Integrals', icon: '∫' },
    { id: 'series', name: 'Series', icon: '📊' },
    { id: 'applications', name: 'Applications', icon: '🎯' },
    { id: 'differential_eq', name: 'Differential Equations', icon: '🔄' },
  ],
  
  STATISTICS: [
    { id: 'data_analysis', name: 'Data Analysis', icon: '📊' },
    { id: 'probability', name: 'Probability', icon: '🎲' },
    { id: 'distributions', name: 'Distributions', icon: '📈' },
    { id: 'hypothesis', name: 'Hypothesis Testing', icon: '🔬' },
    { id: 'regression', name: 'Regression', icon: '📉' },
    { id: 'sampling', name: 'Sampling', icon: '🎯' },
  ],
  
  TRIGONOMETRY: [
    { id: 'ratios', name: 'Trig Ratios', icon: '📐' },
    { id: 'identities', name: 'Identities', icon: '🔣' },
    { id: 'equations', name: 'Trig Equations', icon: '⚖️' },
    { id: 'graphs', name: 'Trig Graphs', icon: '📈' },
    { id: 'applications', name: 'Applications', icon: '🎯' },
  ],
};
```

### 3.2 Science Family

```typescript
export const SCIENCE_SKILLS = {
  BIOLOGY: [
    { id: 'cell_biology', name: 'Cell Biology', icon: '🔬' },
    { id: 'genetics', name: 'Genetics', icon: '🧬' },
    { id: 'evolution', name: 'Evolution', icon: '🦎' },
    { id: 'ecology', name: 'Ecology', icon: '🌿' },
    { id: 'anatomy', name: 'Anatomy', icon: '🫀' },
    { id: 'physiology', name: 'Physiology', icon: '💪' },
    { id: 'microbiology', name: 'Microbiology', icon: '🦠' },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼' },
  ],
  
  CHEMISTRY: [
    { id: 'atomic_structure', name: 'Atomic Structure', icon: '⚛️' },
    { id: 'periodic_table', name: 'Periodic Table', icon: '📊' },
    { id: 'chemical_bonds', name: 'Chemical Bonds', icon: '🔗' },
    { id: 'reactions', name: 'Chemical Reactions', icon: '🧪' },
    { id: 'stoichiometry', name: 'Stoichiometry', icon: '⚖️' },
    { id: 'organic', name: 'Organic Chemistry', icon: '🧬' },
    { id: 'lab_skills', name: 'Lab Skills', icon: '🥼' },
  ],
  
  PHYSICS: [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️' },
    { id: 'thermodynamics', name: 'Thermodynamics', icon: '🌡️' },
    { id: 'electromagnetism', name: 'Electromagnetism', icon: '⚡' },
    { id: 'waves', name: 'Waves & Sound', icon: '🌊' },
    { id: 'optics', name: 'Optics', icon: '🔦' },
    { id: 'modern_physics', name: 'Modern Physics', icon: '⚛️' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
  ],
  
  EARTH_SCIENCE: [
    { id: 'geology', name: 'Geology', icon: '🪨' },
    { id: 'meteorology', name: 'Meteorology', icon: '🌤️' },
    { id: 'oceanography', name: 'Oceanography', icon: '🌊' },
    { id: 'climate', name: 'Climate Science', icon: '🌍' },
    { id: 'natural_disasters', name: 'Natural Disasters', icon: '🌋' },
  ],
  
  ASTRONOMY: [
    { id: 'solar_system', name: 'Solar System', icon: '☀️' },
    { id: 'stars', name: 'Stars & Galaxies', icon: '⭐' },
    { id: 'cosmology', name: 'Cosmology', icon: '🌌' },
    { id: 'observation', name: 'Observation', icon: '🔭' },
    { id: 'space_exploration', name: 'Space Exploration', icon: '🚀' },
  ],
  
  ENVIRONMENTAL_SCIENCE: [
    { id: 'ecosystems', name: 'Ecosystems', icon: '🌳' },
    { id: 'pollution', name: 'Pollution', icon: '🏭' },
    { id: 'conservation', name: 'Conservation', icon: '♻️' },
    { id: 'sustainability', name: 'Sustainability', icon: '🌱' },
    { id: 'climate_change', name: 'Climate Change', icon: '🌡️' },
  ],
};
```

### 3.3 Language Arts Family

```typescript
export const LANGUAGE_ARTS_SKILLS = {
  ENGLISH: [
    { id: 'grammar', name: 'Grammar', icon: '📖' },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📝' },
    { id: 'reading', name: 'Reading Comprehension', icon: '📚' },
    { id: 'writing', name: 'Writing', icon: '✍️' },
    { id: 'speaking', name: 'Speaking', icon: '🗣️' },
    { id: 'listening', name: 'Listening', icon: '👂' },
  ],
  
  LITERATURE: [
    { id: 'analysis', name: 'Literary Analysis', icon: '🔍' },
    { id: 'themes', name: 'Themes & Motifs', icon: '🎭' },
    { id: 'characters', name: 'Character Study', icon: '👤' },
    { id: 'genres', name: 'Genre Knowledge', icon: '📚' },
    { id: 'historical_context', name: 'Historical Context', icon: '📜' },
    { id: 'critical_thinking', name: 'Critical Thinking', icon: '🧠' },
  ],
  
  CREATIVE_WRITING: [
    { id: 'fiction', name: 'Fiction Writing', icon: '📖' },
    { id: 'poetry', name: 'Poetry', icon: '🎭' },
    { id: 'dialogue', name: 'Dialogue', icon: '💬' },
    { id: 'world_building', name: 'World Building', icon: '🌍' },
    { id: 'character_dev', name: 'Character Development', icon: '👤' },
    { id: 'editing', name: 'Editing & Revision', icon: '✏️' },
  ],
  
  JOURNALISM: [
    { id: 'news_writing', name: 'News Writing', icon: '📰' },
    { id: 'research', name: 'Research', icon: '🔍' },
    { id: 'interviewing', name: 'Interviewing', icon: '🎤' },
    { id: 'ethics', name: 'Journalistic Ethics', icon: '⚖️' },
    { id: 'multimedia', name: 'Multimedia', icon: '📱' },
  ],
  
  PUBLIC_SPEAKING: [
    { id: 'presentation', name: 'Presentation', icon: '🎤' },
    { id: 'persuasion', name: 'Persuasion', icon: '💡' },
    { id: 'debate', name: 'Debate', icon: '⚔️' },
    { id: 'body_language', name: 'Body Language', icon: '🧍' },
    { id: 'voice_control', name: 'Voice Control', icon: '🔊' },
  ],
};
```

### 3.4 Foreign Languages (Template)

```typescript
// Same template for ALL foreign languages
export const FOREIGN_LANGUAGE_SKILLS = [
  { id: 'grammar', name: 'Grammar', icon: '📖' },
  { id: 'vocabulary', name: 'Vocabulary', icon: '📝' },
  { id: 'speaking', name: 'Speaking', icon: '🗣️' },
  { id: 'listening', name: 'Listening', icon: '👂' },
  { id: 'reading', name: 'Reading', icon: '📚' },
  { id: 'writing', name: 'Writing', icon: '✍️' },
  { id: 'pronunciation', name: 'Pronunciation', icon: '🔊' },
  { id: 'culture', name: 'Culture', icon: '🎭' },
];

// Applies to: SPANISH, FRENCH, GERMAN, MANDARIN, JAPANESE, ITALIAN, 
// PORTUGUESE, RUSSIAN, ARABIC, KOREAN, LATIN, GREEK, UKRAINIAN, 
// DUTCH, POLISH, HINDI
```

### 3.5 Social Studies Family

```typescript
export const SOCIAL_STUDIES_SKILLS = {
  HISTORY: [
    { id: 'chronology', name: 'Chronology', icon: '📅' },
    { id: 'analysis', name: 'Historical Analysis', icon: '🔍' },
    { id: 'primary_sources', name: 'Primary Sources', icon: '📜' },
    { id: 'cause_effect', name: 'Cause & Effect', icon: '🔗' },
    { id: 'geography', name: 'Historical Geography', icon: '🗺️' },
    { id: 'perspectives', name: 'Multiple Perspectives', icon: '👁️' },
  ],
  
  GEOGRAPHY: [
    { id: 'physical', name: 'Physical Geography', icon: '🏔️' },
    { id: 'human', name: 'Human Geography', icon: '👥' },
    { id: 'maps', name: 'Map Skills', icon: '🗺️' },
    { id: 'regions', name: 'World Regions', icon: '🌍' },
    { id: 'climate', name: 'Climate & Weather', icon: '🌤️' },
    { id: 'resources', name: 'Natural Resources', icon: '💎' },
  ],
  
  ECONOMICS: [
    { id: 'microeconomics', name: 'Microeconomics', icon: '📊' },
    { id: 'macroeconomics', name: 'Macroeconomics', icon: '🌐' },
    { id: 'markets', name: 'Markets', icon: '📈' },
    { id: 'finance', name: 'Financial Literacy', icon: '💰' },
    { id: 'policy', name: 'Economic Policy', icon: '📋' },
    { id: 'global', name: 'Global Economics', icon: '🌍' },
  ],
  
  CIVICS: [
    { id: 'government', name: 'Government Structure', icon: '🏛️' },
    { id: 'constitution', name: 'Constitution', icon: '📜' },
    { id: 'rights', name: 'Rights & Responsibilities', icon: '⚖️' },
    { id: 'voting', name: 'Voting & Elections', icon: '🗳️' },
    { id: 'law', name: 'Law & Justice', icon: '⚖️' },
    { id: 'citizenship', name: 'Active Citizenship', icon: '🤝' },
  ],
  
  PSYCHOLOGY: [
    { id: 'cognitive', name: 'Cognitive Psychology', icon: '🧠' },
    { id: 'developmental', name: 'Developmental', icon: '👶' },
    { id: 'social', name: 'Social Psychology', icon: '👥' },
    { id: 'abnormal', name: 'Abnormal Psychology', icon: '🔬' },
    { id: 'research', name: 'Research Methods', icon: '📊' },
    { id: 'therapy', name: 'Therapeutic Approaches', icon: '💭' },
  ],
  
  SOCIOLOGY: [
    { id: 'social_structures', name: 'Social Structures', icon: '🏗️' },
    { id: 'culture', name: 'Culture & Society', icon: '🎭' },
    { id: 'inequality', name: 'Social Inequality', icon: '⚖️' },
    { id: 'institutions', name: 'Social Institutions', icon: '🏛️' },
    { id: 'research', name: 'Research Methods', icon: '📊' },
  ],
  
  PHILOSOPHY: [
    { id: 'logic', name: 'Logic', icon: '🧠' },
    { id: 'ethics', name: 'Ethics', icon: '⚖️' },
    { id: 'metaphysics', name: 'Metaphysics', icon: '💭' },
    { id: 'epistemology', name: 'Epistemology', icon: '📚' },
    { id: 'history', name: 'History of Philosophy', icon: '📜' },
    { id: 'argumentation', name: 'Argumentation', icon: '💬' },
  ],
};
```

### 3.6 Arts & Music Family

```typescript
export const ARTS_SKILLS = {
  VISUAL_ARTS: [
    { id: 'drawing', name: 'Drawing', icon: '✏️' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'composition', name: 'Composition', icon: '🖼️' },
    { id: 'color_theory', name: 'Color Theory', icon: '🌈' },
    { id: 'perspective', name: 'Perspective', icon: '👁️' },
    { id: 'art_history', name: 'Art History', icon: '📜' },
    { id: 'critique', name: 'Art Critique', icon: '🔍' },
  ],
  
  PHOTOGRAPHY: [
    { id: 'camera', name: 'Camera Techniques', icon: '📷' },
    { id: 'lighting', name: 'Lighting', icon: '💡' },
    { id: 'composition', name: 'Composition', icon: '🖼️' },
    { id: 'editing', name: 'Photo Editing', icon: '🖥️' },
    { id: 'genres', name: 'Photo Genres', icon: '📸' },
  ],
  
  MUSIC: [
    { id: 'theory', name: 'Music Theory', icon: '🎼' },
    { id: 'rhythm', name: 'Rhythm', icon: '🥁' },
    { id: 'melody', name: 'Melody', icon: '🎵' },
    { id: 'harmony', name: 'Harmony', icon: '🎶' },
    { id: 'performance', name: 'Performance', icon: '🎤' },
    { id: 'ear_training', name: 'Ear Training', icon: '👂' },
    { id: 'sight_reading', name: 'Sight Reading', icon: '📖' },
  ],
  
  // Instrument skills (PIANO, GUITAR, VIOLIN, etc.)
  INSTRUMENT: [
    { id: 'technique', name: 'Technique', icon: '🎹' },
    { id: 'scales', name: 'Scales & Arpeggios', icon: '🎼' },
    { id: 'repertoire', name: 'Repertoire', icon: '📚' },
    { id: 'sight_reading', name: 'Sight Reading', icon: '👀' },
    { id: 'performance', name: 'Performance', icon: '🎭' },
    { id: 'music_theory', name: 'Theory Application', icon: '🧠' },
  ],
  
  DRAMA: [
    { id: 'acting', name: 'Acting', icon: '🎭' },
    { id: 'voice', name: 'Voice & Diction', icon: '🗣️' },
    { id: 'movement', name: 'Movement', icon: '🏃' },
    { id: 'improv', name: 'Improvisation', icon: '🎲' },
    { id: 'script', name: 'Script Analysis', icon: '📜' },
    { id: 'production', name: 'Production', icon: '🎬' },
  ],
  
  DANCE: [
    { id: 'technique', name: 'Technique', icon: '💃' },
    { id: 'choreography', name: 'Choreography', icon: '📋' },
    { id: 'rhythm', name: 'Rhythm & Timing', icon: '🎵' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸' },
    { id: 'performance', name: 'Performance', icon: '🎭' },
    { id: 'dance_history', name: 'Dance History', icon: '📜' },
  ],
  
  FILM_STUDIES: [
    { id: 'analysis', name: 'Film Analysis', icon: '🔍' },
    { id: 'cinematography', name: 'Cinematography', icon: '🎥' },
    { id: 'editing', name: 'Editing', icon: '✂️' },
    { id: 'sound', name: 'Sound Design', icon: '🔊' },
    { id: 'screenwriting', name: 'Screenwriting', icon: '📝' },
    { id: 'directing', name: 'Directing', icon: '🎬' },
  ],
};
```

### 3.7 Technology & Computer Science Family

```typescript
export const TECH_SKILLS = {
  COMPUTER_SCIENCE: [
    { id: 'algorithms', name: 'Algorithms', icon: '🔄' },
    { id: 'data_structures', name: 'Data Structures', icon: '🗂️' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
    { id: 'debugging', name: 'Debugging', icon: '🐛' },
    { id: 'theory', name: 'CS Theory', icon: '📚' },
  ],
  
  PROGRAMMING: [
    { id: 'syntax', name: 'Syntax', icon: '📝' },
    { id: 'logic', name: 'Programming Logic', icon: '🧠' },
    { id: 'oop', name: 'OOP', icon: '📦' },
    { id: 'functional', name: 'Functional Programming', icon: 'λ' },
    { id: 'testing', name: 'Testing', icon: '✅' },
    { id: 'best_practices', name: 'Best Practices', icon: '⭐' },
  ],
  
  WEB_DEVELOPMENT: [
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
    { id: 'javascript', name: 'JavaScript', icon: '📜' },
    { id: 'frontend', name: 'Frontend', icon: '🖥️' },
    { id: 'backend', name: 'Backend', icon: '⚙️' },
    { id: 'databases', name: 'Databases', icon: '🗄️' },
    { id: 'responsive', name: 'Responsive Design', icon: '📱' },
  ],
  
  DATA_SCIENCE: [
    { id: 'analysis', name: 'Data Analysis', icon: '📊' },
    { id: 'visualization', name: 'Data Visualization', icon: '📈' },
    { id: 'statistics', name: 'Statistics', icon: '📉' },
    { id: 'python', name: 'Python/R', icon: '🐍' },
    { id: 'ml_basics', name: 'ML Basics', icon: '🤖' },
    { id: 'cleaning', name: 'Data Cleaning', icon: '🧹' },
  ],
  
  ROBOTICS: [
    { id: 'mechanics', name: 'Mechanics', icon: '⚙️' },
    { id: 'electronics', name: 'Electronics', icon: '🔌' },
    { id: 'programming', name: 'Robot Programming', icon: '💻' },
    { id: 'sensors', name: 'Sensors', icon: '📡' },
    { id: 'automation', name: 'Automation', icon: '🤖' },
    { id: 'design', name: 'Robot Design', icon: '📐' },
  ],
  
  CYBERSECURITY: [
    { id: 'network', name: 'Network Security', icon: '🔐' },
    { id: 'cryptography', name: 'Cryptography', icon: '🔑' },
    { id: 'threats', name: 'Threat Analysis', icon: '⚠️' },
    { id: 'ethical_hacking', name: 'Ethical Hacking', icon: '🎯' },
    { id: 'compliance', name: 'Compliance', icon: '📋' },
  ],
  
  GRAPHIC_DESIGN: [
    { id: 'typography', name: 'Typography', icon: '🔤' },
    { id: 'color', name: 'Color Theory', icon: '🎨' },
    { id: 'layout', name: 'Layout', icon: '📐' },
    { id: 'software', name: 'Design Software', icon: '💻' },
    { id: 'branding', name: 'Branding', icon: '🏷️' },
    { id: 'ux_ui', name: 'UX/UI', icon: '📱' },
  ],
};
```

### 3.8 Business Family

```typescript
export const BUSINESS_SKILLS = {
  BUSINESS: [
    { id: 'fundamentals', name: 'Business Fundamentals', icon: '📊' },
    { id: 'strategy', name: 'Strategy', icon: '🎯' },
    { id: 'operations', name: 'Operations', icon: '⚙️' },
    { id: 'communication', name: 'Business Communication', icon: '💬' },
    { id: 'ethics', name: 'Business Ethics', icon: '⚖️' },
  ],
  
  FINANCE: [
    { id: 'accounting_basics', name: 'Accounting Basics', icon: '📒' },
    { id: 'financial_analysis', name: 'Financial Analysis', icon: '📊' },
    { id: 'investments', name: 'Investments', icon: '📈' },
    { id: 'budgeting', name: 'Budgeting', icon: '💰' },
    { id: 'markets', name: 'Financial Markets', icon: '🏦' },
  ],
  
  ACCOUNTING: [
    { id: 'bookkeeping', name: 'Bookkeeping', icon: '📒' },
    { id: 'financial_statements', name: 'Financial Statements', icon: '📄' },
    { id: 'tax', name: 'Taxation', icon: '📋' },
    { id: 'auditing', name: 'Auditing', icon: '🔍' },
    { id: 'software', name: 'Accounting Software', icon: '💻' },
  ],
  
  MARKETING: [
    { id: 'strategy', name: 'Marketing Strategy', icon: '🎯' },
    { id: 'digital', name: 'Digital Marketing', icon: '📱' },
    { id: 'branding', name: 'Branding', icon: '🏷️' },
    { id: 'analytics', name: 'Marketing Analytics', icon: '📊' },
    { id: 'content', name: 'Content Marketing', icon: '📝' },
    { id: 'social_media', name: 'Social Media', icon: '📲' },
  ],
  
  ENTREPRENEURSHIP: [
    { id: 'ideation', name: 'Ideation', icon: '💡' },
    { id: 'business_plan', name: 'Business Planning', icon: '📋' },
    { id: 'fundraising', name: 'Fundraising', icon: '💰' },
    { id: 'leadership', name: 'Leadership', icon: '👑' },
    { id: 'growth', name: 'Growth Strategy', icon: '📈' },
    { id: 'pitching', name: 'Pitching', icon: '🎤' },
  ],
};
```

### 3.9 Physical Education & Health

```typescript
export const PE_HEALTH_SKILLS = {
  PHYSICAL_EDUCATION: [
    { id: 'fitness', name: 'Physical Fitness', icon: '💪' },
    { id: 'sports', name: 'Sports Skills', icon: '⚽' },
    { id: 'teamwork', name: 'Teamwork', icon: '🤝' },
    { id: 'coordination', name: 'Coordination', icon: '🤸' },
    { id: 'endurance', name: 'Endurance', icon: '🏃' },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘' },
  ],
  
  HEALTH: [
    { id: 'body_systems', name: 'Body Systems', icon: '🫀' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'mental_health', name: 'Mental Health', icon: '🧠' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
    { id: 'prevention', name: 'Disease Prevention', icon: '💉' },
    { id: 'decision_making', name: 'Health Decisions', icon: '⚖️' },
  ],
  
  NUTRITION: [
    { id: 'macronutrients', name: 'Macronutrients', icon: '🍎' },
    { id: 'micronutrients', name: 'Micronutrients', icon: '💊' },
    { id: 'meal_planning', name: 'Meal Planning', icon: '📋' },
    { id: 'diet_analysis', name: 'Diet Analysis', icon: '📊' },
    { id: 'sports_nutrition', name: 'Sports Nutrition', icon: '🏃' },
  ],
  
  FIRST_AID: [
    { id: 'basic', name: 'Basic First Aid', icon: '🩹' },
    { id: 'cpr', name: 'CPR', icon: '❤️' },
    { id: 'emergency', name: 'Emergency Response', icon: '🚨' },
    { id: 'wounds', name: 'Wound Care', icon: '🩺' },
  ],
};
```

### 3.10 Vocational & Engineering

```typescript
export const VOCATIONAL_SKILLS = {
  ENGINEERING: [
    { id: 'design', name: 'Engineering Design', icon: '📐' },
    { id: 'materials', name: 'Materials', icon: '🧱' },
    { id: 'cad', name: 'CAD', icon: '💻' },
    { id: 'prototyping', name: 'Prototyping', icon: '🔧' },
    { id: 'problem_solving', name: 'Problem Solving', icon: '🧩' },
    { id: 'physics_app', name: 'Applied Physics', icon: '⚙️' },
  ],
  
  CULINARY_ARTS: [
    { id: 'knife_skills', name: 'Knife Skills', icon: '🔪' },
    { id: 'cooking_methods', name: 'Cooking Methods', icon: '🍳' },
    { id: 'baking', name: 'Baking', icon: '🍰' },
    { id: 'food_safety', name: 'Food Safety', icon: '🧤' },
    { id: 'presentation', name: 'Plating', icon: '🍽️' },
    { id: 'cuisine', name: 'World Cuisines', icon: '🌍' },
  ],
  
  AUTOMOTIVE: [
    { id: 'engine', name: 'Engine Systems', icon: '🔧' },
    { id: 'electrical', name: 'Electrical Systems', icon: '⚡' },
    { id: 'diagnostics', name: 'Diagnostics', icon: '🔍' },
    { id: 'maintenance', name: 'Maintenance', icon: '🛠️' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
  ],
  
  WOODWORKING: [
    { id: 'hand_tools', name: 'Hand Tools', icon: '🔨' },
    { id: 'power_tools', name: 'Power Tools', icon: '⚡' },
    { id: 'joinery', name: 'Joinery', icon: '🪵' },
    { id: 'finishing', name: 'Finishing', icon: '🎨' },
    { id: 'design', name: 'Design', icon: '📐' },
    { id: 'safety', name: 'Safety', icon: '🥽' },
  ],
  
  ARCHITECTURE: [
    { id: 'design', name: 'Architectural Design', icon: '🏛️' },
    { id: 'drafting', name: 'Drafting', icon: '📐' },
    { id: 'cad', name: 'CAD/BIM', icon: '💻' },
    { id: 'history', name: 'Architectural History', icon: '📜' },
    { id: 'sustainability', name: 'Sustainable Design', icon: '🌿' },
    { id: 'structures', name: 'Structures', icon: '🏗️' },
  ],
};
```

---

## 4. Subject Metadata

```typescript
export const SUBJECT_METADATA: Record<Subject, SubjectInfo> = {
  MATHEMATICS: {
    category: 'CORE_ACADEMIC',
    icon: '📐',
    color: '#3B82F6',
    description: 'Numbers, equations, and problem solving',
    gradeRange: ['GRADE_1', 'UNIVERSITY_4'],
    hasLevels: false,  // No CEFR-like levels
  },
  
  ENGLISH: {
    category: 'CORE_ACADEMIC',
    icon: '🇬🇧',
    color: '#EF4444',
    description: 'Language arts and communication',
    gradeRange: ['GRADE_1', 'UNIVERSITY_4'],
    hasLevels: true,  // A1-C2 levels
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  },
  
  SPANISH: {
    category: 'LANGUAGES',
    icon: '🇪🇸',
    color: '#F59E0B',
    description: 'Spanish language and culture',
    gradeRange: ['GRADE_1', 'UNIVERSITY_4'],
    hasLevels: true,
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  },
  
  // ... all other subjects with metadata
};
```

---

**End of Subjects & Skills Document**
