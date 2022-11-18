/* Slider */
// Source: https://stackoverflow.com/questions/58353280/prevent-click-when-leave-drag-to-scroll-in-js/58353989#58353989
// https://stackabuse.com/how-to-create-a-draggable-carousel-using-vanilla-javascript/
const slider = document.querySelector(".slider");

const preventClick = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
};

let isDown = false;
var isDragged = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  slider.style.cursor = "grabbing";
});
slider.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.changedTouches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  slider.style.cursor = "grabbing";
});

slider.addEventListener("mouseenter", () => {
  slider.style.cursor = "grab";
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.style.cursor = "default";
});
slider.addEventListener("touchleave", () => {
  isDown = false;
  slider.style.cursor = "default";
});

slider.addEventListener("mouseup", (e) => {
  isDown = false;
  const elements = document.getElementsByClassName("slider-image-container");
  if (isDragged) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", preventClick);
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener("click", preventClick);
    }
  }
  isDragged = false;
  slider.style.cursor = "grab";
});
slider.addEventListener("touchend", (e) => {
  isDown = false;
  const elements = document.getElementsByClassName("slider-image-container");
  if (isDragged) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", preventClick);
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener("click", preventClick);
    }
  }
  isDragged = false;
  slider.style.cursor = "grab";
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  isDragged = true;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});
slider.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  isDragged = true;
  e.preventDefault();
  const x = e.changedTouches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

/* Slider Mobile */
// Source: https://stackoverflow.com/questions/58353280/prevent-click-when-leave-drag-to-scroll-in-js/58353989#58353989
// https://stackabuse.com/how-to-create-a-draggable-carousel-using-vanilla-javascript/
const sliderMobile = document.querySelector(".slider.mobile");

sliderMobile.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - sliderMobile.offsetLeft;
  scrollLeft = sliderMobile.scrollLeft;
  sliderMobile.style.cursor = "grabbing";
});
sliderMobile.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.changedTouches[0].pageX - sliderMobile.offsetLeft;
  scrollLeft = sliderMobile.scrollLeft;
  sliderMobile.style.cursor = "grabbing";
});

sliderMobile.addEventListener("mouseenter", () => {
  sliderMobile.style.cursor = "grab";
});

sliderMobile.addEventListener("mouseleave", () => {
  isDown = false;
  sliderMobile.style.cursor = "default";
});
sliderMobile.addEventListener("touchleave", () => {
  isDown = false;
  sliderMobile.style.cursor = "default";
});

sliderMobile.addEventListener("mouseup", (e) => {
  isDown = false;
  const elements = document.getElementsByClassName("slider-image-container");
  if (isDragged) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", preventClick);
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener("click", preventClick);
    }
  }
  isDragged = false;
  sliderMobile.style.cursor = "grab";
});
sliderMobile.addEventListener("touchend", (e) => {
  isDown = false;
  const elements = document.getElementsByClassName("slider-image-container");
  if (isDragged) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", preventClick);
    }
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeEventListener("click", preventClick);
    }
  }
  isDragged = false;
  sliderMobile.style.cursor = "grab";
});

sliderMobile.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  isDragged = true;
  e.preventDefault();
  const x = e.pageX - sliderMobile.offsetLeft;
  const walk = (x - startX) * 2;
  sliderMobile.scrollLeft = scrollLeft - walk;
});
sliderMobile.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  isDragged = true;
  e.preventDefault();
  const x = e.changedTouches[0].pageX - sliderMobile.offsetLeft;
  const walk = (x - startX) * 2;
  sliderMobile.scrollLeft = scrollLeft - walk;
});

/* Fetch Data */
const category_UI = document.querySelector(".subheader-container").innerHTML;

if (category_UI == "Peste") {
  fetch("/static/prediction-data/json/pests.json")
    .then((response) => response.json())
    .then((json) => {
      const prediction = document.querySelector(".prediction-desc-container > span").innerHTML;

      let pestData = json.find((item) => item.pest == prediction);

      //Scientific Name
      let scientificName = document.querySelector("#scientific-name-js");
      scientificName.innerHTML = pestData.scientificName;

      // Descriptions
      let descriptions = document.querySelector("#descriptions-js");
      pestData.descriptions.forEach((description) => {
        descriptions.innerHTML += `<span>${description}</span>`;
      });

      // Images
      let images = document.querySelector("#images-js");
      pestData.images.forEach((image) => {
        images.innerHTML += `
          <div class="slider-image-container">
            <img src="/static/prediction-data/${image}" />
          </div>
        `;
      });

      let imagesMobile = document.querySelector("#images-mobile-js");
      pestData.images.forEach((image) => {
        imagesMobile.innerHTML += `
          <div class="slider-image-container">
            <img src="/static/prediction-data/${image}" />
          </div>
        `;
      });

      // Life Cycle
      let lifeCycle = document.querySelector("#life-cycle-js");
      Object.entries(pestData.lifeCycle).forEach(([key, value]) => {
        lifeCycle.innerHTML += `
          <div class="life-cycle">
            <span>${key}</span>
            <span>${value}</span>
          </div>
        `;
      });

      // Damages
      let damages = document.querySelector("#damages-js");
      pestData.damages.forEach((damage) => {
        damages.innerHTML += `<span class="damage">${damage}</span>`;
      });

      // Controls
      let controls = document.querySelector("#controls-js");
      pestData.controls.forEach((control) => {
        let temp = `
        <div class="control">
          <span>${control.method}</span>
          <div class="control-process">`;
        control.process.forEach((process) => {
          temp += `<span>${process}</span>`;
        });
        temp += "</div></div>";

        controls.innerHTML += temp;
      });
    });
} else if (category_UI == "Sakit") {
  fetch("/static/prediction-data/json/diseases.json")
    .then((response) => response.json())
    .then((json) => {
      const prediction = document.querySelector(".prediction-desc-container > span").innerHTML;

      let diseaseData = json.find((item) => item.disease == prediction);

      //Scientific Name
      let scientificName = document.querySelector("#scientific-name-js");
      scientificName.innerHTML = diseaseData.scientificName;

      // Descriptions
      let descriptions = document.querySelector("#descriptions-js");
      diseaseData.descriptions.forEach((description) => {
        descriptions.innerHTML += `<span>${description}</span>`;
      });

      // Images
      let images = document.querySelector("#images-js");
      diseaseData.images.forEach((image) => {
        images.innerHTML += `
          <div class="slider-image-container">
            <img src="/static/prediction-data/${image}" />
          </div>
        `;
      });

      let imagesMobile = document.querySelector("#images-mobile-js");
      diseaseData.images.forEach((image) => {
        imagesMobile.innerHTML += `
          <div class="slider-image-container">
            <img src="/static/prediction-data/${image}" />
          </div>
        `;
      });

      // Damages
      let damages = document.querySelector("#damages-js");
      diseaseData.damages.forEach((damage) => {
        damages.innerHTML += `<span class="damage">${damage}</span>`;
      });

      // Controls
      let controlProcesses = document.querySelector("#control-processes-js");
      diseaseData.controls.forEach((control) => {
        controlProcesses.innerHTML += `<span>${control}</span>`;
      });
    });
}

// Back button clicked
const back = document.querySelector(".back-js");

back.addEventListener("click", () => {
  window.location.href = "/";
});
