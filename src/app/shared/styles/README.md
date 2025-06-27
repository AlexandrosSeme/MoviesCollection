# Button Styles Documentation

This directory contains shareable button styles for the movie app.

## Colors

### Primary Buttons
- **Background**: `#ffc700` (Golden Yellow)
- **Text**: `#333` (Dark Gray)
- **Hover**: `#e6b300` (Darker Yellow)
- **Active**: `#d4a000` (Even Darker Yellow)

### Secondary Buttons (Cancel, Clear, etc.)
- **Background**: `#939393` (Gray)
- **Text**: `#ffffff` (White)
- **Hover**: `#808080` (Darker Gray)
- **Active**: `#6b6b6b` (Even Darker Gray)

## Usage

### 1. Material Design Buttons (Recommended)

```html
<!-- Primary Action Button -->
<button mat-raised-button color="primary">
  <mat-icon>search</mat-icon>
  Search
</button>

<!-- Secondary Button (Cancel, Clear) -->
<button mat-stroked-button color="primary">
  <mat-icon>clear</mat-icon>
  Clear
</button>

<!-- Regular Button -->
<button mat-button color="primary">
  Cancel
</button>

<!-- Icon Button -->
<button mat-icon-button color="primary">
  <mat-icon>close</mat-icon>
</button>
```

### 2. Utility Classes

```html
<!-- Custom Primary Button -->
<button class="btn-primary action-button">
  Add to Collection
</button>

<!-- Custom Secondary Button -->
<button class="btn-secondary cancel-button">
  Cancel
</button>
```

### 3. Component-Specific Styling

In your component's SCSS file:

```scss
@import '../../shared/styles/buttons.scss';

.my-component {
  .custom-button {
    @include primary-button;
    // Additional custom styles
  }
  
  .cancel-btn {
    @include secondary-button;
    // Additional custom styles
  }
}
```

## Available Mixins

### `@include primary-button`
Applies primary button styling with hover, focus, active, and disabled states.

### `@include secondary-button`
Applies secondary button styling with hover, focus, active, and disabled states.

## Available Utility Classes

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.action-button` - Primary button with enhanced styling
- `.cancel-button` - Secondary button with enhanced styling

## Accessibility Features

- **Focus rings** for keyboard navigation
- **Hover states** for mouse interaction
- **Active states** for click feedback
- **Disabled states** for inactive buttons
- **High contrast** colors for better visibility

## File Structure

```
src/app/shared/styles/
├── buttons.scss          # Main button styles and mixins
└── README.md            # This documentation
```

## Notes

- All styles use `!important` to override Material Design defaults
- Colors are defined as SCSS variables for easy customization
- Styles are automatically applied to Material Design buttons with `color="primary"`
- The styles are imported globally in `src/styles.scss` 