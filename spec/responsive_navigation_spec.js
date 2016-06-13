/* eslint-disable max-len, one-var, require-jsdoc */
const _  = require('lodash');
const ResponsiveNavigationClass = require('../src/responsive_navigation');

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
  ul.id = 'primary-nav-list';

  createListItems(ul);

  document.body.appendChild(ul);

  return ul;
}

function createListItems(ul, items = 3){
  let a, li;
  let range = Array.from(new Array(items).keys());

  _.forEach(range, function(i){
    li = document.createElement('li');
    a = document.createElement('a');

    if (i === 2){
      createDropdown(li);
    }

    a.innerHTML = 'Link ' + i;
    a.setAttribute('href', 'http://www.' + i + '.com');

    li.appendChild(a);
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
  let navContainer, responsive_nav, viewport;

  beforeEach(()=>{
    navContainer = createNav('primary-nav');
    this.list = createList();
    this.toggle = createToggle('primary-nav-toggle', 'Toggle');
    this.toggleMobile = createToggle('primary-nav-mobile-toggle', 'Toggle Mobile');

    navContainer.appendChild(this.toggle);
    navContainer.appendChild(this.toggleMobile);
    navContainer.appendChild(this.list);

    responsive_nav = new ResponsiveNavigationClass(
      'primary-nav',
      {
        list_id: 'primary-nav-list'
        , toggle_id: 'primary-nav-toggle'
        , toggle_mobile_id: 'primary-nav-mobile-toggle'
      }
    );

    viewport = ResponsiveNavigationClass.__get__('viewport');
    this.bodyClass = setBodyClass();

    responsive_nav.dropdownParents = [];
    responsive_nav.dropdownParentsMobile = [];
    responsive_nav.list = document.getElementById(responsive_nav.config.list_id);
    responsive_nav.toggle = document.getElementById(responsive_nav.config.toggle_id);
    responsive_nav.toggleMobile = document.getElementById(responsive_nav.config.toggle_mobile_id);
  });

  afterEach(()=>{
    removeElement(document.getElementById(responsive_nav.config.list_id));
    removeElement(document.getElementById(responsive_nav.config.toggle_id));
  });

  it('should exist', function(){
    expect(responsive_nav).toBeDefined();
  });

  // describe("_addDropdownClickListener function", () => {
    // How do I test this?
  // });

  // describe("_addDropdownHoverListener function", () => {
    // How do I test this?
  // });

  // describe("_addToggleListener function", () => {
    // How do I test this?
  // });

  describe('_deviceCheck function', ()=>{
    describe('when this.device is "mobile"', ()=>{
      beforeEach(()=>{
        responsive_nav.device = 'mobile';
        responsive_nav._deviceCheck();
      });

      it('should return true', ()=>{
        expect(responsive_nav._deviceCheck()).toEqual(true);
      });
    });

    describe('when this.device is "tablet"', ()=>{
      beforeEach(()=>{
        responsive_nav.device = 'tablet';
        responsive_nav._deviceCheck();
      });

      it('should return true', ()=>{
        expect(responsive_nav._deviceCheck()).toEqual(true);
      });
    });

    describe('when this.device is "desktop"', ()=>{
      beforeEach(()=>{
        responsive_nav.device = 'desktop';
        responsive_nav._deviceCheck();
      });

      it('should return true', ()=>{
        expect(responsive_nav._deviceCheck()).toEqual(false);
      });
    });
  });

  describe('_dropdownParentMobileClick function', () => {
    let clickSpy;

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        clickSpy = jasmine.createSpyObj('e', ['preventDefault']);
        responsive_nav._dropdownParentMobileClick(clickSpy);
      });

      it('should call e.preventDefault', ()=>{
        expect(clickSpy.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when _deviceCheck returns true', ()=>{
      beforeEach(()=>{
        spyOn(responsive_nav, '_deviceCheck').and.returnValue(true);
        spyOn(responsive_nav, '_toggleDropdown');
        spyOn(responsive_nav, '_setDropdownAriaHiddenMobile');

        responsive_nav._dropdownParentMobileClick(clickSpy);
      });

      it('should call the _toggleDropdown function', ()=>{
        expect(responsive_nav._toggleDropdown).toHaveBeenCalled();
      });

      it('should call the _setDropdownAriaHiddenMobile function', ()=>{
        expect(responsive_nav._setDropdownAriaHiddenMobile).toHaveBeenCalled();
      });
    });

    describe('when _deviceCheck returns false', ()=>{
      beforeEach(()=>{
        spyOn(responsive_nav, '_deviceCheck').and.returnValue(false);
        spyOn(responsive_nav, '_toggleDropdown');
        spyOn(responsive_nav, '_setDropdownAriaHiddenMobile');

        responsive_nav._dropdownParentMobileClick(clickSpy);
      });

      it('should not call the _toggleDropdown function', ()=>{
        expect(responsive_nav._toggleDropdown).not.toHaveBeenCalled();
      });

      it('should not call the _setDropdownAriaHiddenMobile function', ()=>{
        expect(responsive_nav._setDropdownAriaHiddenMobile).not.toHaveBeenCalled();
      });
    });
  });

  describe('_getBodyClass function', ()=>{
    beforeEach(()=>{
      responsive_nav._getBodyClass();
    });

    it('should assign the document body to this.body', ()=>{
      expect(responsive_nav.body).toEqual(document.body);
    });

    it('should assign the body class to this.bodyClass', ()=>{
      expect(responsive_nav.bodyClass).toEqual(this.bodyClass);
    });
  });

  fdescribe('_getDropdownParents function', ()=>{
    beforeEach(()=>{
      spyOn(responsive_nav, '_addDropdownHoverListener');

      responsive_nav._getDropdownParents();
    });

    it('should push list items with a class of "dropdown-parent" to the dropdownParents array', ()=>{
      expect(responsive_nav.dropdownParents.length).toEqual(1);
    });

    it('should call the addDropdownHoverListener function', ()=>{
      expect(responsive_nav._addDropdownHoverListener).toHaveBeenCalled();
    });
  });

  // describe("getDropdownParentsMobile function", () => {
  // });

  // describe("hideDropdown function", () => {
  // });

  describe("hideNav function", () => {
    beforeEach(() => {
      spyOn(responsive_nav, "setBodyClass");
      spyOn(responsive_nav, "setToggleAriaExpanded");
    });

    it("should assign this.hideMenu to the value of the parameter if the parameter is a boolean", () => {
      responsive_nav.hideNav(true);

      expect(responsive_nav.hideMenu).toEqual(true);
    });

    it("should call the deviceCheck function if the parameter is not a boolean", () => {
      spyOn(responsive_nav, "deviceCheck");

      responsive_nav.hideNav();

      expect(responsive_nav.deviceCheck).toHaveBeenCalled();
    });

    it("should assign this.hideMenu to false if the parameter is not a boolean and the deviceCheck function returns false", () => {
      spyOn(responsive_nav, "deviceCheck").and.returnValue(false);

      responsive_nav.hideNav();

      expect(responsive_nav.hideMenu).toEqual(false);
    });

    it("should assign this.hideMenu to the opposite of this.hideMenu if the parameter is not a boolean and the deviceCheck function returns true", () => {
      spyOn(responsive_nav, "deviceCheck").and.returnValue(true);
      responsive_nav.hideMenu = false;

      responsive_nav.hideNav();

      expect(responsive_nav.hideMenu).toEqual(true);
    });

    it("should call the setBodyClass function and pass this.hideMenu as a parameter", () => {
      responsive_nav.hideNav(true);

      expect(responsive_nav.setBodyClass).toHaveBeenCalledWith(true);
    });

    it("should call the setToggleAriaExpanded function and pass this.hideMenu as a parameter", () => {
      responsive_nav.hideNav(true);

      expect(responsive_nav.setToggleAriaExpanded).toHaveBeenCalledWith(true);
    });
  });

  describe("init function", () => {
    beforeEach(() => {
      spyOn(responsive_nav, "render");

      responsive_nav.init();
    });

    it("should assign the HTML node specified in this.config.toggle_id to this.toggle", () => {
      expect(responsive_nav.toggle).toEqual(this.toggle);
    });

    it("should assign the HTML node specified in this.config.toggle_mobile_id to this.toggle_mobile", () => {
      expect(responsive_nav.toggleMobile).toEqual(this.toggleMobile);
    });

    it("should call the render function", () => {
      expect(responsive_nav.render).toHaveBeenCalled();
    });
  });

  describe("initViewport function", () => {
    beforeEach(() => {
      spyOn(viewport, "getDevice").and.returnValue("desktop");
      spyOn(viewport, "windowSize").and.returnValue({height: 568, width: 1680});
      spyOn(viewport, "trackSize");

      responsive_nav.initViewport();
    });

    it("should assign this.device to the value returned by the viewport.getDevice function", () => {
      expect(responsive_nav.device).toEqual("desktop");
    });

    it("should assign this.size to the value returned by the viewport.windowSize function", () => {
      expect(responsive_nav.size).toEqual({height: 568, width: 1680});
    });

    it("should call the trackSize function", () => {
      expect(viewport.trackSize).toHaveBeenCalled();
    });
  });

  // describe("resetDropdownParentsStates function", () => {
  // });

  describe("setBodyClass function", () => {
    beforeEach(() => {
      responsive_nav.body = document.body;
      responsive_nav.bodyClass = this.bodyClass;
    });

    it("should assign 'nav-open' to this.bodyClass if it's passed a parameter of false", () => {
      responsive_nav.setBodyClass(false);

      expect(responsive_nav.body.className).toContain("nav-open");
    });

    it("should not assign 'nav-open' to this.bodyClass if it's passed a parameter of true", () => {
      responsive_nav.setBodyClass(true);

      expect(responsive_nav.body.className).not.toContain("nav-open");
    });
  });

  // describe("setDropdownAriaHiddenDesktop function", () => {
  // });

  // describe("setDropdownAriaHiddenMobile function", () => {
  // });

  describe("setToggleAriaExpanded function", () => {
    it("should set the 'aria-expanded' attribute of this.toggle to true if it's passed a parameter of false", () => {

      responsive_nav.setToggleAriaExpanded(false);

      expect(responsive_nav.toggle.getAttribute("aria-expanded")).toEqual("true");
    });

    it("should set the 'aria-expanded' attribute of this.toggle to false if it's passed a parameter of true", () => {

      responsive_nav.setToggleAriaExpanded(true);

      expect(responsive_nav.toggle.getAttribute("aria-expanded")).toEqual("false");
    });
  });

  describe("setToggleAriaHidden function", () => {
    it("should set the 'aria-hidden' attribute of this.toggle to true if it's passed a parameter of true", () => {

      responsive_nav.setToggleAriaHidden(true);

      expect(responsive_nav.toggle.getAttribute("aria-hidden")).toEqual("true");
    });

    it("should set the 'aria-hidden' attribute of this.toggle to false if it's passed a parameter of false", () => {

      responsive_nav.setToggleAriaHidden(false);

      expect(responsive_nav.toggle.getAttribute("aria-hidden")).toEqual("false");
    });
  });

  // describe("skipTextNodes function", () => {
  // });

  describe("toggleClick function", () => {
    let clickSpy;

    beforeEach(() => {
      spyOn(responsive_nav, "hideNav");
      clickSpy = jasmine.createSpyObj("e", ["preventDefault"]);

      responsive_nav.toggleClick(clickSpy);
    });

    it("should call the hideNav function", () => {
      expect(responsive_nav.hideNav).toHaveBeenCalled();
    });

    it("should call e.preventDefault", () => {
      expect(clickSpy.preventDefault).toHaveBeenCalled();
    });
  });

  describe("trackSize function", () => {
    beforeEach(() => {
      spyOn(responsive_nav, "hideNav");
      spyOn(responsive_nav, "resetDropdownParentsStates");
      spyOn(responsive_nav, "setToggleAriaHidden");
    });

    it("should call the resetDropdownParentsStates function", () => {
      responsive_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(responsive_nav.resetDropdownParentsStates).toHaveBeenCalled();
    });

    it("should assign the value of the device parameter to this.device if they are not strictly equal", () => {
      responsive_nav.device = "mobile";

      responsive_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(responsive_nav.device).toEqual("desktop");
    });

    describe("when the deviceCheck function returns true", () => {
      beforeEach(() => {
        spyOn(responsive_nav, "deviceCheck").and.returnValue(true);

        responsive_nav.trackSize("desktop", {height: 568, width: 1680});
      });

      it("should call the hideNav function with a parameter of true", () => {
        expect(responsive_nav.hideNav).toHaveBeenCalledWith(true);
      });

      it("should call the setToggleAriaHidden function with a parameter of false", () => {
        expect(responsive_nav.setToggleAriaHidden).toHaveBeenCalledWith(false);
      });
    });

    describe("when the deviceCheck function returns false", () => {
      beforeEach(() => {
        spyOn(responsive_nav, "deviceCheck").and.returnValue(false);

        responsive_nav.trackSize("desktop", {height: 568, width: 1680});
      });

      it("should call the hideNav function with a parameter of false", () => {
        expect(responsive_nav.hideNav).toHaveBeenCalledWith(false);
      });

      it("should call the setToggleAriaHidden function with a parameter of true", () => {
        expect(responsive_nav.setToggleAriaHidden).toHaveBeenCalledWith(true);
      });
    });

    it("should assign the value of the size parameter to this.size", () => {
      responsive_nav.trackSize("desktop", {height: 568, width: 1680});

      expect(responsive_nav.size).toEqual({height: 568, width: 1680});
    });
  });

  describe("render function", () => {
    beforeEach(() => {
      spyOn(responsive_nav, "addToggleListener");
      spyOn(responsive_nav, "getBodyClass");
      spyOn(responsive_nav, "getDropdownParents");
      spyOn(responsive_nav, "hideNav");
      spyOn(responsive_nav, "setToggleAriaHidden");
    });

    it("should call the addToggleListener function", () => {
      responsive_nav.render();

      expect(responsive_nav.addToggleListener).toHaveBeenCalled();
    });

    it("should call the getBodyClass function", () => {
      responsive_nav.render();

      expect(responsive_nav.getBodyClass).toHaveBeenCalled();
    });

    it("should call the hideNav function", () => {
      responsive_nav.render();

      expect(responsive_nav.hideNav).toHaveBeenCalled();
    });

    it("should call the getDropdownParents function", () => {
      responsive_nav.render();

      expect(responsive_nav.getDropdownParents).toHaveBeenCalled();
    });

    it("should call the setToggleAriaHidden function with a paramater of false if the deviceCheck function returns true", () => {
      spyOn(responsive_nav, "deviceCheck").and.returnValue(true);

      responsive_nav.render();

      expect(responsive_nav.setToggleAriaHidden).toHaveBeenCalledWith(false);
    });

    it("should call the setToggleAriaHidden function with a paramater of true if the deviceCheck function returns false", () => {
      spyOn(responsive_nav, "deviceCheck").and.returnValue(false);

      responsive_nav.render();

      expect(responsive_nav.setToggleAriaHidden).toHaveBeenCalledWith(true);
    });
  });
});
/* eslint-enable */
