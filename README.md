# 🏥 Türkmen Lukmançylyk Maslahat (Medical Advisor)# 🏥 Türkmen Lukmançylyk Maslahat API



A full-stack AI-powered medical advice application in Turkmen language, built with FastAPI (backend) and React (frontend), using Google Gemini AI.Gemini AI ulanyp, türkmen dilinde lukmançylyk maslahat berýän FastAPI programmasy.



## 🌟 Features## ⚠️ MÖHÜM DUÝDURYŞ



### Backend (FastAPI)Bu programma diňe maglumat maksady bilen döredildi we hakyky lukmançylyk bejergisini ýa-da diagnozyny çalyşmaýar. Hassalyk ýagdaýynda HÖKMANY SURATDA ýerli lukmana ýa-da keselhanä ýüz tutuň.

- 🤖 **AI Integration**: Google Gemini 2.5 Flash for medical advice

- 🗄️ **Database**: SQLite for storing queries and responses## 🚀 Aýratynlyklar

- 🌐 **RESTful API**: Clean, documented API endpoints

- 🇹🇲 **Turkmen Language**: Full support for Turkmen language- ✅ Türkmen dilinde doly goldaw

- ⚠️ **Safety First**: Built-in medical disclaimers- 🤖 Google Gemini AI bilen integrasiýa

- 🔒 Howpsuz we ygtybarly API

### Frontend (React)- 📊 RESTful API dizaýny

- ⚡ **Modern Stack**: React 19 + Vite + Ant Design + Tailwind CSS- 📝 Awtomatik dokumentasiýa (Swagger UI)

- 📱 **Responsive Design**: Works on all devices- ⚡ Çalt we netijeli

- 🎨 **Beautiful UI**: Professional medical interface

- 📊 **History Tracking**: View all past queries and responses## 📋 Talablar

- 🔄 **Real-time**: Instant AI responses with loading states

- Python 3.8+

## 🚀 Quick Start- Google Gemini API açary



### Prerequisites## 🛠️ Gurnama



- Python 3.13+### 1. Repozitoriýany klonlamak

- Node.js 18+

- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))```bash

cd /home/hack-me-if-you-can/project_DIPLOM/medical_suggestions

### Backend Setup```



```bash### 2. Wirtual gurşawy döretmek

# Navigate to project root

cd medical_suggestions```bash

python3 -m venv venv

# Create virtual environmentsource venv/bin/activate  # Linux/Mac

python3 -m venv venv# Windows üçin: venv\Scripts\activate

source venv/bin/activate  # On Windows: venv\Scripts\activate```



# Install dependencies### 3. Baglamalary gurmak

cd backend

pip install -r requirements.txt```bash

pip install -r requirements.txt

# Configure environment```

cp .env.example .env

# Edit .env and add your GEMINI_API_KEY### 4. Environment üýtgeýjilerini sazlamak



# Run the backend`.env.example` faýlyny `.env` adyna göçüriň we Gemini API açaryňyzy goşuň:

python main.py

``````bash

cp .env.example .env

Backend will be available at: **http://localhost:8000**```



### Frontend Setup`.env` faýlyny redaktirläň:



```bash```env

# Navigate to frontend directoryGEMINI_API_KEY=siziň_gemini_api_açaryňyz

cd frontendPORT=8000

HOST=0.0.0.0

# Install dependencies```

npm install

### 5. Gemini API açary almak

# Configure environment

cp .env.example .env1. [Google AI Studio](https://makersuite.google.com/app/apikey) giriň

# Edit .env if needed (default: http://localhost:8000)2. API açar dörediň

3. Açary `.env` faýlyna goşuň

# Run the frontend

npm run dev## 🏃 Işletmek

```

### Development režiminde

Frontend will be available at: **http://localhost:5173**

```bash

## 📁 Project Structurepython main.py

```

```

medical_suggestions/ýa-da

├── backend/

│   ├── main.py              # FastAPI application```bash

│   ├── models.py            # Pydantic modelsuvicorn main:app --reload --host 0.0.0.0 --port 8000

│   ├── config.py            # Configuration```

│   ├── database.py          # Database setup

│   ├── db_models.py         # SQLAlchemy models### Production režiminde

│   ├── requirements.txt     # Python dependencies

│   ├── .env                 # Environment variables```bash

│   └── medical_advice.db    # SQLite database (auto-created)uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

│```

├── frontend/

│   ├── src/Server işe başlandan soň, şu salgydan girip bilersiňiz:

│   │   ├── components/      # React components- API: http://localhost:8000

│   │   ├── services/        # API integration- Swagger dokumentasiýa: http://localhost:8000/docs

│   │   ├── App.jsx          # Main app- ReDoc dokumentasiýa: http://localhost:8000/redoc

│   │   └── main.jsx         # Entry point

│   ├── public/              # Static assets## 📡 API Endpoint-lar

│   ├── package.json         # Dependencies

│   ├── .env                 # Environment variables### 1. Baş sahypa / Ýagdaý barlamak

│   ├── tailwind.config.js   # Tailwind config

│   └── vite.config.js       # Vite config```http

│GET /

├── venv/                    # Python virtual environment```

└── README.md               # This file

```**Jogap:**

```json

## 🔗 API Endpoints{

  "status": "işleýär",

### Health Check  "message": "Türkmen Lukmançylyk Maslahat API işleýär",

```bash  "gemini_connected": true

GET /health}

``````



### Get Medical Advice### 2. Saglygy barlamak

```bash

POST /advice```http

Content-Type: application/jsonGET /health

```

{

  "question": "Kelläm agyrýar",**Jogap:**

  "age": 30,```json

  "gender": "erkek"{

}  "status": "sagdyn",

```  "message": "Ähli hyzmatlar işleýär",

  "gemini_connected": true

### Get History}

```bash```

GET /history?limit=50&offset=0

```### 3. Lukmançylyk maslahat almak



### Get Specific Query```http

```bashPOST /advice

GET /history/{id}Content-Type: application/json

``````



## 🛠️ Technologies**Request Body:**

```json

### Backend{

- **FastAPI** - Modern Python web framework  "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",

- **SQLAlchemy** - ORM for database operations  "age": 30,

- **Pydantic** - Data validation  "gender": "erkek"

- **Google Generative AI** - Gemini API integration}

- **SQLite** - Lightweight database```

- **Uvicorn** - ASGI server

**Jogap:**

### Frontend```json

- **React 19** - UI library{

- **Vite** - Build tool  "advice": "Siziň alamatlaryňyz umumy sowuklama ýa-da grip alamatlary bolup biler...",

- **Ant Design 5** - Component library  "disclaimer": "⚠️ MÖHÜM DUÝDURYŞ: Bu maslahat diňe maglumat maksady bilen berilýär..."

- **Tailwind CSS 3** - Utility CSS}

- **React Router 6** - Routing```

- **Axios** - HTTP client

- **Day.js** - Date formatting## 💻 Ulanyş mysallary



## 📱 Screenshots### cURL bilen



### Home Page```bash

- Hero section with app introduction# Ýagdaý barlamak

- Medical question formcurl http://localhost:8000/

- Real-time AI advice display

- Safety warnings# Maslahat soramak

curl -X POST "http://localhost:8000/advice" \

### History Page  -H "Content-Type: application/json" \

- List of all queries  -d '{

- Pagination    "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",

- Click to view details    "age": 30,

- Metadata (date, age, gender, AI model)    "gender": "erkek"

  }'

## 🔒 Security & Privacy```



- ⚠️ **Disclaimer**: Always includes medical disclaimers### Python bilen

- 🔐 **API Key**: Stored securely in environment variables

- 💾 **Local Storage**: All data stored locally in SQLite```python

- 🌐 **CORS**: Configured for frontend-backend communicationimport requests



## 🌍 Deploymenturl = "http://localhost:8000/advice"

data = {

### Backend Deployment    "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",

    "age": 30,

Can be deployed to:    "gender": "erkek"

- Heroku}

- AWS (EC2, Lambda)

- Google Cloud Runresponse = requests.post(url, json=data)

- DigitalOceanprint(response.json())

- Render```

- Railway

### JavaScript (fetch) bilen

### Frontend Deployment

```javascript

Can be deployed to:const response = await fetch('http://localhost:8000/advice', {

- Vercel  method: 'POST',

- Netlify  headers: {

- GitHub Pages    'Content-Type': 'application/json',

- Cloudflare Pages  },

  body: JSON.stringify({

## 🧪 Testing    question: 'Kelläm agyrýar we gyzzyrma bar, näme etmeli?',

    age: 30,

### Backend    gender: 'erkek'

```bash  })

# Test health endpoint});

curl http://localhost:8000/health

const data = await response.json();

# Test advice endpointconsole.log(data);

curl -X POST http://localhost:8000/advice \```

  -H "Content-Type: application/json" \

  -d '{"question": "Test sorag"}'## 📁 Faýl gurluşy

```

```

### Frontendmedical_suggestions/

```bash├── main.py              # Esasy FastAPI programmasy

# Run linter├── models.py            # Pydantic modeller

npm run lint├── config.py            # Sazlamalar

├── requirements.txt     # Python baglamalary

# Build for production├── .env                 # Environment üýtgeýjileri (git-de ýok)

npm run build├── .env.example         # Environment üýtgeýjiler mysaly

```├── .gitignore          # Git ignore faýly

└── README.md           # Dokumentasiýa

## 🔧 Development```



### Backend Development## 🔧 Sazlamalar

```bash

# Run with auto-reload`config.py` faýlynda sazlamalary üýtgedip bilersiňiz:

uvicorn main:app --reload

- `GEMINI_API_KEY`: Google Gemini API açary

# View logs- `HOST`: Server host salgysy (default: 0.0.0.0)

tail -f logs/app.log- `PORT`: Server porty (default: 8000)

```

## 🐛 Debugging

### Frontend Development

```bashLoglar üçin `logging` ulanylýar. Doly log-lary görmek üçin:

# Run dev server

npm run dev```bash

python main.py

# Build for production```

npm run build

## 🔐 Howpsuzlyk

# Preview production build

npm run preview- API açarlary git-de saklanmaýar (`.gitignore` bilen goralýar)

```- CORS sazlamalary production üçin çäklendirilmeli

- HTTPS ulanyň production-da

## 📝 Environment Variables- Rate limiting goşmak maslahat berilýär



### Backend (.env)## 📝 Lisenziýa

```env

GEMINI_API_KEY=your_api_key_hereBu taslamа MIT lisenziýasy astynda

PORT=8000

HOST=0.0.0.0## 🤝 Goşant goşmak

```

Pull request-ler garşylanýar! Uly üýtgeşmeler üçin ilki issue açyň.

### Frontend (.env)

```env## 📧 Habarlaşmak

VITE_API_URL=http://localhost:8000

```Soraglaryňyz bar bolsa, issue açyň ýa-da habarlaşyň.



## 🤝 Contributing---



1. Fork the repository**Ýatda saklaň:** Bu programma diňe maglumat maksady bilen döredildi. Hakyky hassalyk ýagdaýynda HÖKMANY SURATDA lukman bilen maslahatlaşyň! 🏥

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)# medical_advisor

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Dayanch437**
- GitHub: [@Dayanch437](https://github.com/Dayanch437)
- Repository: [medical_advisor](https://github.com/Dayanch437/medical_advisor)

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model
- [Ant Design](https://ant.design/) - React UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**⚠️ IMPORTANT DISCLAIMER**

This application provides informational medical advice only and is NOT a substitute for professional medical consultation. If you have a medical condition or symptoms, please consult a qualified healthcare provider immediately. In case of emergency, call emergency services right away!

Bu programma diňe maglumat maksady bilen lukmançylyk maslahaty berýär we professional lukmançylyk konsultasiýasynyň ýerini tutmaýar. Eger saglyk ýagdaýyňyz ýa-da alamatlaryňyz bar bolsa, derrew ökde lukman bilen maslahatlaşyň. Gyssagly ýagdaýda derrew tiz kömek çagyryň!
