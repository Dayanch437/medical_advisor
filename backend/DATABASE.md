# 📊 Databaza integrasiýasy

Bu proýektde SQLite databazasy ulanylýar, hassalaryň soraglary we AI jogaplary saklamak üçin.

## 📁 Databaza gurluşy

### Tablitsalar

#### 1. `medical_queries` - Müşderileriň soraglary
- `id` (Integer, Primary Key) - Ýazgyň ID-si
- `question` (Text) - Hassanyň soragy
- `age` (Integer, nullable) - Hassanyň ýaşy
- `gender` (String, nullable) - Jynsy ('erkek' ýa-da 'aýal')
- `created_at` (DateTime) - Sorag berlen sene/wagt

#### 2. `ai_responses` - AI jogaplary
- `id` (Integer, Primary Key) - Ýazgyň ID-si
- `query_id` (Integer, Foreign Key) - Haýsy soraga degişli
- `advice` (Text) - AI-den gelen maslahat
- `model_used` (String) - Ulanylan AI model ady
- `created_at` (DateTime) - Jogap berlen sene/wagt

## 🔌 API Endpoints

### 1. Sorag bermek we databaza saklamak
```http
POST /advice
```

Bu endpoint sorag kabul edýär, AI-den jogap alýar we ikisini hem databaza saklaýar.

**Request:**
```json
{
  "question": "Kelläm agyrýar we gyzzyrma bar",
  "age": 30,
  "gender": "erkek"
}
```

**Response:**
```json
{
  "advice": "AI maslahaty...",
  "disclaimer": "Duýduryş haty..."
}
```

### 2. Ähli taryhy almak
```http
GET /history?limit=50&offset=0
```

**Parameters:**
- `limit` (default: 50) - Näçe ýazgy görkermeli
- `offset` (default: 0) - Haýsy ýazgydan başlamaly

**Response:**
```json
{
  "total": 100,
  "queries": [
    {
      "id": 1,
      "question": "Kelläm agyrýar",
      "age": 30,
      "gender": "erkek",
      "advice": "AI maslahaty...",
      "model_used": "gemini-2.5-flash",
      "created_at": "2025-11-29T10:30:00"
    }
  ]
}
```

### 3. Belli bir soragy ID boýunça almak
```http
GET /history/{query_id}
```

**Response:**
```json
{
  "id": 1,
  "question": "Kelläm agyrýar",
  "age": 30,
  "gender": "erkek",
  "advice": "AI maslahaty...",
  "model_used": "gemini-2.5-flash",
  "created_at": "2025-11-29T10:30:00"
}
```

## 🧪 Test etmek

### 1. Sorag bermek
```bash
curl -X POST http://localhost:8000/advice \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Kelläm agyrýar we gyzzyrma bar",
    "age": 30,
    "gender": "erkek"
  }'
```

### 2. Taryhy görmek
```bash
# Ähli soraglary görmek
curl http://localhost:8000/history

# Ilkinji 10 soragy görmek
curl http://localhost:8000/history?limit=10

# 20-nji ýazgydan başlap 10 soragy görmek
curl http://localhost:8000/history?limit=10&offset=20
```

### 3. Bir soragy ID boýunça almak
```bash
curl http://localhost:8000/history/1
```

## 📂 Databaza faýly

Databaza faýly awtomat döredilýär:
- **Location**: `backend/medical_advice.db`
- **Type**: SQLite
- **Created**: Ilkinji gezek programma işe girzilende

## 🔧 Databaza Management

### SQLite bilen databazany görmek

```bash
cd backend
sqlite3 medical_advice.db

# Tablitsalary görmek
.tables

# Ähli soraglary görmek
SELECT * FROM medical_queries;

# Ähli jogaplary görmek
SELECT * FROM ai_responses;

# Sorag we jogap bilelikde
SELECT q.question, q.age, q.gender, r.advice, r.model_used, q.created_at
FROM medical_queries q
JOIN ai_responses r ON q.id = r.query_id
ORDER BY q.created_at DESC
LIMIT 10;

# Çykmak
.exit
```

## 🔐 Howpsuzlyk

- Databaza lokal faýl, internet arkaly elýeterli däl
- Hassalaryň maglumatlary gizlinlik bilen saklanýar
- `.gitignore` faýlynda `*.db` goşulyp, databaza git-e goşulmaýar

## 📊 Statistika almak

Databazadan statistika çykarmak üçin SQL soraglar:

```sql
-- Jemi soraglaryň sany
SELECT COUNT(*) as total_queries FROM medical_queries;

-- Soňky 7 günde berlen soraglaryň sany
SELECT COUNT(*) as recent_queries 
FROM medical_queries 
WHERE created_at >= datetime('now', '-7 days');

-- Iň köp ulanylan AI model
SELECT model_used, COUNT(*) as usage_count 
FROM ai_responses 
GROUP BY model_used 
ORDER BY usage_count DESC;

-- Ortaça ýaş
SELECT AVG(age) as average_age 
FROM medical_queries 
WHERE age IS NOT NULL;

-- Jyns boýunça paýlaşma
SELECT gender, COUNT(*) as count 
FROM medical_queries 
WHERE gender IS NOT NULL 
GROUP BY gender;
```

## 🚀 Migration we Backup

### Backup döretmek
```bash
# Databazany backup etmek
cp backend/medical_advice.db backend/medical_advice_backup_$(date +%Y%m%d).db

# ýa-da SQL dump almak
sqlite3 backend/medical_advice.db .dump > backup.sql
```

### Backup-dan dikeltmek
```bash
# Faýldan dikeltmek
cp backend/medical_advice_backup_20251129.db backend/medical_advice.db

# SQL dump-dan dikeltmek
sqlite3 backend/medical_advice.db < backup.sql
```

## 🛠️ Troubleshooting

### Databaza tapylmady
Eger databaza faýly tapylmasa, programma täzeden döredýär. Programany täzeden işe giriziň:
```bash
cd backend
python main.py
```

### Databaza ýatlamak
Eger databazany täzeden başlamak gerek bolsa:
```bash
rm backend/medical_advice.db
python backend/main.py  # Täze databaza dörediler
```

### Databaza migration
Eger databaza strukturasyny üýtgetmeli bolsaňyz, Alembic ulanyp bilersiňiz:
```bash
pip install alembic
alembic init alembic
# migration skriptlerini döretmek we işletmek
```
