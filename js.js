let newItemForm = document.querySelector("form");
newItemForm.addEventListener("submit", submit);
document.querySelector("#discard").addEventListener("click", () => close(true));
document.querySelector("#close").addEventListener("click", () => close(false));
document.querySelector("#newItem").addEventListener("click", open);
let pictures = [...document.getElementsByClassName("picture")];
for (pic of pictures) {
  pic.addEventListener("click", toggleImage);
}
let sortButtons = document.querySelectorAll('.sorting > button');
for (btn of sortButtons) {
    btn.addEventListener('click', sortControl);
}

class Storage {
  static getItem(id) {
    return JSON.parse(this.storage.getItem(id));
  }
  static setItem(id, obj) {
    const string = JSON.stringify(obj);
    this.storage.setItem(id, string);
    this.lastId = id;
  }

  static getLastId() {
    return this.lastId;
  }
  static storage = window.sessionStorage;
  static lastId = -1;
}
//init 2 items
(function () {
  let obj1 = {
    name: "Margherita",
    price: "3.99",
    heat: "1",
    toppings: ["mozzarella", "feta", "tomatoes", "spinach"],
    photo: "pexels-ponyo-sakana-5108601.webp",
  };
  let obj2 = {
    name: "Tomato and Mushroom",
    price: "4.49",
    heat: "1",
    toppings: ["mozzarella", "tomatoes", "mushrooms"],
    photo: "pexels-pixabay-262977.webp",
  };
  Storage.setItem("0", obj1);
  Storage.setItem("1", obj2);
})();

function close(willReset) {
  if (willReset) {
    newItemForm.reset();
  }
  document.querySelector(".form-cont").classList.add("hidden");
  document.querySelector(".dim").classList.add("hidden");
  const scrollY = document.body.style.top;
  document.body.style = "";
  window.scrollTo(0, parseInt(scrollY || "0") * -1);
}

function open() {
  document.querySelector(".form-cont").classList.remove("hidden");
  document.querySelector(".dim").classList.remove("hidden");
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.zIndex = "0";
  document.body.style.paddingRight = "15px";
}

function submit(e) {
  e.preventDefault();
  let form = new FormData(newItemForm);
  let id = parseInt(Storage.getLastId()) + 1;
  let obj = {};
  let entries = form.entries();
  for (pair of entries) {
    obj[pair[0]] = pair[1];
  }
  obj.toppings = obj.toppings.split(/[ ,]+/);
  Storage.setItem(id, obj);
  console.log(Storage.getItem(id));
  displayCards();
  close(true);
}

function removeItem(e) {
    if(confirm('Are you sure you want to rmeove this item?')){
        sessionStorage.removeItem(e.target.getAttribute("data-id"));
        displayCards();
    }
}

function buildCard(id) {
  let obj = Storage.getItem(id);
  let card = document.createElement("div");
  let topImg = document.createElement("div");
  let h2 = document.createElement("h2");
  let toppings = document.createElement("p");
  let price = document.createElement("p");
  let remove = document.createElement("button");
  card.className = "card";
  card.id = id;
  topImg.className = "top-img";
  if (obj.photo != "none") {
    topImg.style.backgroundImage = `url(img/${obj.photo})`;
  }
  h2.textContent = obj.name;
  appendChili(h2, obj.heat);
  toppings.className = "toppings";
  toppings.appendChild(document.createTextNode(getToppings(obj.toppings)));
  price.className = "price";
  price.textContent = `${obj.price}€`;
  remove.className = "remove";
  remove.setAttribute("data-id", id);
  remove.addEventListener("click", removeItem);
  remove.innerText = "Remove";
  card.append(topImg, h2, toppings, price, remove);
  return card;
}

function appendChili(obj, n) {
    let chili = document.createElement('img');
    chili.src = 'img/chili.svg';
    chili.style.height = '1.5rem';
    chili.style.marginLeft = '0.5rem';
    for (i = 0; i < n; i++) {
        obj.append(chili.cloneNode());
    }
}

function displayCards() {
  let cards = document.querySelectorAll(".card");
  for (card of cards) {
    console.log(card);
    card.remove();
  }
  for (let id of Object.keys(sessionStorage)) {
    let card = buildCard(id);
    document.querySelector(".container").appendChild(card);
  }
}

function getToppings(arr) {
  let toppings = "";
  for (topping of arr) {
    toppings += topping + ", ";
  }
  if (toppings.length < 1) {
    return toppings;
  }
  toppings = toppings.slice(0, toppings.length - 2).concat(".");
  return toppings;
}

function toggleImage(e) {
  for (pic of pictures) {
    pic.classList.remove("active");
  }
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    console.log(e.target.style["backgro"]);
    document.getElementById("photo").value = e.target.style[
      "background-image"
    ].match(/pexels(.*?)webp/)[0];
  }
}

function sortControl(e) {
    if (e.target.classList.contains('active')) {
        return;
    }
    document.querySelector('.sorting .active').classList.remove('active');
    sort(e.target.className);
    e.target.classList.add('active');
}

function sort(mode) {
    const container = document.querySelector('.container');
    let cards = [...document.getElementsByClassName('card')];
    if (mode === 'byName') {
        let names = cards.map(card => card.querySelector('h2').innerText);
        names = names.sort();
        for (name of names) {
            for (card of cards) {
                if (card.querySelector('h2').innerText == name) {
                    container.append(card);
                    break;
                }
            }
        }
    }
    if (mode === 'byHeat') {
        let heats = cards.map(card => [...card.querySelector('h2').children].length);
        heats = heats.sort();
        for (heat of heats) {
            for (card of cards) {
                if (card.querySelector('h2').children.length == heat) {
                    container.append(card);
                    break;
                }
            }
        }
    }
    if (mode === 'byPrice') {
        let prices = cards.map(card => card.querySelector('.price').innerText.slice(0, -1))
        prices = prices.sort();
        for (price of prices) {
            for (card of cards) {
                if (card.querySelector('.price').innerText.search(price) != -1) {
                    container.append(card);
                    break;
                }
            }
        }
    }
}

displayCards();
sort('byName');

