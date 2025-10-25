# Data Source Toggle Feature

## Overview
The School Finder app now includes a toggle to switch between two data sources:
- **Local Data**: Searches the curated CSV database with 15 verified schools and complete fee information
- **Online Search**: Uses Gemini AI to search the web for schools, enriched with local CSV data

## Features

### Toggle Location
The toggle is located in the header, below the main title. It shows:
- "Local Data" (gray when inactive, white when active)
- Toggle switch (gray for local, green for online)
- "Online Search" (gray when inactive, white when active)

### Local Data Mode (Default)
When **Local Data** is selected:
- Searches only the 15 schools in `schools_parklands_blouberg.csv`
- All fees are accurately displayed from the CSV
- Location field is disabled (not needed for local search)
- Search works on: school names, descriptions, programs, educational approach
- No API calls are made - completely offline capable
- Fast search results

**Use this mode when:**
- You want verified, accurate fee information
- You're looking for schools in the Parklands/Blouberg area
- You want fast, offline-capable search
- You don't need the latest information from the web

### Online Search Mode
When **Online Search** is selected:
- Uses Gemini AI with Google Maps and Google Search
- Can find schools anywhere in South Africa
- Results are enriched with CSV data where available
- Location field is required and enabled
- May find more schools but with varying data completeness
- Requires API key and internet connection

**Use this mode when:**
- You're searching in areas outside the local database
- You want the latest information from school websites
- You need broader coverage across South Africa
- You're okay with potential API usage costs

## Data Files

### CSV Database
Location: `/public/schools_parklands_blouberg.csv`

Contains 15 schools with:
- Complete contact information
- Grade 3 annual and monthly fees
- Special needs programs
- Support services (ADHD, Autism, IEP, therapists)
- Distance from Parklands
- Links to fee PDFs

### Fee PDFs
Location: `/public/fee-pdfs/`

Available fee documents:
- Shelanti_2025_Fee_Structure.pdf
- Blouberg_International_2023_Fees.pdf
- KayDee_Special_Needs_2025_Fees.pdf
- Crossroads_School_2025_Fees.pdf
- Orion_College_Primary_2025_Fees.pdf
- Orion_College_High_School_2025_Fees.pdf
- Browns_School_2025_Fees.txt
- La_Vigne_2025_Fees.txt
- Excelsior_Private_School_2025_Fees.txt
- Via_Nova_School_2025_Fees.txt
- Oakley_House_Prep_2025_Fees.pdf
- Remedial_School_2025_Fees.pdf

## Technical Implementation

### Files Modified
1. **App.tsx**
   - Added `useOnlineData` state (defaults to `false`)
   - Updated `Header` component with toggle
   - Modified `handleSearch` to use either online or local search
   - Updated UI to show appropriate placeholders and hints

2. **csvDataService.ts**
   - Added `searchLocalSchools()` function for keyword-based local search
   - Searches across school name, address, description, approach, and programs

3. **csvParser.ts**
   - Updated CSV column mapping to match actual file structure
   - Changed from "Tuition Fee Range (Annual)" to "Grade 3 Fee Annual/Monthly"
   - Added `formatTuitionRange()` to format fee display
   - Added Oakley House to PDF mapping

### Search Logic

#### Local Search
```typescript
searchLocalSchools(query: string)
```
- Splits query into search terms (min 3 characters)
- Searches across multiple school fields
- Returns matching schools from CSV
- No API calls, instant results

#### Online Search
```typescript
findSchools(prompt: string, location: string)
```
- Calls Gemini API with Google Maps and Search tools
- Enriches results with CSV data via `enrichSchoolsWithCSVData()`
- Returns both schools and grounding sources
- Requires API key and internet

## User Experience

### Default Behavior
- App starts in **Local Data** mode
- Displays 15 schools from CSV on initial load
- No API key required for basic functionality
- All fee information is immediately available

### Switching Modes
- Click the toggle to switch between modes
- UI updates immediately with appropriate hints
- Location field enables/disables based on mode
- Search behavior changes transparently

### Search Examples

**Local Data Mode:**
- "ADHD support" → finds all schools with ADHD support
- "remedial" → finds remedial schools
- "autism" → finds schools with autism programs
- "therapists" → finds schools with on-site therapists

**Online Search Mode:**
- "Special needs schools in Johannesburg"
- "Montessori schools near Sandton"
- "Schools with speech therapy in Cape Town"

## Benefits

1. **Accurate Fees**: Local mode shows verified, current fee information
2. **Fast Search**: No API delays when using local data
3. **Offline Capable**: Local mode works without internet
4. **Flexible**: Can switch to online search for broader coverage
5. **Cost Effective**: Reduces API calls by defaulting to local data
6. **Verified Data**: Local schools have been manually researched and verified

## Future Enhancements

- Add more schools to the CSV database
- Implement location-based filtering in local mode
- Add ability to export search results
- Include parent reviews from CSV
- Add more detailed filtering options
- Support for multiple grade levels in fee display

