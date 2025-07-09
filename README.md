# Quizmodoro 🍅📚

An AI-powered productivity app that combines the Pomodoro technique with personalized quizzes using OpenAI API. Built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Pomodoro Timer**: Customizable work/break intervals with visual progress tracking
- **AI-Generated Quizzes**: Personalized questions across 10+ learning topics
- **Firebase Authentication**: Secure Google sign-in with user profiles
- **Progress Tracking**: Detailed statistics and achievement system
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode Support**: Automatic theme switching based on system preferences

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **AI Integration**: OpenAI API (for quiz generation)
- **Database**: Firebase Firestore (for user data)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- OpenAI API key (optional for demo)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quizmodoro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Get your Firebase config

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
quizmodoro/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main dashboard
│   ├── components/
│   │   ├── PomodoroTimer.tsx    # Timer component
│   │   ├── QuizSection.tsx      # Quiz interface
│   │   ├── TopicSelector.tsx    # Topic selection
│   │   └── ProgressStats.tsx    # User statistics
│   └── lib/
│       └── firebase.ts          # Firebase configuration
├── public/
│   └── default-avatar.svg       # Default user avatar
└── package.json
```

## Features in Detail

### Pomodoro Timer

- 25-minute work sessions with 5-minute breaks
- Long breaks every 4 pomodoros
- Visual progress circle with color-coded phases
- Start, pause, reset, and skip controls
- Session statistics tracking

### Quiz System

- 8 different learning topics
- Multiple choice questions with explanations
- Real-time scoring and feedback
- Progress tracking per topic
- Mock questions included for demo

### User Experience

- Clean, modern interface with smooth animations
- Responsive design for mobile and desktop
- Dark mode support
- Achievement system for motivation
- Detailed progress statistics

## Customization

### Adding New Topics

Edit `src/components/TopicSelector.tsx` to add new quiz topics:

```typescript
const topics = [
  // ... existing topics
  {
    id: "new-topic",
    name: "New Topic",
    description: "Description of the topic",
    icon: "🎯",
    color: "from-purple-500 to-pink-500",
  },
];
```

### Timer Settings

Modify the default timer settings in `src/components/PomodoroTimer.tsx`:

```typescript
const [settings, setSettings] = useState<TimerSettings>({
  work: 25, // Work duration in minutes
  shortBreak: 5, // Short break duration
  longBreak: 15, // Long break duration
  longBreakInterval: 4, // Pomodoros before long break
});
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Pomodoro Technique by Francesco Cirillo
- OpenAI for AI-powered quiz generation
- Firebase for authentication and data storage
- Tailwind CSS for beautiful styling
- Next.js team for the amazing framework

---

Built with ❤️ for productive learning
