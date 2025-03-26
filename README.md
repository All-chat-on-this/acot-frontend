# ACOT - All Chat On This

ACOT is a highly customizable AI API platform that allows you to interact with various AI models through a unified interface.

## Features

- 🎨 Beautiful UI with multiple themes, including a signature dreamlikeColor effect
- 🔧 Customizable API configuration to connect to any AI service
- 🧠 Thought chain visibility to see the AI's thinking process (with compatible models)
- 🌐 Easy to use interface for creating and managing conversations
- 🌍 Internationalization support with multiple languages (English, Chinese)

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd acot-frontend
   yarn install
   ```

3. Start the development server:
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register or Login** - Create an account or use the demo credentials
2. **Configure an API** - Set up your API connection with your provider's key
3. **Start a Conversation** - Begin chatting with your AI model of choice

## Internationalization

ACOT supports multiple languages:

- English (default)
- Chinese (简体中文)

The application will automatically detect your browser's language settings. You can also manually switch languages using the language selector in the header.

### Adding New Languages

To add a new language:

1. Create a new translation file in `src/i18n/locales/[language-code].ts`
2. Add the language to the i18n configuration in `src/i18n/i18n.ts`
3. Update the language switcher component to include the new language

## Technologies Used

- React 19
- TypeScript
- Styled Components
- Zustand for state management
- React Router v6
- i18next for internationalization

## License

This project is licensed under the MIT License - see the LICENSE file for details.
