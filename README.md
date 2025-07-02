# 🧠 Avnam AI Memo

> Transform your web browsing into an intelligent knowledge base with AI-powered content capture and chat

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![Anthropic Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-FF6B35?style=flat-square)](https://anthropic.com)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-34A853?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)

Avnam AI Memo is a Chrome extension that revolutionizes how you interact with web content. Capture any web content, organize it intelligently with AI-powered tags, and have natural conversations with your collected knowledge.

---

## ✨ Features

![Avnam AI Memo in Action](images/web-memo-workflow.png)
*See Avnam AI Memo in action: capture, organize, and chat with your web content*

### 🎯 **Smart Content Capture**
- **One-click capture**: Highlight and save any content from web pages
- **Intelligent processing**: AI automatically extracts titles, summaries, and structured data
- **Cross-origin support**: Works on any website with robust content extraction
- **Visual feedback**: Real-time highlighting and status updates

### 🏷️ **AI-Powered Organization**
- **Smart tagging**: 70+ predefined categories with custom icons and colors
- **Hierarchical structure**: Organize memos with nested tag systems  
- **Auto-categorization**: AI suggests relevant tags based on content
- **Visual customization**: Color-coded tags with emoji and icon support

### 💬 **Conversational AI Chat**
- **Context-aware conversations**: Chat with your memos using filtered context
- **Citation system**: AI responses include references to source memos
- **Tag-based filtering**: Focus conversations on specific topics or categories
- **Export functionality**: Save chat history and insights

### 🔄 **Seamless Sync & Storage**
- **Cross-device sync**: Your memos available across all Chrome installations
- **Local-first**: Fast access with local storage, cloud backup
- **Data integrity**: JSON validation and automatic backup systems
- **Export options**: Download your data anytime

### 🎨 **Modern Interface**
- **Side panel design**: Integrated Chrome side panel experience
- **Responsive UI**: Clean, modern interface built with Tailwind CSS
- **Real-time updates**: Instant status feedback and smooth animations
- **Accessibility**: Keyboard shortcuts and screen reader support

---

## 🚀 Quick Start

### Installation

1. **Download** the extension files
2. **Build** the extension:
   ```bash
   npm install
   npm run build
   ```
3. **Load** in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

### Setup

1. **API Key**: Get your [Anthropic API key](https://console.anthropic.com/) 
2. **Configuration**: Enter your API key in the extension settings
3. **Ready to go**: Start capturing content and chatting with AI!

---

## 📖 User Guide

![Avnam AI Memo Workflow](images/web-memo-workflow.png)
*Complete workflow: From content capture to AI-powered organization and chat*

### Capturing Content

1. **Navigate** to any webpage
2. **Open** the side panel (click the extension icon)
3. **Click** "Capture Content" to enter highlight mode
4. **Select** any text, image, or element on the page
5. **Watch** as AI processes and organizes your content

### Organizing with Tags

- **Auto-tagging**: AI suggests relevant tags for each memo
- **Custom tags**: Create your own categories with colors and icons
- **Tag management**: Edit, merge, or delete tags from the settings
- **Filtering**: Use tags to filter memos and chat context

### AI Chat Features

1. **Filter context**: Select tags to focus your conversation
2. **Ask questions**: Query your knowledge base naturally
3. **Get citations**: AI responses reference specific memos
4. **Export chats**: Save conversations for future reference

### Data Management

- **View all memos**: Browse your captured content chronologically
- **Search & filter**: Find specific content using tags or keywords
- **Export data**: Download your memos and chats as JSON
- **Backup**: Automatic sync keeps your data safe

---

## 🛠️ Technical Architecture

### Core Components

- **Background Service Worker**: Handles API communication and data processing
- **Content Scripts**: Manages web page content capture and highlighting
- **Side Panel Interface**: Primary user interface for memo and chat management
- **Storage System**: Chrome storage.local/sync for data persistence

### AI Integration

- **Anthropic Claude API**: Powers content processing and chat functionality
- **Token optimization**: Efficient content chunking for API limits
- **Structured extraction**: Automatic title, summary, and metadata generation
- **Cost tracking**: Built-in token counting and usage estimation

### Security & Privacy

- **Local-first**: Content stored locally in Chrome storage
- **Secure API**: Encrypted communication with Anthropic
- **No tracking**: Zero analytics or user behavior tracking
- **CSP compliance**: Strict Content Security Policy implementation

---

## 🗺️ Roadmap

### 🎯 **v1.1 - Enhanced Intelligence** *(Q3 2024)*
- [ ] **Advanced search**: Semantic search across memo content
- [ ] **Smart summaries**: AI-generated daily/weekly content digests  
- [ ] **Related content**: Automatic linking of similar memos
- [ ] **Bulk operations**: Mass tagging and memo management

### 🎯 **v1.2 - Collaboration Features** *(Q4 2024)*
- [ ] **Shared collections**: Collaborate on memo collections
- [ ] **Team workspaces**: Multi-user organization features
- [ ] **Export formats**: PDF, Markdown, and presentation exports
- [ ] **Integration APIs**: Connect with note-taking apps

### 🎯 **v1.3 - Advanced AI** *(Q1 2025)*
- [ ] **Multiple AI providers**: Support for OpenAI, Google, and other LLMs
- [ ] **Custom prompts**: User-defined processing templates
- [ ] **Auto-research**: AI-powered content enrichment
- [ ] **Visual content**: OCR and image analysis capabilities

### 🎯 **v1.4 - Ecosystem Integration** *(Q2 2025)*
- [ ] **Browser sync**: Firefox and Safari extensions
- [ ] **Mobile app**: iOS and Android companion apps
- [ ] **Desktop app**: Standalone application for power users
- [ ] **Web interface**: Access your memos from any device

### 🔮 **Future Vision**
- **Knowledge graphs**: Visual relationship mapping between memos
- **Automated workflows**: Trigger actions based on content patterns
- **Personal AI assistant**: Proactive content suggestions and insights
- **Enterprise features**: SSO, admin controls, and compliance tools

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/avnam-ai-memo.git

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome for testing
# Follow the installation instructions above
```

### Testing

```bash
# Run tests (when available)
npm test

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** for the powerful Claude AI API
- **Chrome Extensions Team** for the excellent Manifest V3 platform
- **Open Source Community** for inspiration and tools

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/avnam-ai-memo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/avnam-ai-memo/discussions)
- **Email**: support@avnam.ai

---

<div align="center">

**⭐ Star this repo if Avnam AI Memo helps your productivity!**

Made with ❤️ by the Avnam team

</div>
