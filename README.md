<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 Special Needs School Finder

A professional, feature-rich web application to help parents find the perfect special needs school for their child. Built with React, TypeScript, and powered by Google's Gemini AI.

## ✨ Features

### 🔍 Smart Search & Discovery
- **AI-Powered Search**: Natural language queries powered by Gemini AI
- **Location-Based**: Find schools near any location
- **Advanced Filtering**: Filter by tuition, class size, support features, and educational approach
- **Quick Filters**: One-click common requirement filters
- **Smart Sorting**: Sort by rating, tuition, class size, or name

### 📊 Compare & Analyze
- **Side-by-Side Comparison**: Compare up to 4 schools simultaneously
- **Comprehensive Metrics**: View all important details in one place
- **Persistent Bookmarks**: Save favorites across sessions

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds, smooth animations, custom scrollbars
- **Fully Responsive**: Perfect experience on mobile, tablet, and desktop
- **Loading States**: Skeleton loaders and smooth transitions
- **Empty States**: Helpful guidance when no results are found

### 📱 Mobile-First
- **Mobile Filters**: Touch-friendly bottom sheet filters
- **Responsive Cards**: Optimized layouts for all screen sizes
- **Swipe-Friendly**: Easy navigation on touch devices

### 📚 Resources
- **Resource Library**: AI-powered educational resource recommendations
- **Parent Support**: Find articles and guides on special needs education

### 💾 Data Persistence
- **Local Storage**: Bookmarks saved automatically
- **No Account Required**: Everything works without sign-up

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key from [Google AI Studio](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TH33ORACL3/School-Finder.git
   cd School-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   
   Create a `.env.local` file in the root directory:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Searching for Schools

1. **Enter your requirements** in the search field (e.g., "Montessori school with speech therapy")
2. **Specify location** (e.g., "Parklands, Cape Town")
3. **Click Search** or press Enter
4. Browse results with detailed information

### Filtering Results

- **Desktop**: Use the sidebar on the left to adjust filters
- **Mobile**: Tap the "Filters" button to open the filter modal
- **Quick Filters**: Use the quick filter badges at the top for common requirements

### Comparing Schools

1. Click the **comparison icon** (checkmark) on school cards you want to compare
2. Select up to 4 schools
3. Click **"Compare"** button in the top bar
4. View side-by-side comparison of all features

### Bookmarking

- Click the **heart icon** on any school card to bookmark
- Bookmarks are saved automatically
- Click **"Bookmarks"** in the header to view only bookmarked schools

### Viewing Details

- Click **"View Details"** on any school card
- Scroll through comprehensive information
- Contact school directly via website or phone links

## 🏗️ Project Structure

```
School-Finder/
├── components/           # React components
│   ├── SchoolCard.tsx           # Individual school display
│   ├── SchoolDetailModal.tsx   # Full school details
│   ├── FilterSidebar.tsx        # Desktop filters
│   ├── MobileFilters.tsx        # Mobile filters
│   ├── ComparisonView.tsx       # School comparison
│   ├── QuickFilters.tsx         # Quick filter badges
│   ├── EmptyState.tsx           # Empty state handler
│   ├── LoadingSkeleton.tsx      # Loading placeholders
│   └── icons.tsx                # Icon components
├── services/            # API services
│   └── geminiService.ts         # Gemini AI integration
├── utils/               # Utility functions
│   ├── storage.ts               # localStorage management
│   └── schoolHelpers.ts         # Filtering/sorting logic
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── index.html           # HTML template
```

## 🛠️ Tech Stack

- **Frontend**: React 19.2 + TypeScript
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini 2.5 Flash
- **State Management**: React Hooks
- **Icons**: Heroicons (as SVG components)

## 📝 Component Overview

### Core Components

- **App.tsx**: Main application with search, filtering, and state management
- **SchoolCard**: Beautiful card design with gradient header and key information
- **SchoolDetailModal**: Full-screen modal with comprehensive school details
- **FilterSidebar**: Rich filtering interface with sliders and checkboxes
- **ComparisonView**: Table-based school comparison

### Utility Components

- **QuickFilters**: Reusable filter badge component
- **EmptyState**: Contextual empty state with actions
- **LoadingSkeleton**: Skeleton loader for better perceived performance
- **MobileFilters**: Mobile-optimized filter modal

## 🎨 Design System

### Colors

- **Primary (Brand)**: Blue palette (#3c82e8 to #1e469b)
- **Success**: Green tones for positive states
- **Warning**: Yellow/Orange for caution
- **Error**: Red tones for errors
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Headings**: Bold, large sizes for hierarchy
- **Body**: Regular weight, comfortable reading size
- **Labels**: Semibold, smaller sizes for form labels

### Spacing

- Consistent 4px-based spacing system
- Generous whitespace for clarity
- Compact mobile layouts

## 🔐 Environment Variables

Create a `.env.local` file with:

```env
API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://ai.google.dev/)

## 📄 License

This project is private. All rights reserved.

## 🤝 Contributing

This is a personal project. If you have suggestions, feel free to open an issue or contact the maintainer.

## 📧 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Built with ❤️ for parents seeking the best education for their children**
