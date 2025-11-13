# JSON API Endpoints Documentation

## ✅ **API Endpoints Created**

### 1. **Products List API**
- **URL**: `GET /XX_afternoon/products.json`
- **Features**: 
  - Pagination (10 items per page)
  - Search functionality via `?query=KEYWORD`
  - Only shows visible products (`status = 'SHOW'`)
  - Searches across: name, name_french, description, description_french

#### Example Usage:
```
GET /XX_afternoon/products.json
GET /XX_afternoon/products.json?page=2
GET /XX_afternoon/products.json?query=apple
GET /XX_afternoon/products.json?query=apple&page=2
```

#### Response Format:
```json
{
  "data": [
    {
      "name": {
        "en": "Organic Apple Juice",
        "fr": "Jus de pomme biologique"
      },
      "description": {
        "en": "Description in English",
        "fr": "Description en français"
      },
      "gtin": "03000123456789",
      "brand": "Green Orchard",
      "countryOfOrigin": "France",
      "weight": {
        "gross": 1.1,
        "net": 1.0,
        "unit": "L"
      },
      "company": {
        "companyName": "Euro Expo",
        "companyAddress": "Boulevard de l'Europe, 69680 Chassieu, France",
        "companyTelephone": "+33 1 41 56 78 00",
        "companyEmail": "mail.customerservice.hdq@example.com",
        "owner": {
          "name": "Benjamin Smith",
          "mobileNumber": "+33 6 12 34 56 78",
          "email": "b.smith@example.com"
        },
        "contact": {
          "name": "Marie Dubois",
          "mobileNumber": "+33 6 98 76 54 32",
          "email": "m.dubois@example.com"
        }
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "per_page": 10,
    "total_items": 45,
    "next_page_url": "http://localhost/XX_afternoon/products.json?page=2",
    "prev_page_url": null
  }
}
```

### 2. **Single Product API**
- **URL**: `GET /XX_afternoon/products/[GTIN].json`
- **Features**:
  - Returns individual product by GTIN
  - Returns 404 for non-existent or hidden products
  - Includes complete company information

#### Example Usage:
```
GET /XX_afternoon/products/03000123456789.json
```

#### Response Format:
Same as individual product object in the list API (without pagination wrapper).

### 3. **Company API** (Bonus)
- **URL**: `GET /XX_afternoon/companies/[ID].json`
- **Features**: Get individual company information

## 🔧 **Implementation Details**

### Database Integration:
- Uses existing MySQL database structure
- Joins products with companies table
- Proper error handling and validation
- SQL injection protection

### Security Features:
- GTIN validation using existing `validateGTIN` function
- Hidden products return 404 (not accessible via JSON API)
- Proper HTTP status codes
- Input sanitization

### Search Functionality:
- Case-insensitive search using SQL LIKE
- Searches across multiple fields:
  - Product name (English)
  - Product name (French) 
  - Description (English)
  - Description (French)

### Pagination:
- 10 items per page (configurable)
- Complete pagination metadata
- Dynamic URL generation for next/prev pages
- Query parameter preservation in pagination URLs

## 📁 **File Structure**
```
src/app/XX_afternoon/
├── products.json/
│   ├── route.ts              # Products list API
│   └── [gtin]/
│       └── route.ts          # Single product API
└── companies.json/
    └── [id]/
        └── route.ts          # Company API (bonus)
```

## 🎯 **API Compliance**
All endpoints follow the exact JSON structure specified in the requirements:
- ✅ Products list with pagination
- ✅ Single product by GTIN
- ✅ Search functionality via query parameter
- ✅ 404 for non-existent/hidden products
- ✅ Complete company information embedded in products
- ✅ Proper HTTP status codes and error handling