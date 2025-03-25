# Questionnaire Builder App

A modern web application for creating, editing, and managing questionnaires. Built with React, TypeScript, and Node.js.

## Features

- Create and edit questionnaires with various question types:
  - Text input
  - Single choice (radio)
  - Multiple choice (checkbox)
- Real-time form validation
- Responsive design for all devices
- User-friendly interface with intuitive navigation
- Secure data storage with MongoDB
- RESTful API architecture

## Tech Stack

### Frontend
- React 18
- TypeScript
- Redux Toolkit for state management
- React Router for navigation
- CSS Modules for styling
- Tailwind CSS for utility classes

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/questionnaire-builder-app.git
cd questionnaire-builder-app
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development servers:

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
questionnaire-builder-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and slices
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # Global styles
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Mongoose models
    │   ├── routes/       # API routes
    │   ├── services/     # Business logic
    │   └── types/        # TypeScript types
    └── package.json
```

## API Endpoints

- `GET /api/questionnaires` - Get all questionnaires
- `GET /api/questionnaires/:id` - Get a specific questionnaire
- `POST /api/questionnaires` - Create a new questionnaire
- `PUT /api/questionnaires/:id` - Update a questionnaire
- `DELETE /api/questionnaires/:id` - Delete a questionnaire

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing frontend library
- MongoDB team for the powerful database
- All contributors who help improve this project 