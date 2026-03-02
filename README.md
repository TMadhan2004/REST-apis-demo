# REST APIs Demo - Feedback System

A Node.js Express API with Firebase Firestore integration for managing feedback data.

## Features

- **CRUD Operations**: Create, Read, Update, Delete feedback entries
- **Firebase Firestore Integration**: Secure database backend
- **Input Validation**: Validates feedback data (name, age, rating 1-10, description ≤50 words)
- **CORS Support**: Cross-origin requests enabled for frontend integration
- **Error Handling**: Comprehensive error responses

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedbacks` | Create a new feedback entry |
| GET | `/feedbacks` | Get all feedback entries |
| GET | `/feedbacks/:id` | Get a specific feedback entry |
| PUT | `/feedbacks/:id` | Update a feedback entry |
| DELETE | `/feedbacks/:id` | Delete a feedback entry |

## Data Schema

```json
{
  "id": "string",
  "name": "string",
  "age": "number",
  "rating": "number (1-10)",
  "description": "string (≤50 words)"
}
```

## Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database in your project
3. Go to Project Settings → Service accounts
4. Click "Generate new private key" and download the JSON file
5. Rename the downloaded file to match your project (e.g., `rest-hosting-firebase-adminsdk-xxxxx.json`)
6. Place the file in the project root directory

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Usage Examples

### Create Feedback

```bash
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "name": "John Doe",
    "age": 25,
    "rating": 9,
    "description": "Excellent service and very helpful staff."
  }'
```

### Get All Feedbacks

```bash
curl http://localhost:3000/feedbacks
```

### Get Specific Feedback

```bash
curl http://localhost:3000/feedbacks/1
```

### Update Feedback

```bash
curl -X PUT http://localhost:3000/feedbacks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 26,
    "rating": 8,
    "description": "Good service but could be faster."
  }'
```

### Delete Feedback

```bash
curl -X DELETE http://localhost:3000/feedbacks/1
```

## Frontend Integration

This API is designed to work with any frontend framework (React, Vue, Angular, etc.). The CORS configuration allows requests from:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Example JavaScript fetch:

```javascript
async function submitFeedback(feedback) {
  const response = await fetch('http://localhost:3000/feedbacks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  return await response.json();
}
```

## Security Notes

- **Never commit** the Firebase service account JSON file to version control
- The `.gitignore` file is configured to exclude all Firebase service account files
- Keep your service account key secure and only share it with trusted team members

## Project Structure

```
├── index.js              # Main Express server file
├── firebase.js           # Firebase Firestore configuration
├── package.json          # Node.js dependencies and scripts
├── .gitignore           # Git ignore rules (excludes sensitive files)
├── README.md            # This file
└── service-account.json # Firebase service account (NOT in git)
```

## Dependencies

- **express**: Web framework for Node.js
- **firebase-admin**: Firebase Admin SDK for server-side Firebase access
- **cors**: CORS middleware for Express

## License

ISC
