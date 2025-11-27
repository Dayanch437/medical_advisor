# 🏥 Türkmen Lukmançylyk Maslahat API

Gemini AI ulanyp, türkmen dilinde lukmançylyk maslahat berýän FastAPI programmasy.

## ⚠️ MÖHÜM DUÝDURYŞ

Bu programma diňe maglumat maksady bilen döredildi we hakyky lukmançylyk bejergisini ýa-da diagnozyny çalyşmaýar. Hassalyk ýagdaýynda HÖKMANY SURATDA ýerli lukmana ýa-da keselhanä ýüz tutuň.

## 🚀 Aýratynlyklar

- ✅ Türkmen dilinde doly goldaw
- 🤖 Google Gemini AI bilen integrasiýa
- 🔒 Howpsuz we ygtybarly API
- 📊 RESTful API dizaýny
- 📝 Awtomatik dokumentasiýa (Swagger UI)
- ⚡ Çalt we netijeli

## 📋 Talablar

- Python 3.8+
- Google Gemini API açary

## 🛠️ Gurnama

### 1. Repozitoriýany klonlamak

```bash
cd /home/hack-me-if-you-can/project_DIPLOM/medical_suggestions
```

### 2. Wirtual gurşawy döretmek

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# Windows üçin: venv\Scripts\activate
```

### 3. Baglamalary gurmak

```bash
pip install -r requirements.txt
```

### 4. Environment üýtgeýjilerini sazlamak

`.env.example` faýlyny `.env` adyna göçüriň we Gemini API açaryňyzy goşuň:

```bash
cp .env.example .env
```

`.env` faýlyny redaktirläň:

```env
GEMINI_API_KEY=siziň_gemini_api_açaryňyz
PORT=8000
HOST=0.0.0.0
```

### 5. Gemini API açary almak

1. [Google AI Studio](https://makersuite.google.com/app/apikey) giriň
2. API açar dörediň
3. Açary `.env` faýlyna goşuň

## 🏃 Işletmek

### Development režiminde

```bash
python main.py
```

ýa-da

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production režiminde

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Server işe başlandan soň, şu salgydan girip bilersiňiz:
- API: http://localhost:8000
- Swagger dokumentasiýa: http://localhost:8000/docs
- ReDoc dokumentasiýa: http://localhost:8000/redoc

## 📡 API Endpoint-lar

### 1. Baş sahypa / Ýagdaý barlamak

```http
GET /
```

**Jogap:**
```json
{
  "status": "işleýär",
  "message": "Türkmen Lukmançylyk Maslahat API işleýär",
  "gemini_connected": true
}
```

### 2. Saglygy barlamak

```http
GET /health
```

**Jogap:**
```json
{
  "status": "sagdyn",
  "message": "Ähli hyzmatlar işleýär",
  "gemini_connected": true
}
```

### 3. Lukmançylyk maslahat almak

```http
POST /advice
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",
  "age": 30,
  "gender": "erkek"
}
```

**Jogap:**
```json
{
  "advice": "Siziň alamatlaryňyz umumy sowuklama ýa-da grip alamatlary bolup biler...",
  "disclaimer": "⚠️ MÖHÜM DUÝDURYŞ: Bu maslahat diňe maglumat maksady bilen berilýär..."
}
```

## 💻 Ulanyş mysallary

### cURL bilen

```bash
# Ýagdaý barlamak
curl http://localhost:8000/

# Maslahat soramak
curl -X POST "http://localhost:8000/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",
    "age": 30,
    "gender": "erkek"
  }'
```

### Python bilen

```python
import requests

url = "http://localhost:8000/advice"
data = {
    "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",
    "age": 30,
    "gender": "erkek"
}

response = requests.post(url, json=data)
print(response.json())
```

### JavaScript (fetch) bilen

```javascript
const response = await fetch('http://localhost:8000/advice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'Kelläm agyrýar we gyzzyrma bar, näme etmeli?',
    age: 30,
    gender: 'erkek'
  })
});

const data = await response.json();
console.log(data);
```

## 📁 Faýl gurluşy

```
medical_suggestions/
├── main.py              # Esasy FastAPI programmasy
├── models.py            # Pydantic modeller
├── config.py            # Sazlamalar
├── requirements.txt     # Python baglamalary
├── .env                 # Environment üýtgeýjileri (git-de ýok)
├── .env.example         # Environment üýtgeýjiler mysaly
├── .gitignore          # Git ignore faýly
└── README.md           # Dokumentasiýa
```

## 🔧 Sazlamalar

`config.py` faýlynda sazlamalary üýtgedip bilersiňiz:

- `GEMINI_API_KEY`: Google Gemini API açary
- `HOST`: Server host salgysy (default: 0.0.0.0)
- `PORT`: Server porty (default: 8000)

## 🐛 Debugging

Loglar üçin `logging` ulanylýar. Doly log-lary görmek üçin:

```bash
python main.py
```

## 🔐 Howpsuzlyk

- API açarlary git-de saklanmaýar (`.gitignore` bilen goralýar)
- CORS sazlamalary production üçin çäklendirilmeli
- HTTPS ulanyň production-da
- Rate limiting goşmak maslahat berilýär

## 📝 Lisenziýa

Bu taslamа MIT lisenziýasy astynda

## 🤝 Goşant goşmak

Pull request-ler garşylanýar! Uly üýtgeşmeler üçin ilki issue açyň.

## 📧 Habarlaşmak

Soraglaryňyz bar bolsa, issue açyň ýa-da habarlaşyň.

---

**Ýatda saklaň:** Bu programma diňe maglumat maksady bilen döredildi. Hakyky hassalyk ýagdaýynda HÖKMANY SURATDA lukman bilen maslahatlaşyň! 🏥
# medical_advisor
