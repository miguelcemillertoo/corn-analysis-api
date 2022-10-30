// Data Validation
let data = {
  barangay: "",
  stage: "",
  category: "",
  image: null,
};

const dataValidation = () => {
  if (
    data.barangay == "" ||
    data.stage == "" ||
    data.category == "" ||
    document.querySelector(".image-container").classList.contains("hidden")
  ) {
    // Disable Primary Button
    document.querySelector(".predict-js").classList.add("disabled");
    return false;
  } else {
    // Enable Primary Button
    document.querySelector(".predict-js").classList.remove("disabled");
    return true;
  }
};

/* Select Barangay */
const selectBarangay = document.querySelector("#select-barangay-js");

// set barangay to data object
data.barangay = selectBarangay.value;

selectBarangay.addEventListener("change", function () {
  data.barangay = selectBarangay.value;
});

/* Predict */
document.querySelector(".predict-js").addEventListener("click", function () {
  // show spinner
  document.querySelector(".spinner-container").classList.remove("hidden");
  document.querySelector(".predict-js").classList.add("hidden");

  // hide error container
  document.querySelector(".error-container").classList.add("hidden");

  let formData = new FormData();
  formData.append("barangay", data.barangay);
  formData.append("stage", data.stage);
  formData.append("category", data.category);
  formData.append("image", data.image);

    fetch("/submit", {
    method: "POST",
    body: formData,
  }).then((response) => {
    let data = response.json();
    console.log(data);
  });
  
});

/* Mobile Detection */
const cameraInput = document.querySelector("#camera-input-js");
const webcamInput = document.querySelector("#webcam-input-js");

const webcamVideoCaptureContainer = document.querySelector(
  ".webcam-video-capture-container"
);

const webcamVideoContainer = document.querySelector(".webcam-video-container");
const webcamCapture = document.querySelector(".webcam-capture");

const canvasContainer = document.querySelector(".canvas-container");

const imageContainer = document.querySelector(".image-container");
const imageContainerImg = document.querySelector(".image-container > img");

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // Mobile
  cameraInput.classList.remove("hidden");
  webcamInput.classList.add("hidden");
} else {
  // Desktop
  cameraInput.classList.add("hidden");
  webcamInput.classList.remove("hidden");
}

/* Webcam Input Click */
webcamInput.addEventListener("click", async function () {
  // hide webcam video capture
  webcamVideoCaptureContainer.classList.add("hidden");
  // reset image container
  document.querySelector(".image-container").classList.add("hidden");
  document.querySelector(".image-container > img").src = "";

  let stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
    audio: false,
  });
  // show webcam video
  webcamVideoContainer.srcObject = stream;
  webcamVideoCaptureContainer.classList.remove("hidden");
});

/* Webcam Video Capture Container Mouseover */
webcamVideoCaptureContainer.addEventListener("mouseover", function () {
  // show capture
  webcamCapture.classList.remove("hidden");
});

webcamVideoCaptureContainer.addEventListener("mouseout", function () {
  // hide capture
  webcamCapture.classList.add("hidden");
});

/* Webcam Capture Click */
webcamCapture.addEventListener("click", async function () {
  // hide webcam video capture container
  webcamVideoCaptureContainer.classList.add("hidden");
  // show image container
  imageContainer.classList.remove("hidden");

  canvasContainer
    .getContext("2d")
    .drawImage(
      webcamVideoContainer,
      0,
      0,
      canvasContainer.width,
      canvasContainer.height
    );

  // get dataURL
  let dataURL = canvasContainer.toDataURL("image/jpeg");
  // set to image container img
  imageContainerImg.src = dataURL;

  // convert dataURL to blob
  const blob = await (await fetch(dataURL)).blob();
  // convert blob to file
  const file = new File([blob], "webcam-capture.jpg", {
    type: "image/jpeg",
    lastModified: new Date(),
  });

  // save to data object
  data.image = file;

  // Data Validation
  dataValidation();
});

/* Toggle Icons */
const stageIcons = document.querySelectorAll(".stage-icon-container");
const categoryIcons = document.querySelectorAll(".category-icon-container");

const defaultColor = "#9BA29B";
const selectedColor = "#5CCA55";

const iconsListener = (icons) => {
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      // Reset all icons
      icons.forEach((icon) => {
        icon.classList.remove("icon-selected");
        icon.querySelector("svg").setAttribute("fill", defaultColor);
        icon.querySelector("span").style.color = defaultColor;
        icon.classList.add("icon-hover");
      });

      // Selected
      icon.classList.add("icon-selected");
      icon.querySelector("svg").setAttribute("fill", selectedColor);
      icon.querySelector("span").style.color = selectedColor;
      icon.classList.remove("icon-hover");

      // Log selected icon
      temp = icon.querySelector("span").innerHTML;
      // Assign to declared variables for Pest, Category
      if (icons.length == 18) {
        data.stage = temp;
      } else {
        data.category = temp;
      }

      // console.log(temp);
      // Data Validation
      dataValidation();
    });
  });
};

iconsListener(stageIcons);
iconsListener(categoryIcons);

/* Animate Sections */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-section");
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden-section");
hiddenElements.forEach((el) => observer.observe(el));

/* Add Uploaded Image */
document
  .querySelector("#gallery-input")
  .addEventListener("change", previewImage);

document
  .querySelector("#camera-input")
  .addEventListener("change", previewImage);

function previewImage() {
  // hide webcam video capture container
  webcamVideoCaptureContainer.classList.add("hidden");
  // show image container
  imageContainer.classList.remove("hidden");
  const file = this.files[0];
  // Update Image data object
  data.image = file;
  const reader = new FileReader();

  reader.onloadend = function () {
    imageContainerImg.src = reader.result;
  };

  if (file.type.match("image.*")) {
    reader.readAsDataURL(file);
  } else {
    document.querySelector(".image-container").classList.add("hidden");
    imageContainerImg.src = "";
  }

  // Data Validation
  dataValidation();
}

/* Slider */
// Source: https://stackoverflow.com/questions/58353280/prevent-click-when-leave-drag-to-scroll-in-js/58353989#58353989
// https://stackabuse.com/how-to-create-a-draggable-carousel-using-vanilla-javascript/
const slider = document.querySelector(".slider-stages");

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
  const elements = document.getElementsByClassName("book");
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
  const elements = document.getElementsByClassName("stage-icon-container");
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

/* Modal */
let moreInfo = document.querySelector(".more-info-js");
let modalContainer = document.querySelector(".modal-container");
let modalContent = document.querySelector(".modal-content");

moreInfo.addEventListener("click", () => {
  modalContainer.classList.remove("hidden");
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalContent) {
    modalContainer.classList.add("hidden");
  }
};
