# South Africa Localization Summary

## Overview
The Special Needs School Finder has been fully localized for the South African market. All prices, search queries, and content are now focused on South African schools and use South African Rands (R) instead of dollars.

## Changes Made

### 1. **Search Service (geminiService.ts)**
- ✅ Enforces South African school searches only
- ✅ Uses Google Maps + Google Search to find real schools and scrape actual fees
- ✅ Explicitly instructs AI to use Rands (R) and NEVER use dollars ($)
- ✅ Looks for fees on school websites (Fees, Tuition, Admissions pages)
- ✅ Returns "Contact School for Fees" if pricing not publicly available
- ✅ Includes CAPS-based educational approach (South African curriculum)
- ✅ Mentions ISP (Individual Support Plan) as SA alternative to IEP
- ✅ Ensures phone numbers are in South African format

### 2. **Main App (App.tsx)**
- ✅ Updated header: "SA Special Needs School Finder"
- ✅ Updated tagline: "Find the perfect school for your child in South Africa"
- ✅ Changed default location to "Parklands, Cape Town, South Africa"
- ✅ Updated placeholder examples to South African cities
- ✅ Updated search description to mention "across South Africa"

### 3. **Page Title (index.html)**
- ✅ Changed to "SA Special Needs School Finder - Find Schools in South Africa"

### 4. **Filter Components**
**FilterSidebar.tsx & MobileFilters.tsx:**
- ✅ Changed "Tuition Range (per year)" → "Annual Tuition (Rands)"
- ✅ Changed all `$` symbols to `R` for Rands
- ✅ Updated tuition range: R0 - R200,000 (from $0 - $50,000)
- ✅ Updated step size to R5,000 increments (more appropriate for SA pricing)
- ✅ Added "CAPS-based" to educational approach options

### 5. **Utility Functions (schoolHelpers.ts)**
- ✅ Updated `parseTuitionRange()` to handle both R and $ symbols (backward compatible)
- ✅ Changed default max tuition filter: R200,000 (from $50,000)
- ✅ Added comment clarifying South African Rands range

## How Fee Scraping Works

### Before:
```
User Search → Gemini AI → Google Maps (finds locations)
                       → AI estimates/invents fees
```

### After:
```
User Search → Gemini AI → Google Maps (finds real SA schools)
                       → Google Search (finds school websites)
                       → Scrapes fee pages, admissions info
                       → Extracts ACTUAL tuition in Rands
                       → Returns verified data with sources
```

## Search Instructions Given to AI

The AI is now instructed to:

1. **Only search South African schools** in the specified location
2. **Visit each school's official website** to find:
   - Current tuition fees in Rands
   - Special needs programs offered
   - Therapist availability
   - Educational approach
3. **Extract exact pricing** from "Fees", "Tuition", "Admissions", or "Costs" pages
4. **Use format**: "R85,000 - R95,000 per year" or "R7,500 per month"
5. **Never use dollars** - only South African Rands
6. **Return "Contact School for Fees"** if pricing isn't publicly available
7. **Ground responses** in actual sources (shown in "Information Sources")

## Key Features

### Real Fee Data
- Fees are scraped from actual school websites
- Sources are cited so you can verify the information
- Transparent when fees aren't available

### South African Context
- CAPS-based curriculum option
- ISP (Individual Support Plan) mentioned alongside IEP
- South African phone number formats
- Major SA cities in examples (Cape Town, Johannesburg, Sandton)

### Currency Display
- All prices show `R` prefix (e.g., R85,000)
- Filters use Rand ranges (R0 - R200,000)
- Proper number formatting with thousand separators

## Testing

Try these searches to see it in action:
- "Schools for a Grade 3 student with ADHD" in "Sandton, Johannesburg"
- "Remedial schools with speech therapy" in "Cape Town"
- "Montessori schools with small class sizes" in "Pretoria"

## Expected Results

When you perform a search, you should see:
1. **Real South African schools** with accurate locations
2. **Actual tuition fees in Rands** scraped from school websites
3. **Verified program information** from official sources
4. **Source citations** at the bottom showing which websites were used
5. **"Contact School for Fees"** only when fees aren't publicly listed

## Notes

- Search may take slightly longer now (processing real websites)
- More accurate and trustworthy information
- Parents can verify data by clicking source links
- Regional pricing variations are preserved (Cape Town vs Johannesburg, etc.)

