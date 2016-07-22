const _ = require('lodash/core')
      , ViewportDetect = require('viewport-detection-es6');
_.isElement = require('lodash/isElement');
/* eslint-disable one-var */
const viewport = new ViewportDetect();
/* eslint-enable */

class ResponsiveNavigationClass{
  constructor(id, config = {}){
    let element = document.getElementById(id);

    if (!_.isElement(element)) return;

    this.config = _.defaults(config,
      {
        dropdown_class: 'dropdown-parent'
      , flyout: false
      , list_id: 'responsive-navigation-list'
      , toggle_id: 'responsive-navigation-toggle'
      , toggle_mobile_id: 'responsive-navigation-toggle-mobile'
      }
    );
  }

  _init(){
    this._initViewport();

    this.dropdownParents = [];
    this.dropdownToggles = [];
    this.list = document.getElementById(this.config.list_id);
    this.toggle = document.getElementById(this.config.toggle_id);
    this.toggleMobile = document.getElementById(this.config.toggle_mobile_id);
    this._render();
  }

  _initViewport(){
    this.device = viewport.getDevice();
    this.size = viewport.windowSize();
    viewport.trackSize(this._trackSize.bind(this));
  }

  _render(){
    if (this.config.flyout){
      this._getBodyClass();
    }

    this._addToggleListener();
    this._getDropdownParents();
    this._hideNav();
    this._setToggleAriaHidden(!this._deviceCheck());
  }

  _addDropdownToggleClickListener(dropdownToggle){
    /* eslint-disable max-len */
    dropdownToggle.addEventListener('click'
                                         , this._dropdownToggleClick.bind(this)
                                         , false);
    /* eslint-enable */
  }

  _addDropdownHoverListener(dropdown){
    dropdown.addEventListener('mouseover'
                             , this._setDropdownAriaHiddenDesktop.bind(this, dropdown)
                             , false);
    dropdown.addEventListener('mouseout'
                             , this._setDropdownAriaHiddenDesktop.bind(this, dropdown)
                             , false);
  }

  _addToggleListener(){
    this.toggle.addEventListener('click'
                                , this._toggleClick.bind(this)
                                , false);

    if (!_.isNull(this.toggleMobile)){
      this.toggleMobile.addEventListener('click'
                                        , this._toggleClick.bind(this)
                                        , false);
    }
  }

  _deviceCheck(){
    return (this.device === 'mobile' || this.device === 'tablet');
  }

  _dropdownToggleClick(e){
    e.preventDefault();

    if (this._deviceCheck()){
      this._toggleDropdown(e.target);
      this._setDropdownAriaHiddenMobile(e.target);
    }
  }

  _getBodyClass(){
    this.body = document.body;
    this.bodyClass = this.body.className;
  }

  _getDropdownParents(){
    let listItems = this.list.getElementsByTagName('li');

    _.forEach(listItems, function(li){
      if (li.className === this.config.dropdown_class){
        this.dropdownParents.push(li);
      }
    }.bind(this));

    _.forEach(this.dropdownParents, this._addDropdownHoverListener.bind(this));

    this._getDropdownToggles();
  }

  _getDropdownToggles(){
    _.forEach(this.dropdownParents, function(dropdownParent){
      /* eslint-disable max-len */
      this.dropdownToggles.push(this._skipTextNodes(dropdownParent, 'firstChild'));
      /* eslint-enable */
    }.bind(this));

    /* eslint-disable max-len */
    _.forEach(this.dropdownToggles, this._addDropdownToggleClickListener.bind(this));
    /* eslint-enable */
  }

  _hideNav(force){
    if (_.isBoolean(force)){
      this.hideMenu = force;
    } else {
      this.hideMenu = (this._deviceCheck()) ? !this.hideMenu : false;
    }

    if (this.config.flyout){
      this._setBodyClass(this.hideMenu);
    }

    this._setListClass(this.hideMenu);
    this._setToggleAriaExpanded(this.hideMenu);
  }

  _resetDropdownParentsStates(){
    let className;

    _.forEach(this.dropdownToggles, function(dropdownParent){
      className = dropdownParent.className;

      dropdownParent.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
    });

    _.forEach(this.dropdownParents, function(dropdownParent){
      let ul = dropdownParent.getElementsByTagName('ul')[0];
      ul.style.display = 'none';
      ul.setAttribute('aria-hidden', 'true');
    });
  }

  _setBodyClass(hidden){
    /* eslint-disable max-len */
    this.body.className = hidden ? this.bodyClass : this.bodyClass + ' nav-open';
    /* eslint-enable */
  }

  _setDropdownAriaHiddenDesktop(dropdownParent, e){
    if (!this._deviceCheck()){
      let dropdown = dropdownParent.getElementsByTagName('ul')[0];

      /* eslint-disable max-len */
      dropdown.setAttribute('aria-hidden', dropdown.offsetParent === null ? 'true' : 'false');
      /* eslint-enable */
    }
  }

  _setDropdownAriaHiddenMobile(dropdownToggle){
    let dropdown = this._skipTextNodes(dropdownToggle, 'nextSibling');

    dropdown.setAttribute('aria-hidden', dropdown.offsetParent === null ? 'true' : 'false');
  }

  _setListClass(hidden){
    let className = this.list.className;

    this.list.className = className.replace(/(?:^|\s)open(?!\S)/g, '');

    if (!hidden){
      this.list.className += ' open';
    }
  }

  _setToggleAriaExpanded(hidden){
    this.toggle.setAttribute('aria-expanded', hidden ? 'false' : 'true');
  }

  _setToggleAriaHidden(hidden){
    this.toggle.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  _skipTextNodes(el, method){
    let element = el[method];

    while (element !== null && element.nodeType !== 1){
      element = element.nextSibling;
    }

    return element;
  }

  _toggleClick(e){
    e.preventDefault();

    this._hideNav();
  }

  _toggleDropdown(dropdownToggle){
    let className = dropdownToggle.className
        , dropdown = this._skipTextNodes(dropdownToggle, 'nextSibling');

    if (dropdown.offsetParent === null){
      dropdown.style.display = 'block';
      dropdownToggle.className += ' open';
    } else {
      dropdown.style.display = 'none';
      /* eslint-disable max-len */
      dropdownToggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      /* eslint-enable */
    }
  }

  _trackSize(device, size){
    this._resetDropdownParentsStates();

    if (this.device !== device){
      this.device = device;
    }

    if (this._deviceCheck()){
      this._hideNav(true);
      this._setToggleAriaHidden(false);
    } else {
      this._hideNav(false);
      this._setToggleAriaHidden(true);
    }

    this.size = size;
  }
}

module.exports = ResponsiveNavigationClass;
