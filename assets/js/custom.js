(function($) {
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu");
  var close = document.getElementById("menu-close");

  toggle.addEventListener("click", function(e) {
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
    } else {
      menu.classList.add("open");
    }
  });

  close.addEventListener("click", function(e) {
    menu.classList.remove("open");
  });

  // Close menu after click on smaller screens
  $(window).on("resize", function() {
    if ($(window).width() < 846) {
      $(".main-menu a").on("click", function() {
        menu.classList.remove("open");
      });
    }
  });

  $(".owl-carousel").owlCarousel({
    items: 4,
    lazyLoad: true,
    loop: true,
    dots: true,
    margin: 30,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  });

  $(".hover").mouseleave(function() {
    $(this).removeClass("hover");
  });

  $(".isotope-wrapper").each(function() {
    var $isotope = $(".isotope-box", this);
    var $filterCheckboxes = $('input[type="radio"]', this);

    var filter = function() {
      var type = $filterCheckboxes.filter(":checked").data("type") || "*";
      if (type !== "*") {
        type = '[data-type="' + type + '"]';
      }
      $isotope.isotope({ filter: type });
    };

    $isotope.isotope({
      itemSelector: ".isotope-item",
      layoutMode: "masonry"
    });

    $(this).on("change", filter);
    filter();
  });

  lightbox.option({
    resizeDuration: 200,
    wrapAround: true
  });

  // Custom Cursor Logic
  const cursor = document.getElementById('custom-cursor');
  let lastX = 0;
  let lastY = 0;
  let cursorAngle = 90; // Default angle (pointing up)

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Update cursor position
    cursor.style.left = `${x - 20}px`; // Center the 40px cursor
    cursor.style.top = `${y - 20}px`;
    
    // Calculate movement direction
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    
    // Only update rotation if there's significant movement
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        // Calculate angle in radians and convert to degrees
        // Adding 90 degrees because the rocket points up by default
        cursorAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    }
    
    // Apply rotation
    cursor.style.transform = `rotate(${cursorAngle}deg)`;

    // Create smoke particles
    if (Math.abs(x - lastX) > 5 || Math.abs(y - lastY) > 5) {
        createSmoke(x, y, cursorAngle);
        lastX = x;
        lastY = y;
    }
  });

  function createSmoke(x, y, angle) {
      // Spawn multiple particles for a denser trail
      for (let i = 0; i < 3; i++) {
          const smoke = document.createElement('div');
          smoke.classList.add('smoke-particle');
          document.body.appendChild(smoke);

          // Position smoke at the tail of the rocket
          const rad = (angle - 90) * (Math.PI / 180); 
          const offsetX = -Math.cos(rad) * 20;
          const offsetY = -Math.sin(rad) * 20;

          // Randomize start position slightly
          const startJitter = (Math.random() - 0.5) * 6;
          smoke.style.left = `${x + offsetX + startJitter}px`;
          smoke.style.top = `${y + offsetY + startJitter}px`;
          
          // Randomize size
          const size = 4 + Math.random() * 6;
          smoke.style.width = `${size}px`;
          smoke.style.height = `${size}px`;

          // Calculate backward movement
          const spread = (Math.random() - 0.5) * 1.0; // Wider spread
          const distance = 10 + Math.random() * 20;
          
          const moveX = -Math.cos(rad + spread) * distance;
          const moveY = -Math.sin(rad + spread) * distance;
          
          smoke.style.setProperty('--tx', `${moveX}px`);
          smoke.style.setProperty('--ty', `${moveY}px`);

          // Remove particle after animation
          setTimeout(() => {
              smoke.remove();
          }, 400);
      }
  }

})(jQuery);
