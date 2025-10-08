    document.addEventListener('DOMContentLoaded', () => {

      /**
       * Generates a string for the 'box-shadow' CSS property.
       * @param {number} numberOfStars - The number of stars to generate.
       * @returns {string} A string of 'x y color' values.
       */
      function generateStars(numberOfStars) {
        let shadow = [];
        for (let i = 0; i < numberOfStars; i++) {
          // Generates a random position between 0 and 2000 to match the animation space
          const x = Math.floor(Math.random() * 2000);
          const y = Math.floor(Math.random() * 2000);
          shadow.push(`${x}px ${y}px #FFF`);
        }
        return shadow.join(', ');
      }

      // --- 🚀 CHANGE THESE NUMBERS TO ADD/REMOVE STARS ---
      const smallStarsCount = 700;
      const mediumStarsCount = 200;
      const bigStarsCount = 100;
      // ----------------------------------------------------

      // Generate the star shadows
      const shadowsSmall = generateStars(smallStarsCount);
      const shadowsMedium = generateStars(mediumStarsCount);
      const shadowsBig = generateStars(bigStarsCount);

      // Get the star elements
      const starsSmall = document.getElementById('stars');
      const starsMedium = document.getElementById('stars2');
      const starsBig = document.getElementById('stars3');

      // Apply the generated shadows to the elements and their ::after pseudo-elements
      starsSmall.style.boxShadow = shadowsSmall;
      starsMedium.style.boxShadow = shadowsMedium;
      starsBig.style.boxShadow = shadowsBig;
      
      // We must also apply the shadows to the ::after elements for the loop to be seamless.
      // Since we can't directly style pseudo-elements with JS, we inject a <style> tag into the head.
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        #stars:after { box-shadow: ${shadowsSmall}; }
        #stars2:after { box-shadow: ${shadowsMedium}; }
        #stars3:after { box-shadow: ${shadowsBig}; }
      `;
      document.head.appendChild(styleSheet);
    });