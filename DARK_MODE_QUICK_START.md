# 🚀 Quick Start - Dark Mode

## For Users

### How to Toggle Theme
1. Look for the **bulb icon (💡)** in the top-right header
2. Click the icon to switch themes
3. Your preference is **automatically saved**

### Theme Indicators
- **Light Mode**: 💡 Outline bulb icon
- **Dark Mode**: 🌟 Yellow filled bulb icon

---

## For Developers

### Import Theme Hook
```jsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌟 Dark' : '💡 Light'}
    </button>
  );
}
```

### Use CSS Variables
```jsx
// In JSX - inline styles
<div style={{ 
  background: 'var(--bg-card)', 
  color: 'var(--text-primary)' 
}}>
  Content
</div>

// In CSS files
.my-class {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
```

### Available CSS Variables

#### Backgrounds
```css
var(--bg-primary)    /* Main background */
var(--bg-secondary)  /* Secondary background */
var(--bg-card)       /* Card background */
```

#### Text Colors
```css
var(--text-primary)   /* Main text */
var(--text-secondary) /* Secondary text */
var(--text-tertiary)  /* Tertiary text */
```

#### UI Elements
```css
var(--border-color)      /* Borders */
var(--glass-bg)          /* Glass effect bg */
var(--glass-border)      /* Glass effect border */
var(--scrollbar-track)   /* Scrollbar track */
var(--scrollbar-thumb)   /* Scrollbar thumb */
```

#### Gradients
```css
var(--primary-gradient)  /* Purple gradient */
var(--success-gradient)  /* Green gradient */
var(--danger-gradient)   /* Red gradient */
```

### Add Smooth Transitions
```css
.themed-element {
  /* Add to any element that uses CSS variables */
  transition: background 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease;
}
```

---

## File Structure

```
src/
├── contexts/
│   └── ThemeContext.jsx     ← Theme provider
├── App.jsx                  ← Toggle button here
├── index.css                ← CSS variables defined
└── components/
    ├── QuestionForm.jsx     ← Uses theme
    ├── AdviceDisplay.jsx    ← Uses theme
    └── History.jsx          ← Uses theme
```

---

## Common Tasks

### Get Current Theme
```jsx
const { isDark } = useTheme();
console.log(isDark); // true or false
```

### Toggle Theme Programmatically
```jsx
const { toggleTheme } = useTheme();
toggleTheme(); // Switches theme
```

### Clear Saved Theme
```javascript
localStorage.removeItem('theme');
// Will use system preference on next load
```

### Check System Preference
```javascript
const prefersDark = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
console.log(prefersDark); // true if OS uses dark mode
```

---

## Troubleshooting

### Theme Not Persisting
```javascript
// Check if localStorage is available
console.log(localStorage.getItem('theme'));
// Should return "light" or "dark"
```

### Colors Not Updating
```css
/* Make sure you're using CSS variables */
/* ❌ Wrong */
.element { background: #ffffff; }

/* ✅ Correct */
.element { background: var(--bg-card); }
```

### Theme Toggle Not Working
```jsx
// Ensure App is wrapped with ThemeProvider
function App() {
  return (
    <ThemeProvider>  {/* ← Must be here */}
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
```

---

## Testing

### Manual Test
1. Click toggle button → Theme should change
2. Refresh page → Theme should persist
3. Clear localStorage → Should use system theme
4. Change OS theme → App should detect it

### Console Test
```javascript
// Get current theme
localStorage.getItem('theme')

// Force light theme
localStorage.setItem('theme', 'light')
location.reload()

// Force dark theme
localStorage.setItem('theme', 'dark')
location.reload()
```

---

## Performance Tips

1. **Use CSS Variables**: Instant theme switching, no re-render
2. **Add Transitions**: Smooth visual changes
3. **Avoid Hardcoded Colors**: Always use variables
4. **Minimal JavaScript**: Let CSS handle the colors

---

## Best Practices

### ✅ Do
```jsx
// Use CSS variables
<div style={{ color: 'var(--text-primary)' }}>Text</div>

// Add transitions
.element { transition: all 0.3s ease; }

// Check theme state when needed
const { isDark } = useTheme();
```

### ❌ Don't
```jsx
// Don't hardcode colors
<div style={{ color: '#1a202c' }}>Text</div>

// Don't use inline conditional colors
<div style={{ color: isDark ? '#fff' : '#000' }}>Text</div>

// Don't skip transitions
.element { } // Missing transition
```

---

## Quick Reference Card

| Task | Code |
|------|------|
| Import hook | `import { useTheme } from './contexts/ThemeContext'` |
| Get theme | `const { isDark } = useTheme()` |
| Toggle | `const { toggleTheme } = useTheme()` |
| Background | `style={{ background: 'var(--bg-card)' }}` |
| Text color | `style={{ color: 'var(--text-primary)' }}` |
| Border | `style={{ borderColor: 'var(--border-color)' }}` |
| Transition | `transition: all 0.3s ease` |

---

## Documentation Links

- **Full Guide**: See `DARK_MODE.md`
- **Visual Guide**: See `DARK_MODE_VISUAL_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

---

**Status**: ✅ Production Ready  
**Version**: 2.0.0  
**Last Updated**: December 4, 2025
