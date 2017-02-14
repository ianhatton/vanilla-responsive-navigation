'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable max-len */
var _ = require('lodash/core'),
    ViewportDetect = require('viewport-detection-es6');
_.isElement = require('lodash/isElement');
var viewport = new ViewportDetect();

var ResponsiveNavigationClass = function () {
  function ResponsiveNavigationClass(id) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ResponsiveNavigationClass);

    var element = document.getElementById(id);

    if (!_.isElement(element)) return;

    this.config = _.defaults(config, {
      dropdown_class: 'dropdown-parent',
      flyout: false,
      list_id: 'responsive-navigation-list',
      toggle_id: 'responsive-navigation-toggle',
      toggle_mobile_id: null
    });
  }

  _createClass(ResponsiveNavigationClass, [{
    key: '_init',
    value: function _init() {
      this._initViewport();
      this.dropdownParents = [];
      this.dropdownToggles = [];
      this.list = document.getElementById(this.config.list_id);
      this.toggle = document.getElementById(this.config.toggle_id);
      this.toggleMobile = document.getElementById(this.config.toggle_mobile_id);
      this._render();
    }
  }, {
    key: '_initViewport',
    value: function _initViewport() {
      this.device = viewport.getDevice();
      this.size = viewport.windowSize();
      viewport.trackSize(this._trackSize.bind(this));
    }
  }, {
    key: '_render',
    value: function _render() {
      if (this.config.flyout) {
        this._getBodyClass();
      }

      this._addToggleListener();
      this._getDropdownParents();
      this._hideNav();
      this._setToggleAriaHidden(!this._deviceCheck());
    }
  }, {
    key: '_addDropdownHoverListener',
    value: function _addDropdownHoverListener(dropdown) {
      dropdown.addEventListener('mouseover', this._setDropdownAriaHiddenDesktop.bind(this, dropdown), false);
      dropdown.addEventListener('mouseout', this._setDropdownAriaHiddenDesktop.bind(this, dropdown), false);
    }
  }, {
    key: '_addDropdownToggleClickListener',
    value: function _addDropdownToggleClickListener(dropdownToggle) {
      dropdownToggle.addEventListener('click', this._dropdownToggleClick.bind(this), false);
    }
  }, {
    key: '_addToggleListener',
    value: function _addToggleListener() {
      this.toggle.addEventListener('click', this._toggleClick.bind(this), false);

      if (!_.isNull(this.toggleMobile)) {
        this.toggleMobile.addEventListener('click', this._toggleClick.bind(this), false);
      }
    }
  }, {
    key: '_deviceCheck',
    value: function _deviceCheck() {
      return this.device === 'mobile' || this.device === 'tablet';
    }
  }, {
    key: '_dropdownToggleClick',
    value: function _dropdownToggleClick(e) {
      e.preventDefault();

      if (this._deviceCheck()) {
        this._toggleDropdown(e.target);
        this._setDropdownAriaHiddenMobile(e.target);
      }
    }
  }, {
    key: '_getBodyClass',
    value: function _getBodyClass() {
      this.body = document.body;
      this.bodyClass = this.body.className;
    }
  }, {
    key: '_getDropdownParents',
    value: function _getDropdownParents() {
      var _this = this;

      var listItems = this.list.getElementsByTagName('li');

      this.dropdownParents = Array.from(listItems).filter(function (li) {
        return li.className === _this.config.dropdown_class;
      });

      this.dropdownParents.forEach(this._addDropdownHoverListener.bind(this));

      this._getDropdownToggles();
    }
  }, {
    key: '_getDropdownToggles',
    value: function _getDropdownToggles() {
      var _this2 = this;

      this.dropdownToggles = this.dropdownParents.map(function (dropdownParent) {
        return _this2._skipTextNodes(dropdownParent, 'firstChild');
      });

      this.dropdownToggles.forEach(this._addDropdownToggleClickListener.bind(this));
    }
  }, {
    key: '_hideNav',
    value: function _hideNav(force) {
      if (_.isBoolean(force)) {
        this.hideMenu = force;
      } else {
        this.hideMenu = this._deviceCheck() ? !this.hideMenu : false;
      }

      if (this.config.flyout) {
        this._setBodyClass(this.hideMenu);
      }

      this._setListClass(this.hideMenu);
      this._setToggleAriaExpanded(this.hideMenu);
    }
  }, {
    key: '_resetDropdownParentsStates',
    value: function _resetDropdownParentsStates() {
      var className = void 0,
          ul = void 0;

      this.dropdownToggles.forEach(function (dropdownToggle) {
        className = dropdownToggle.className;

        dropdownToggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      });

      this.dropdownParents.forEach(function (dropdownParent) {
        ul = dropdownParent.getElementsByTagName('ul')[0];
        ul.style.display = 'none';
        ul.setAttribute('aria-hidden', 'true');
      });
    }
  }, {
    key: '_setBodyClass',
    value: function _setBodyClass(hidden) {
      this.body.className = hidden ? this.bodyClass : this.bodyClass + ' nav-open';
    }
  }, {
    key: '_setDropdownAriaHiddenDesktop',
    value: function _setDropdownAriaHiddenDesktop(dropdownParent, e) {
      if (!this._deviceCheck()) {
        var dropdown = dropdownParent.getElementsByTagName('ul')[0];

        dropdown.setAttribute('aria-hidden', dropdown.offsetParent === null ? 'true' : 'false');
      }
    }
  }, {
    key: '_setDropdownAriaHiddenMobile',
    value: function _setDropdownAriaHiddenMobile(dropdownToggle) {
      var dropdown = this._skipTextNodes(dropdownToggle, 'nextSibling');

      dropdown.setAttribute('aria-hidden', dropdown.offsetParent === null ? 'true' : 'false');
    }
  }, {
    key: '_setListClass',
    value: function _setListClass(hidden) {
      var className = this.list.className;

      this.list.className = className.replace(/(?:^|\s)open(?!\S)/g, '');

      if (!hidden) {
        this.list.className += ' open';
      }
    }
  }, {
    key: '_setToggleAriaExpanded',
    value: function _setToggleAriaExpanded(hidden) {
      this.toggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
    }
  }, {
    key: '_setToggleAriaHidden',
    value: function _setToggleAriaHidden(hidden) {
      this.toggle.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }
  }, {
    key: '_skipTextNodes',
    value: function _skipTextNodes(el, method) {
      var element = el[method];

      while (element !== null && element.nodeType !== 1) {
        element = element.nextSibling;
      }

      return element;
    }
  }, {
    key: '_toggleClick',
    value: function _toggleClick(e) {
      e.preventDefault();

      this._hideNav();
    }
  }, {
    key: '_toggleDropdown',
    value: function _toggleDropdown(dropdownToggle) {
      var className = dropdownToggle.className,
          dropdown = this._skipTextNodes(dropdownToggle, 'nextSibling');

      if (dropdown.offsetParent === null) {
        dropdown.style.display = 'block';
        dropdownToggle.className += ' open';
      } else {
        dropdown.style.display = 'none';
        dropdownToggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      }
    }
  }, {
    key: '_trackSize',
    value: function _trackSize(device, size) {
      this._resetDropdownParentsStates();

      if (this.device !== device) {
        this.device = device;
      }

      if (this._deviceCheck()) {
        this._hideNav(true);
        this._setToggleAriaHidden(false);
      } else {
        this._hideNav(false);
        this._setToggleAriaHidden(true);
      }

      this.size = size;
    }
  }]);

  return ResponsiveNavigationClass;
}();

module.exports = ResponsiveNavigationClass;
/* eslint-enable */
//# sourceMappingURL=vanilla-responsive-navigation.js.map