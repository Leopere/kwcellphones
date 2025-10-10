// Set current year in footer copyright
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Add active class to current navigation link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href)) {
      link.classList.add('active');
    } else if (currentPath === '/' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // Mobile navigation toggle
  function bindMobileNav(root) {
    const navbar = root.querySelector ? root.querySelector('.navbar') : null;
    const toggle = root.querySelector ? root.querySelector('.nav-toggle') : null;
    const primaryNav = root.querySelector ? root.querySelector('#primary-navigation') : null;

    if (!navbar || !toggle || !primaryNav) return;

    // Guard against duplicate bindings
    if (toggle.dataset.bound === 'true') return;
    toggle.dataset.bound = 'true';

    toggle.addEventListener('click', function() {
      const isOpen = navbar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when a nav link is clicked
    primaryNav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        if (navbar.classList.contains('is-open')) {
          navbar.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Attempt to bind immediately (in case header is server-rendered)
  bindMobileNav(document);

  // Also observe the header partial container and bind when it is injected
  const headerHost = document.getElementById('header-partial');
  if (headerHost) {
    const observer = new MutationObserver(function() {
      bindMobileNav(headerHost);
      bindDropdown(headerHost);
    });
    observer.observe(headerHost, { childList: true, subtree: true });
  }

  // Dropdown menu functionality
  function bindDropdown(root) {
    const dropdownToggle = root.querySelector ? root.querySelector('.dropdown-toggle') : null;
    const dropdown = root.querySelector ? root.querySelector('.dropdown') : null;
    const dropdownMenu = root.querySelector ? root.querySelector('.dropdown-menu') : null;

    if (!dropdownToggle || !dropdown || !dropdownMenu) return;

    // Guard against duplicate bindings
    if (dropdownToggle.dataset.dropdownBound === 'true') return;
    dropdownToggle.dataset.dropdownBound = 'true';

    // Toggle dropdown on button click
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Keyboard navigation for dropdown menu
    dropdownMenu.addEventListener('keydown', function(e) {
      const menuItems = dropdownMenu.querySelectorAll('a[role="menuitem"]');
      const currentIndex = Array.from(menuItems).indexOf(document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, menuItems.length - 1);
          menuItems[nextIndex].focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          menuItems[prevIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          menuItems[0].focus();
          break;
        case 'End':
          e.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
      }
    });

    function toggleDropdown() {
      const isOpen = dropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
      dropdownMenu.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        // Focus first menu item when opening
        const firstItem = dropdownMenu.querySelector('a[role="menuitem"]');
        if (firstItem) {
          firstItem.focus();
        }
      }
    }

    function closeDropdown() {
      dropdown.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdownMenu.setAttribute('aria-hidden', 'true');
    }
  }

  // Attempt to bind dropdown immediately
  bindDropdown(document);

});