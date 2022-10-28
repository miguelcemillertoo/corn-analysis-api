fetch("/static/prediction-data/json/nutrients.json")
  .then((response) => response.json())
  .then((json) => {
    let prediction = document.querySelector("#leaf-color-js").innerHTML;
    prediction = prediction.slice(1);

    let nutrientData = json.find((item) => item.leafColor == prediction);

    //Nitrogen
    let nitrogens = document.querySelector("#nitrogens-js");
    nutrientData.nitrogen.forEach((nitrogen) => {
      nitrogens.innerHTML += `<span>${nitrogen}</span>`;
    });

    // Image
    let image = document.querySelector("#image-js");
    image.innerHTML += `<img src="/static/prediction-data/${nutrientData.image}" />`;
  });
