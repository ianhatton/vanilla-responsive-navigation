# vanilla-responsive-navigation

### Synopsis
A responsive navigation module written in vanilla JavaScript.

### Installation
```
npm install @ianhatton/vanilla-responsive-navigation
```

### Running tests
```
npm run test
```

### Example Instantiation
```javascript
const ResponsiveNavigationClass = require('@ianhatton/vanilla-responsive-navigation');

const primaryNavigation = new ResponsiveNavigationClass(
  'primary-navigation',
  {
    list_id: 'primary-navigation-list'
    , toggle_id: 'primary-navigation-toggle'
  }
);

if (primaryNavigation && primaryNavigation.hasOwnProperty('config')){
  primaryNavigation._init();
}
```

### Configuration
A new instance of ResponsiveNavigationClass can contain the following in its configuration object:
```javascript
new ResponsiveNavigationClass({
  dropdownClass: // String. Class for a list item which contains a child ul. Default is "dropdown-parent"
  , flyout: // Boolean. Determines whether or not a class is added to the body when the navigation is visible. Used for styling. Default is false
  , list_id: // String. Id for the main ul in the navigation. Default is "responsive-navigation-list"
  , toggle_id: // String. Id for the main toggle. Default is "responsive-navigation-toggle"
  , toggle_mobile_id: // String. Id for the mobile toggle. This is only needed if flyout has been set to true. Default is null
});
```

### Example HTML structure
```html
<nav class="primary-navigation" id="primary-navigation" role="navigation">
  <a href="#" id="primary-navigation-toggle" class="primary-navigation-toggle" aria-controls="navigation" aria-expanded="false" aria-hidden="true" aria-label="navigation menu" role="button">
    Toggle menu
  </a>
  <ul id="primary-navigation-list" class="primary-navigation-list">
    <li class="primary-navigation-header">
      <a href="#" id="primary-nav-toggle-mobile">
        Toggle menu (flyout)
      </a>
    </li>
    <li>
      <a href="/regular-link">Regular link</a>
    </li>
    <li class="dropdown-parent">
      <a href="#">Parent link</a>
      <ul>
        <li>
          <a href="/child-link-1">Child link 1</a>
        </li>
        <li>
          <a href="/child-link-2">Child link 2</a>
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

### CSS
As a bare minimum, you'll require the following, or similar CSS:

##### Responsive
(styles which are applied at different breakpoints)
```scss
@include breakpoint($mobile-breakpoint) {
  body {
    &.nav-open {
      .primary-nav-list {
        width: percentage(2/3);
      }
    }
  }

  .primary-nav-list {
    right: -(percentage(2/3));
    width: percentage(2/3);
  }
}

@include breakpoint($mobile-and-tablet-breakpoint) {
  body {
    &.nav-open {
      .primary-navigation-list {
        right: 0;
      }
    }
  }

  .primary-navigation-list {
    position: fixed;
    top: 0;
    @include transition(right 0.2s ease-in-out);

    li {
      float: left;
      width: 100%;
    }

    .dropdown {
      display: none;
    }

    .dropdown-parent {
      & > a {
        position: relative;

        &:after {
          content: "\25b6";
          position: absolute;
          top: 15px;
          right: 10px;
        }

        &.open {
          &:after {
            content: "\25bc";
          }
        }
      }
    }
  }

  .primary-navigation-toggle {
    display: block;
    float: right;
    position: relative;
    top: 10px;
  }
}

@include breakpoint($tablet-breakpoint) {
  body {
    &.nav-open {
      .primary-nav-list {
        width: percentage(1/2);
      }
    }
  }

  .primary-nav-list {
    right: -(percentage(1/2));
    width: percentage(1/2);
  }
}

@include breakpoint($desktop-breakpoint) {
  .primary-navigation-list {
    .dropdown {
      display: none;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 100%;

      li {
        clear: both;
        white-space: nowrap;
        width: 100%;
      }
    }

    .dropdown-parent {
      position: relative;

      &:hover {
        .dropdown {
          display: block !important; /* Needs !important to override JS */
        }
      }
    }
  }

  .primary-navigation-header, .primary-navigation-toggle {
    display: none;
  }
}
```