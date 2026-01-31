# Contributing to Smart College Canteen Management System

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and considerate
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards others

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- A clear description of the feature
- Why this feature would be useful
- Examples of how it would work
- Any potential drawbacks

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/codewith-lionel/canteen-mamgement.git
   cd canteen-mamgement
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Write clear, commented code
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes

## Development Setup

1. Install dependencies:
   ```bash
   npm run install-all
   # or use the setup script
   ./setup.sh  # Linux/Mac
   setup.bat   # Windows
   ```

2. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### Backend
- Use async/await for asynchronous operations
- Always handle errors properly
- Validate user input
- Use middleware for common operations
- Keep routes clean and focused

### Frontend
- Use Tailwind CSS for styling
- Keep components small and focused
- Use PropTypes or TypeScript for type checking (if added)
- Handle loading and error states
- Make UI responsive

## Testing

Before submitting a PR:
1. Test all affected features manually
2. Ensure no console errors
3. Test on different screen sizes
4. Verify API endpoints work correctly
5. Test real-time updates (Socket.io)

## Project Structure

```
canteen-management-system/
├── backend/
│   ├── config/          # Database and configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Main server file
├── frontend/
│   └── src/
│       ├── components/  # React components
│       ├── context/     # React context
│       └── utils/       # Utility functions
├── API_DOCUMENTATION.md # API documentation
└── README.md           # Main documentation
```

## Adding New Features

### Adding a New Route
1. Create route file in `backend/routes/`
2. Define routes with proper HTTP methods
3. Add authentication middleware if needed
4. Import and use in `server.js`
5. Document in API_DOCUMENTATION.md

### Adding a New Component
1. Create component file in appropriate directory
2. Follow existing component patterns
3. Use Tailwind CSS for styling
4. Add to routing in App.jsx if needed
5. Update documentation

### Adding a New Model
1. Create model file in `backend/models/`
2. Define schema with proper validation
3. Add indexes if needed
4. Export the model
5. Update seed script if applicable

## Pull Request Checklist

Before submitting your PR, ensure:
- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] New code is commented where necessary
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] No console.log statements (unless for debugging purposes with comments)
- [ ] No sensitive information (API keys, passwords) in code

## Areas for Contribution

Here are some areas where contributions would be especially valuable:

### High Priority
- [ ] Add unit tests for backend routes
- [ ] Add integration tests
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Improve error handling

### Medium Priority
- [ ] Add email/SMS notifications
- [ ] Implement order history search
- [ ] Add more detailed analytics
- [ ] Create mobile app version
- [ ] Add print receipt functionality

### Enhancement Ideas
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Feedback and rating system
- [ ] Inventory management
- [ ] Employee management
- [ ] Custom report generation
- [ ] Integration with other payment methods

## Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Check existing issues and documentation
- Review the code and comments

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!
