# School Data - Parklands/Blouberg Area

This directory contains scraped data for special needs schools in the Parklands and Blouberg area of Cape Town, South Africa.

## 📁 Directory Structure

```
school-data/
├── schools_parklands_blouberg.csv  # Main data file with all school information
├── fee-pdfs/                        # Tuition fee PDF documents
│   ├── Shelanti_2025_Fee_Structure.pdf
│   └── Blouberg_International_2023_Fees.pdf
└── README.md                        # This file
```

## 📊 CSV Data Fields

The `schools_parklands_blouberg.csv` file contains the following columns:

| Field | Description |
|-------|-------------|
| School Name | Official name of the school |
| Address | Full physical address |
| Phone | Contact phone number(s) |
| Email | Primary contact email |
| Website | School's official website URL |
| Distance from Parklands (km) | Approximate distance from Parklands center |
| Tuition Fee Range (Annual) | Annual tuition fees in South African Rands |
| Tuition Fee Link | URL to fee structure page or PDF |
| PDF Downloaded | Whether fee PDF has been downloaded (Yes/No) |
| Grade Range | Grades/years offered (e.g., "Grade 1-7") |
| Special Needs Programs | Comma-separated list of programs offered |
| ADHD Support | Whether ADHD support is explicitly offered (Yes/No/Limited) |
| Autism Support | Whether Autism support is explicitly offered (Yes/No/Limited) |
| On-Site Therapists | Therapist availability (Yes/No/Limited) |
| IEP/ISP Offered | Individual Education/Support Plans offered (Yes/No/Limited) |
| Sensory Facilities | Sensory-friendly facilities available (Yes/No/Limited) |
| Educational Approach | Type of educational methodology used |
| Brief Description | 2-3 sentence summary of the school |
| Enrollment Status | Current enrollment status (Open/Waitlist/Closed) |

## 🏫 Schools Included

### 1. **Shelanti Private School** (Parklands)
- **Location**: 24 Stepney Road, Parklands
- **Distance**: 0 km (in Parklands)
- **Specialization**: Remedial education
- **PDF**: ✅ Downloaded (2025 Fee Structure)

### 2. **Kensio House Therapeutic Academy** (Parklands)
- **Location**: Corner Dorothea Drive and Cedar Crescent, Parklands
- **Distance**: 0.5 km
- **Specialization**: Cambridge-accredited therapeutic academy
- **PDF**: ❌ Not available online - Contact school

### 3. **Blouberg International School** (Parklands)
- **Location**: 74 Ringwood Drive, Parklands
- **Distance**: 1 km
- **Specialization**: International education (Cambridge)
- **PDF**: ✅ Downloaded (2023 Fees)

### 4. **Blaauwberg Rise Therapy & Learning Centre** (Bloubergrant)
- **Location**: 7 Raven Street, Bloubergrant
- **Distance**: 2 km
- **Specialization**: Early intervention (ages 2-6) and Gr R-3
- **PDF**: ❌ Not available online - Contact school

### 5. **Oakley House Preparatory School** (Plumstead)
- **Location**: 99 Main Road, Plumstead
- **Distance**: 15 km
- **Specialization**: Learning difficulties support
- **PDF**: ❌ Not available online - Contact school

### 6. **Oakley House High School** (Diep River)
- **Location**: 68 Myburgh Road, Diep River
- **Distance**: 16 km
- **Specialization**: High school with alternative pathways
- **PDF**: ❌ Not available online - Contact school

## 🔍 Data Collection Methodology

### Sources
- Official school websites
- Google Search for school listings
- Connecting Kidz directory
- Rainbow Kids directory
- School fee structure PDFs

### Tools Used
- **FireCrawl MCP**: Web scraping for school information
- **Manual verification**: Cross-checking data accuracy

### Data Collection Date
- **Collected**: October 25, 2025
- **Fee Information**: 2023-2025 (varies by school)

## 📝 Notes

### Tuition Fees
- ✅ **Verified fees available**: Blouberg International School (R52,478/year for 2025)
- ⚠️ **Contact required**: Most schools require direct contact for fee information
- 📄 **PDFs downloaded**: 2 schools (Shelanti, Blouberg International)

### Distance Calculations
- Distances are approximate from Parklands center
- Calculated using general geographic location
- For precise distances, use mapping applications

### Data Accuracy
- All information scraped from official sources (October 2025)
- Fees may change annually - verify with schools directly
- Enrollment status may change - contact schools for current availability

## 🔄 Next Steps

1. **Contact schools without fee PDFs** to request current fee structures
2. **Download additional fee PDFs** as they become available
3. **Verify enrollment status** by calling schools directly
4. **Update distances** with precise measurements using Google Maps API
5. **Add more schools** from surrounding areas if needed

## 💡 Usage in Application

This CSV data can be imported into the School Finder application to:
- Populate the school database
- Display school cards with accurate information
- Link to fee PDFs in school detail modals
- Filter schools by location and programs
- Compare schools side-by-side

## 📧 Contact Information Updates

Schools should be contacted directly for:
- Current enrollment availability
- Updated fee structures
- Program changes
- Visit scheduling
- Application procedures

## ⚠️ Disclaimer

This data is provided for informational purposes only. All information should be verified directly with the schools. Tuition fees, programs, and availability are subject to change without notice.

---

**Last Updated**: October 25, 2025  
**Data Compiled By**: School Finder Development Team  
**Next Review Date**: January 2026

