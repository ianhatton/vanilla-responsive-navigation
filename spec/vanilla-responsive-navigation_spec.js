/* eslint-disable max-len, max-lines, max-nested-callbacks, one-var, require-jsdoc */
const _  = require('lodash');
const ResponsiveNavigationClass = require('../src/vanilla-responsive-navigation');

function createDropdown(li){
  let ul;

  ul = document.createElement('ul');
  ul.setAttribute('aria-hidden', 'true');

  li.className = 'dropdown-parent';
  li.appendChild(ul);

  return li;
}

function createList(){
  let ul;

  ul = document.createElement('ul');
  ul.id = 'responsive-navigation-list';

  createListItems(ul);

  document.body.appendChild(ul);

  return ul;
}

function createListItems(ul, items = 3){
  let a, li;
  let range = _.range(1, (items + 1));

  _.forEach(range, function(i){
    li = document.createElement('li');
    a = document.createElement('a');

    a.innerHTML = 'Link ' + i;
    a.setAttribute('href', 'http://www.' + i + '.com');

    li.appendChild(a);

    if (i === 2){
      createDropdown(li);
    }

    ul.appendChild(li);
  });
}

function createNav(id){
  let nav;

  nav = document.createElement('nav');

  nav.setAttribute('id', id);

  document.body.appendChild(nav);

  return nav;
}

function createToggle(id, text){
  let a;

  a = document.createElement('a');
  a.innerHTML = text;
  a.setAttribute('id', id);
  a.setAttribute('aria-expanded', 'false');
  a.setAttribute('aria-hidden', 'true');

  document.body.appendChild(a);

  return a;
}

function removeElement(el){
  el.parentNode.removeChild(el);
}

function setBodyClass(){
  let bodyClass = 'spec';

  document.body.className = bodyClass;

  return bodyClass;
}

describe('responsive navigation module', function(){
  let navContainer, navigation, viewport;

  beforeEach(()=>{
    navContainer = createNav('responsive-navigation');
    this.list = createList();
    this.toggle = createToggle('responsive-navigation-toggle', 'Toggle');
    this.toggleMobile = createToggle('responsive-navigation-mobile-toggle', 'Toggle Mobile');

    navContainer.appendChild(this.toggle);
    navContainer.appendChild(this.toggleMobile);
    navContainer.appendChild(this.list);

    navigation = new ResponsiveNavigationClass(
      'responsive-navigation',
      {
        list_id: 'responsive-navigation-list'
        , toggle_id: 'responsive-navigation-toggle'
        , toggle_mobile_id: 'responsive-navigation-mobile-toggle'
      }
    );

    viewport = ResponsiveNavigationClass.__get__('viewport');
    this.bodyClass = setBodyClass();

    navigation.dropdownParents = [];
    navigation.dropdownToggles = [];
    navigation.list = document.getElementById(navigation.config.list_id);
    navigation.toggle = document.getElementById(navigation.config.toggle_id);
    navigation.toggleMobile = document.getElementById(navigation.config.toggle_mobile_id);
  });

  afterEach(()=>{
    removeElement(document.getElementById(navigation.config.list_id));
    removeElement(document.getElementById(navigation.config.toggle_id));
  });

  it('should exist', function(){
    expect(navigation).toBeDefined();
  });

  describe('_init function', ()=>{
    beforeEach(()=>{
      spyOn(navigation, '_initViewport');
      spyOn(navigation, '_render');

      navigation._init();
    });

    it('should call the _initViewport function', ()=>{
      expect(navigation._initViewport).toHaveBeenCalled();
    });

    it('should set this.dropdownParents to be an empty array', ()=>{
      expect(navigation.dropdownParents.length).toEqual(0);
    });

    it('should set this.dropdownToggles to be an empty array', ()=>{
      expect(navigation.dropdownToggles.length).toEqual(0);
    });

    it('should set this.list to be the HTML node specified in this.config.list', ()=>{
      expect(navigation.list).toEqual(this.list);
    });

    it('should set this.toggle to be the HTML node specified in this.config.toggle_id', ()=>{
      expect(navigation.toggle).toEqual(this.toggle);
    });

    it('should set this.toggleMobile to be the HTML node specified in this.config.toggle_mobile_id', ()=>{
      expect(navigation.toggleMobile).toEqual(this.toggleMobile);
    });

    it('should call the _render function', ()=>{
      expect(navigation._render).toHaveBeenCalled();
    });
  });

  describe('_initViewport function', ()=>{
    beforeEach(()=>{
      spyOn(viewport, 'getDevice').and.returnValue('massive swanky monitor');
      spyOn(viewport, 'windowSize').and.returnValue('99999px');
      spyOn(viewport, 'trackSize');

      navigation._initViewport();
    });

    it('should set this.device to the viewport.getDevice function', ()=>{
      expect(navigation.device).toEqual('massive swanky monitor');
    });

    it('should set this.size to the viewport.windowSize function', ()=>{
      expect(navigation.size).toEqual('99999px');
    });

    it('should call the viewport.trackSize function', ()=>{
      expect(viewport.trackSize).toHaveBeenCalled();
    });
  });

  describe('_render function', ()=>{
    beforeEach(()=>{
      spyOn(navigation, '_addToggleListener');
      spyOn(navigation, '_getDropdownParents');
      spyOn(navigation, '_hideNav');
      spyOn(navigation, '_setToggleAriaHidden');
    });

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        navigation._render();
      });

      it('should call the _addToggleListener function', ()=>{
        expect(navigation._addToggleListener).toHaveBeenCalled();
      });

      it('should call the _getDropdownParents function', ()=>{
        expect(navigation._getDropdownParents).toHaveBeenCalled();
      });

      it('should call the _hideNav function', ()=>{
        expect(navigation._hideNav).toHaveBeenCalled();
      });
    });

    describe('when this.config.flyout is true', ()=>{
      beforeEach(()=>{
        navigation.config.flyout = true;

        spyOn(navigation, '_getBodyClass');

        navigation._render();
      });

      it('should call the _getBodyClass function', ()=>{
        expect(navigation._getBodyClass).toHaveBeenCalled();
      });
    });

    describe('when this.config.flyout is false', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_getBodyClass');

        navigation._render();
      });

      it('should not call the _getBodyClass function', ()=>{
        expect(navigation._getBodyClass).not.toHaveBeenCalled();
      });
    });

    describe('when the _deviceCheck function returns true', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(true);

        navigation._render();
      });

      it('should call the _setToggleAriaHidden function with a paramater of false', ()=>{
        expect(navigation._setToggleAriaHidden).toHaveBeenCalledWith(false);
      });
    });

    describe('when the _deviceCheck function returns false', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(false);

        navigation._render();
      });

      it('should call the _setToggleAriaHidden function with a paramater of true', ()=>{
        expect(navigation._setToggleAriaHidden).toHaveBeenCalledWith(true);
      });
    });
  });

  // describe('_addDropdownClickListener function', ()=>{
    // How do I test this?
  // });

  // describe('_addDropdownHoverListener function', ()=>{
    // How do I test this?
  // });

  // describe('_addToggleListener function', ()=>{
    // How do I test this?
  // });

  describe('_deviceCheck function', ()=>{
    describe('when this.device is "mobile"', ()=>{
      beforeEach(()=>{
        navigation.device = 'mobile';
        navigation._deviceCheck();
      });

      it('should return true', ()=>{
        expect(navigation._deviceCheck()).toEqual(true);
      });
    });

    describe('when this.device is "tablet"', ()=>{
      beforeEach(()=>{
        navigation.device = 'tablet';
        navigation._deviceCheck();
      });

      it('should return true', ()=>{
        expect(navigation._deviceCheck()).toEqual(true);
      });
    });

    describe('when this.device is "desktop"', ()=>{
      beforeEach(()=>{
        navigation.device = 'desktop';
        navigation._deviceCheck();
      });

      it('should return true', ()=>{
        expect(navigation._deviceCheck()).toEqual(false);
      });
    });
  });

  describe('_dropdownToggleClick function', ()=>{
    let clickSpy;

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        clickSpy = jasmine.createSpyObj('e', ['preventDefault']);
        navigation._dropdownToggleClick(clickSpy);
      });

      it('should call e.preventDefault', ()=>{
        expect(clickSpy.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when the _deviceCheck function returns true', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(true);
        spyOn(navigation, '_toggleDropdown');
        spyOn(navigation, '_setDropdownAriaHiddenMobile');

        navigation._dropdownToggleClick(clickSpy);
      });

      it('should call the _toggleDropdown function', ()=>{
        expect(navigation._toggleDropdown).toHaveBeenCalled();
      });

      it('should call the _setDropdownAriaHiddenMobile function', ()=>{
        expect(navigation._setDropdownAriaHiddenMobile).toHaveBeenCalled();
      });
    });

    describe('when the _deviceCheck function returns false', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(false);
        spyOn(navigation, '_toggleDropdown');
        spyOn(navigation, '_setDropdownAriaHiddenMobile');

        navigation._dropdownToggleClick(clickSpy);
      });

      it('should not call the _toggleDropdown function', ()=>{
        expect(navigation._toggleDropdown).not.toHaveBeenCalled();
      });

      it('should not call the _setDropdownAriaHiddenMobile function', ()=>{
        expect(navigation._setDropdownAriaHiddenMobile).not.toHaveBeenCalled();
      });
    });
  });

  describe('_getBodyClass function', ()=>{
    beforeEach(()=>{
      navigation._getBodyClass();
    });

    it('should set this.body to be the document body', ()=>{
      expect(navigation.body).toEqual(document.body);
    });

    it('should set this.bodyClass to be the document body class', ()=>{
      expect(navigation.bodyClass).toEqual(this.bodyClass);
    });
  });

  describe('_getDropdownParents function', ()=>{
    beforeEach(()=>{
      spyOn(navigation, '_addDropdownHoverListener');
      spyOn(navigation, '_getDropdownToggles');

      navigation._getDropdownParents();
    });

    it('should push dropdown parents to the dropdownParents array', ()=>{
      expect(navigation.dropdownParents.length).toEqual(1);
    });

    it('should call the _addDropdownHoverListener function', ()=>{
      expect(navigation._addDropdownHoverListener).toHaveBeenCalled();
    });

    it('should call the _getDropdownToggles function', ()=>{
      expect(navigation._getDropdownToggles).toHaveBeenCalled();
    });
  });

  describe('_getDropdownToggles function', ()=>{
    let listItems;

    beforeEach(()=>{
      listItems = navigation.list.getElementsByTagName('li');

      _.forEach(listItems, function(li){
        if (li.className === navigation.config.dropdown_class){
          navigation.dropdownParents.push(li);
        }
      });

      spyOn(navigation, '_addDropdownToggleClickListener');
      spyOn(navigation, '_skipTextNodes').and.returnValue(navigation.dropdownParents[0]);

      navigation._getDropdownToggles();
    });

    it('should push dropdown parents to the dropdownToggles array', ()=>{
      expect(navigation.dropdownToggles.length).toEqual(1);
    });
  });

  describe('_hideNav function', ()=>{
    beforeEach(()=>{
      spyOn(navigation, '_setListClass');
      spyOn(navigation, '_setToggleAriaExpanded');
    });

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        navigation._hideNav(true);
      });

      it('should call the _setListClass function with this.hideMenu as a parameter', ()=>{
        expect(navigation._setListClass).toHaveBeenCalledWith(true);
      });

      it('should call the _setToggleAriaExpanded function with this.hideMenu as a parameter', ()=>{
        expect(navigation._setToggleAriaExpanded).toHaveBeenCalledWith(true);
      });
    });

    describe('when the "force" parameter is a boolean', ()=>{
      beforeEach(()=>{
        navigation._hideNav(true);
      });

      it('should set this.hideMenu to be the value of the parameter', ()=>{
        expect(navigation.hideMenu).toEqual(true);
      });
    });

    describe('when the "force" parameter is not a boolean', ()=>{
      describe('under all circumstances', ()=>{
        beforeEach(()=>{
          spyOn(navigation, '_deviceCheck');

          navigation._hideNav();
        });

        it('should call the _deviceCheck function', ()=>{
          expect(navigation._deviceCheck).toHaveBeenCalled();
        });
      });

      describe('and the _deviceCheck function returns false', ()=>{
        beforeEach(()=>{
          spyOn(navigation, '_deviceCheck').and.returnValue(false);

          navigation._hideNav();
        });

        it('should set this.hideMenu to false', ()=>{
          expect(navigation.hideMenu).toEqual(false);
        });
      });

      describe('and the _deviceCheck function returns true', ()=>{
        beforeEach(()=>{
          navigation.hideMenu = false;

          spyOn(navigation, '_deviceCheck').and.returnValue(true);

          navigation._hideNav();
        });

        it('should set this.hideMenu to the opposite of this.hideMenu', ()=>{
          expect(navigation.hideMenu).toEqual(true);
        });
      });
    });

    describe('when this.config.flyout is true', ()=>{
      beforeEach(()=>{
        navigation.config.flyout = true;

        spyOn(navigation, '_setBodyClass');

        navigation._hideNav(true);
      });

      it('should call the _setBodyClass function and pass this.hideMenu as a parameter', ()=>{
        expect(navigation._setBodyClass).toHaveBeenCalledWith(true);
      });
    });

    describe('when this.config.flyout is false', ()=>{
      beforeEach(()=>{
        navigation.config.flyout = false;

        spyOn(navigation, '_setBodyClass');

        navigation._hideNav();
      });

      it('should not call the _setBodyClass function', ()=>{
        expect(navigation._setBodyClass).not.toHaveBeenCalled();
      });
    });
  });

  describe('_resetDropdownParentsStates function', ()=>{
    let dropdownParent, dropdownParentMobile, dropdownParentUl, listItems;

    beforeEach(()=>{
      listItems = navigation.list.getElementsByTagName('li');

      _.forEach(listItems, function(li){
        if (li.className === navigation.config.dropdown_class){
          navigation.dropdownParents.push(li);
        }
      });

      _.forEach(navigation.dropdownParents, function(dropdownParent){
        navigation.dropdownToggles.push(dropdownParent.children[0]);
      });

      dropdownParent = navigation.dropdownParents[0];
      dropdownParentUl = dropdownParent.getElementsByTagName('ul')[0];
      dropdownParentUl.style.display = 'block';
      dropdownParentUl.setAttribute('aria-hidden', 'false');

      dropdownParentMobile = navigation.dropdownToggles[0];
      dropdownParentMobile.className = 'open';

      navigation._resetDropdownParentsStates();
    });

    it('should remove the "open" class from each item in this.dropdownToggles', ()=>{
      expect(dropdownParentMobile.className).not.toContain('open');
    });

    it('should hide each item in this.dropdownParents', ()=>{
      expect(dropdownParentUl.style.display).toEqual('none');
      expect(dropdownParentUl.getAttribute('aria-hidden')).toEqual('true');
    });
  });

  describe('_setBodyClass function', ()=>{
    beforeEach(()=>{
      navigation.body = document.body;
      navigation.bodyClass = this.bodyClass;
    });

    describe("when it's passed a parameter of false", ()=>{
      beforeEach(()=>{
        navigation._setBodyClass(false);
      });

      it('should add the "nav-open" class to this.bodyClass', ()=>{
        expect(navigation.body.className).toContain('nav-open');
      });
    });

    describe("when it's passed a parameter of true", ()=>{
      beforeEach(()=>{
        navigation._setBodyClass(true);
      });

      it('should not add the "nav-open" class to this.bodyClass', ()=>{
        expect(navigation.body.className).not.toContain('nav-open');
      });
    });
  });

  describe('_setDropdownAriaHiddenDesktop function', ()=>{
    let dropdown, dropdownParent, hoverSpy, listItems;

    beforeEach(()=>{
      hoverSpy = jasmine.createSpyObj('e', ['preventDefault']);
      listItems = navigation.list.getElementsByTagName('li');

      _.forEach(listItems, function(li){
        if (li.className === navigation.config.dropdown_class){
          navigation.dropdownParents.push(li);
        }
      });

      dropdownParent = navigation.dropdownParents[0];
      dropdown = dropdownParent.getElementsByTagName('ul')[0];
    });

    describe('when the _deviceCheck function returns false', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(false);
      });

      describe('and the offsetParent property of the dropdown returns null', ()=>{
        beforeEach(()=>{
          dropdownParent.style.display = 'none';
          dropdown.setAttribute('aria-hidden', 'false');

          navigation._setDropdownAriaHiddenDesktop(dropdownParent, hoverSpy);
        });

        it('should set the "aria-hidden" attribute of the dropdown to "true"', ()=>{
          expect(dropdown.getAttribute('aria-hidden')).toEqual('true');
        });
      });

      describe('and the offsetParent property of the dropdown returns something other than null', ()=>{
        beforeEach(()=>{
          dropdownParent.style.display = 'block';
          dropdown.setAttribute('aria-hidden', 'false');

          navigation._setDropdownAriaHiddenDesktop(dropdownParent, hoverSpy);
        });

        it('should set the "aria-hidden" attribute of the dropdown to "false"', ()=>{
          expect(dropdown.getAttribute('aria-hidden')).toEqual('false');
        });
      });
    });
  });

  describe('_setDropdownAriaHiddenMobile function', ()=>{
    let dropdown, dropdownParent, dropdownToggle, listItems;

    beforeEach(()=>{
      listItems = navigation.list.getElementsByTagName('li');

      _.forEach(listItems, function(li){
        if (li.className === navigation.config.dropdown_class){
          navigation.dropdownParents.push(li);
        }
      });

      dropdownParent = navigation.dropdownParents[0];

      dropdownToggle = dropdownParent.children[0];

      dropdown = dropdownToggle.nextSibling;

      spyOn(navigation, '_skipTextNodes').and.returnValue(dropdown);
    });

    describe('and the offsetParent property of the dropdown returns null', ()=>{
      beforeEach(()=>{
        dropdownParent.style.display = 'none';
        dropdown.setAttribute('aria-hidden', 'false');

        navigation._setDropdownAriaHiddenMobile(dropdownToggle);
      });

      it('should set the "aria-hidden" attribute of the dropdown to "true"', ()=>{
        expect(dropdown.getAttribute('aria-hidden')).toEqual('true');
      });
    });

    describe('and the offsetParent property of the dropdown returns something other than null', ()=>{
      beforeEach(()=>{
        dropdownParent.style.display = 'block';
        dropdown.setAttribute('aria-hidden', 'true');

        navigation._setDropdownAriaHiddenMobile(dropdownToggle);
      });

      it('should set the "aria-hidden" attribute of the dropdown to "false"', ()=>{
        expect(dropdown.getAttribute('aria-hidden')).toEqual('false');
      });
    });
  });

  describe('_setListClass function', ()=>{
    let hidden;

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        hidden = true;
        navigation.list.className = 'open';

        navigation._setListClass(hidden);
      });

      it('should remove the "open" class from this.list', ()=>{
        expect(navigation.list.className).not.toContain('open');
      });
    });

    describe('when it is passed a parameter of false', ()=>{
      beforeEach(()=>{
        hidden = false;

        navigation._setListClass(hidden);
      });

      it('should add the "open" class to this.list', ()=>{
        expect(navigation.list.className).toContain('open');
      });
    });
  });

  describe('_setToggleAriaExpanded function', ()=>{
    describe("when it's passed a parameter of false", ()=>{
      beforeEach(()=>{
        navigation._setToggleAriaExpanded(false);
      });

      it('should set the "aria-expanded" attribute of this.toggle to true', ()=>{
        expect(navigation.toggle.getAttribute('aria-expanded')).toEqual('true');
      });
    });

    describe("when it's passed a parameter of true", ()=>{
      beforeEach(()=>{
        navigation._setToggleAriaExpanded(true);
      });

      it('should set the "aria-expanded" attribute of this.toggle to false', ()=>{
        expect(navigation.toggle.getAttribute('aria-expanded')).toEqual('false');
      });
    });
  });

  describe('_setToggleAriaHidden function', ()=>{
    describe("when it's passed a parameter of false", ()=>{
      beforeEach(()=>{
        navigation._setToggleAriaHidden(false);
      });

      it('should set the "aria-hidden" attribute of this.toggle to false', ()=>{
        expect(navigation.toggle.getAttribute('aria-hidden')).toEqual('false');
      });
    });

    describe("when it's passed a parameter of true", ()=>{
      beforeEach(()=>{
        navigation._setToggleAriaHidden(true);
      });

      it('should set the "aria-hidden" attribute of this.toggle to false', ()=>{
        expect(navigation.toggle.getAttribute('aria-hidden')).toEqual('true');
      });
    });
  });

  // describe('_skipTextNodes function', ()=>{
  // });

  describe('_toggleClick function', ()=>{
    let clickSpy;

    beforeEach(()=>{
      clickSpy = jasmine.createSpyObj('e', ['preventDefault']);

      spyOn(navigation, '_hideNav');

      navigation._toggleClick(clickSpy);
    });

    it('should call e.preventDefault', ()=>{
      expect(clickSpy.preventDefault).toHaveBeenCalled();
    });

    it('should call the _hideNav function', ()=>{
      expect(navigation._hideNav).toHaveBeenCalled();
    });
  });

  describe('_toggleDropdown function', ()=>{
    let dropdown, dropdownParent, dropdownToggle, listItems;

    beforeEach(()=>{
      listItems = navigation.list.getElementsByTagName('li');

      _.forEach(listItems, function(li){
        if (li.className === navigation.config.dropdown_class){
          navigation.dropdownParents.push(li);
        }
      });

      _.forEach(navigation.dropdownParents, function(dropdownParent){
        navigation.dropdownToggles.push(dropdownParent.children[0]);
      });

      dropdownParent = navigation.dropdownParents[0];
      dropdown = dropdownParent.getElementsByTagName('ul')[0];
      dropdownToggle = navigation.dropdownToggles[0];
    });

    describe('when the offsetParent property of the dropdown returns null', ()=>{
      beforeEach(()=>{
        dropdownParent.style.display = 'none';

        navigation._toggleDropdown(dropdownToggle);
      });

      it('should set the display property of the dropdown to be "block"', ()=>{
        expect(dropdown.style.display).toEqual('block');
      });

      it('should add the "open" class to the dropdownToggle', ()=>{
        expect(dropdownToggle.className).toContain('open');
      });
    });

    describe('when the offsetParent property of the dropdown returns something other than null', ()=>{
      beforeEach(()=>{
        dropdownParent.style.display = 'block';

        navigation._toggleDropdown(dropdownToggle);
      });

      it('should set the display property of the dropdown to be "none"', ()=>{
        expect(dropdown.style.display).toEqual('none');
      });

      it('should remove the "open" class from the dropdownToggle', ()=>{
        expect(dropdownToggle.className).not.toContain('open');
      });
    });
  });

  describe('_trackSize function', ()=>{
    beforeEach(()=>{
      spyOn(navigation, '_hideNav');
      spyOn(navigation, '_setToggleAriaHidden');
    });

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_resetDropdownParentsStates');

        navigation._trackSize('desktop', {height: 568, width: 1680});
      });

      it('should call the _resetDropdownParentsStates function', ()=>{
        expect(navigation._resetDropdownParentsStates).toHaveBeenCalled();
      });

      it('should set this.size to be the value of the size parameter', ()=>{
        expect(navigation.size).toEqual({height: 568, width: 1680});
      });
    });

    describe('when this.device is not strictly equal to the device parameter', ()=>{
      beforeEach(()=>{
        navigation.device = 'mobile';

        navigation._trackSize('desktop', {height: 568, width: 1680});
      });

      it('should set this.device to be the value of the device parameter', ()=>{
        expect(navigation.device).toEqual('desktop');
      });
    });

    describe('when the _deviceCheck function returns true', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(true);

        navigation._trackSize('desktop', {height: 568, width: 1680});
      });

      it('should call the _hideNav function with a parameter of true', ()=>{
        expect(navigation._hideNav).toHaveBeenCalledWith(true);
      });

      it('should call the _setToggleAriaHidden function with a parameter of false', ()=>{
        expect(navigation._setToggleAriaHidden).toHaveBeenCalledWith(false);
      });
    });

    describe('when the _deviceCheck function returns false', ()=>{
      beforeEach(()=>{
        spyOn(navigation, '_deviceCheck').and.returnValue(false);

        navigation._trackSize('desktop', {height: 568, width: 1680});
      });

      it('should call the _hideNav function with a parameter of false', ()=>{
        expect(navigation._hideNav).toHaveBeenCalledWith(false);
      });

      it('should call the _setToggleAriaHidden function with a parameter of true', ()=>{
        expect(navigation._setToggleAriaHidden).toHaveBeenCalledWith(true);
      });
    });
  });
});
/* eslint-enable */
