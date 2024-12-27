# Contributing to Competitive Programming Templates

Thank you for your interest in contributing to our VS Code extension! This document provides guidelines and steps for contributing.

## 🌟 Getting Started

### Prerequisites
- Node.js (LTS version)
- Visual Studio Code
- Git

### Setting Up Development Environment
1. Fork the repository
2. Clone your fork:

```bash
    git clone https://github.com/DanielKinnito/competitive-templates.git
```

3. Install dependencies:
```bash
npm install
```

4. Open in VS Code:
```bash
code .
```

## 🏗️ Project Structure
competitive-templates/
├── src/ # Source code
│ ├── extension.ts # Main extension file
│ └── templates/ # Template management
│ ├── templateManager.ts
│ └── snippetManager.ts
├── snippets/ # Language-specific snippets
│ ├── cpp.json
│ └── python.json
└── images/ # Assets
└── cpt-logo.png
```

## 🔧 Development Workflow

1. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test your changes:
   - Press F5 in VS Code to launch extension development host
   - Use "Developer: Reload Window" command to test changes

4. Update documentation if needed:
   - README.md for user-facing changes
   - JSDoc comments for code changes
   - CHANGELOG.md for feature additions

## 📝 Coding Guidelines

### TypeScript Style
- Use meaningful variable names
- Add JSDoc comments for public methods
- Follow existing code formatting
- Use async/await for asynchronous operations

### Commit Messages
Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding/modifying tests
- `chore`: Maintenance tasks

Example:
```
feat(templates): add Java template support
```

## 🧪 Testing

1. Unit Tests:
```bash
npm run test
```

2. Manual Testing:
   - Test template creation
   - Test template loading
   - Test in different languages (C++, Python)
   - Verify snippet generation

## 📦 Building

1. Compile the extension:
```bash
npm run compile
```

2. Package for distribution:
```bash
npm run package
```

## 🚀 Pull Request Process

1. Update CHANGELOG.md with your changes
2. Ensure all tests pass
3. Update documentation if needed
4. Submit PR with detailed description:
   - What changes were made
   - Why changes were needed
   - How to test the changes
   - Screenshots (if applicable)

## 🐛 Bug Reports

When filing an issue:
1. Use the bug report template
2. Include VS Code version
3. Include extension version
4. Provide steps to reproduce
5. Include expected vs actual behavior

## 💡 Feature Requests

When suggesting features:
1. Use the feature request template
2. Explain the use case
3. Describe expected behavior
4. Provide examples if possible

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

- Be respectful
- Use welcoming language
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## 🌐 Getting Help

- Check existing issues and discussions
- Join our community chat
- Contact maintainers
- Read the documentation

## 🎉 Recognition

Contributors will be added to the README.md contributors section.

Thank you for contributing to making competitive programming more accessible!