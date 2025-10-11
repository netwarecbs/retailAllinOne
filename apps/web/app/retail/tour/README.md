# Tour & Guide System

A comprehensive tour and guide system for the Retail Hub application that provides interactive step-by-step guidance for users.

## 🎯 Features

- **Interactive Tours**: Step-by-step guidance with visual highlights
- **Progress Tracking**: Track completion status across all tour sections
- **Easy Updates**: Simple configuration for adding new features
- **Responsive Design**: Works on all device sizes
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Export/Import**: Tour data can be exported and imported

## 📁 File Structure

```
apps/web/app/retail/
├── tour/
│   ├── page.tsx                 # Main tour page
│   └── README.md               # This documentation
├── contexts/
│   └── TourContext.tsx         # Tour context provider
├── data/
│   └── tourData.ts            # Tour configuration and data
├── hooks/
│   └── useTour.ts             # Tour hook for easy integration
└── components/
    └── TourOverlay.tsx        # Tour overlay component
```

## 🚀 Quick Start

### 1. Access Tour System
- Navigate to the "More" menu in the retail layout
- Click "🎯 Tour & Guide"
- Select a tour section to start

### 2. Using Tours in Components
```tsx
import { useTour } from '../hooks/useTour'
import { TourTrigger, TourOverlay } from '../components/TourOverlay'

const MyComponent = () => {
  const tour = useTour({
    onComplete: () => console.log('Tour completed!'),
    onSkip: () => console.log('Tour skipped!')
  })

  const startMyTour = () => {
    tour.startTour([
      {
        id: 'step-1',
        title: 'Welcome!',
        description: 'This is the first step',
        target: '.my-element',
        position: 'bottom'
      }
    ])
  }

  return (
    <div>
      <TourTrigger onStart={startMyTour}>
        Start My Tour
      </TourTrigger>
      
      {tour.isActive && tour.currentStep && (
        <TourOverlay
          step={tour.currentStep}
          currentIndex={tour.currentIndex}
          totalSteps={tour.totalSteps}
          onNext={tour.nextStep}
          onPrev={tour.prevStep}
          onComplete={tour.completeTour}
          onSkip={tour.skipTour}
          isVisible={tour.isActive}
        />
      )}
    </div>
  )
}
```

## 🔧 Updating Tours

### Adding New Tour Steps

1. **Edit `tourData.ts`**:
```typescript
// Add new step to existing section
export const tourSections: TourSection[] = [
  {
    id: 'inventory',
    name: 'Inventory Management',
    // ... existing config
    steps: [
      // ... existing steps
      {
        id: 'inventory-new-feature',
        title: 'New Feature',
        description: 'Description of the new feature',
        target: '.new-feature-element',
        position: 'top'
      }
    ]
  }
]
```

2. **Update lastUpdated date**:
```typescript
lastUpdated: '2024-01-22' // Update to current date
```

### Adding New Tour Sections

```typescript
// Add new section to tourSections array
{
  id: 'new-section',
  name: 'New Section',
  description: 'Description of new section',
  icon: '🆕',
  version: '1.0.0',
  lastUpdated: '2024-01-22',
  steps: [
    {
      id: 'new-section-step-1',
      title: 'First Step',
      description: 'Description of first step',
      target: '.target-element',
      position: 'bottom'
    }
  ]
}
```

### Updating Existing Steps

```typescript
// Update step properties
{
  id: 'existing-step',
  title: 'Updated Title',
  description: 'Updated description',
  target: '.updated-target',
  position: 'right', // Changed position
  action: 'navigate', // Added action
  route: '/new-route' // Added route
}
```

## 🎨 Tour Step Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `id` | string | Unique identifier for the step | ✅ |
| `title` | string | Step title displayed to user | ✅ |
| `description` | string | Detailed description of the step | ✅ |
| `target` | string | CSS selector for the target element | ✅ |
| `position` | string | Tooltip position: 'top', 'bottom', 'left', 'right' | ✅ |
| `action` | string | Action to perform: 'click', 'navigate' | ❌ |
| `route` | string | Route to navigate to (if action is 'navigate') | ❌ |
| `highlight` | boolean | Whether to highlight the target element | ❌ |

## 🔍 Target Element Guidelines

### CSS Selectors
- Use specific selectors: `.class-name`, `#element-id`
- Avoid generic selectors: `div`, `button`
- Test selectors in browser console: `document.querySelector('.your-selector')`

### Common Patterns
```css
/* Page headers */
.dashboard-header
.inventory-header
.sales-header

/* Navigation elements */
.nav-item
.menu-button

/* Form elements */
.form-group
.input-field
.submit-button

/* Data tables */
.data-table
.table-header
.table-row

/* Cards and sections */
.card-header
.section-title
.content-area
```

## 📱 Responsive Considerations

### Mobile Devices
- Tours automatically adjust tooltip positioning
- Touch-friendly button sizes
- Swipe gestures for navigation (future enhancement)

### Tablet Devices
- Optimized tooltip sizing
- Touch-optimized interactions
- Landscape/portrait orientation support

## 🧪 Testing Tours

### 1. Verify Target Elements
```javascript
// Test in browser console
document.querySelector('.your-target-selector')
```

### 2. Test Tour Flow
1. Start tour from tour page
2. Navigate through all steps
3. Test skip functionality
4. Test completion
5. Verify progress tracking

### 3. Test Responsive Design
1. Test on different screen sizes
2. Verify tooltip positioning
3. Test touch interactions on mobile

## 🚨 Common Issues

### Target Element Not Found
- **Issue**: Tour step doesn't highlight target
- **Solution**: Verify CSS selector exists and is unique
- **Debug**: Use `document.querySelector('.selector')` in console

### Tooltip Positioning
- **Issue**: Tooltip appears off-screen
- **Solution**: Check `position` property and element visibility
- **Debug**: Ensure target element is visible and not hidden

### Navigation Issues
- **Issue**: Tour doesn't navigate to specified route
- **Solution**: Verify route exists and is accessible
- **Debug**: Test route manually in browser

## 🔄 Version Control

### Tour Data Versioning
```typescript
// Update version when making significant changes
version: '1.1.0' // Major changes
version: '1.0.1' // Minor fixes
```

### Changelog
Keep track of tour updates:
- Date of change
- What was changed
- Why it was changed
- Impact on existing tours

## 🎯 Best Practices

### 1. Keep Steps Focused
- One concept per step
- Clear, concise descriptions
- Logical flow between steps

### 2. Use Descriptive Targets
- Specific CSS selectors
- Avoid generic elements
- Test selectors thoroughly

### 3. Update Documentation
- Update this README when adding features
- Document new tour sections
- Keep examples current

### 4. Test Thoroughly
- Test on all supported devices
- Verify all target elements exist
- Check tour completion flow

## 🚀 Future Enhancements

### Planned Features
- [ ] Voice narration for tours
- [ ] Video integration
- [ ] Interactive tutorials
- [ ] Tour analytics
- [ ] Custom tour creation
- [ ] Tour sharing between users

### Integration Opportunities
- [ ] Help system integration
- [ ] Onboarding flow
- [ ] Feature announcements
- [ ] User feedback collection

## 📞 Support

For questions or issues with the tour system:
1. Check this documentation
2. Test target elements in browser console
3. Verify tour data structure
4. Contact development team

---

**Last Updated**: 2024-01-22  
**Version**: 1.0.0  
**Maintainer**: Retail Hub Development Team
