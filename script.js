const bodyChildren = document.querySelectorAll("body *");
const tags = [...bodyChildren];
const customTagsFiltered = tags.filter(tag => customTagsFilter(tag));
const tagsFormatted = customTagsFiltered.map( item => formattTags(item));

function customTagsFilter(tag){
  return tag.tagName.includes("-component".toUpperCase());
}

function formattTags(item){
  return item.tagName.split("-")[0];
}

async function getAllComponents(){
  const response = await fetch("./HTMLComponents/Components.json");
  const allComponents = await response.json();
  return allComponents;
}

function createCustomTag(className, response){
  const classes = {};
  classes[className] = class extends HTMLElement {
    constructor(){
      super();
    }

    generateStyle(){
      const head = document.querySelector("head");
      const link = document.createElement("link");
      link.href = `../../HTMLComponents/${className}/style.css`;
      link.rel = "stylesheet";
      head.appendChild(link);
    }

    setOwnAttributes(){
      Object.keys(this.dataset)
      .forEach( key => {
        const data = this.dataset[key];
        let positionUppcase = 0;

        for(const letter of key){
          if(letter === letter.toUpperCase()){
            positionUppcase = key.indexOf(letter);
          }
        }

        const selector = key.slice(1, positionUppcase - 1);
        const type = key.slice(positionUppcase).toLowerCase();
        const element = document.querySelector(`${selector}`);

        if(type === "html"){
          element.innerHTML = data;
          return;
        }

        if(type === "attribute"){
          if(data[0] === "."){
            element.classList.add(data.slice(1));
            return;
          }

          const [attributeName, attributeValue] = data.split("-");
          element.setAttribute(attributeName, attributeValue);
          return;
        }
      });
      
      const keys = Object.keys(this.dataset);
      for(const key of keys){
        delete this.dataset[key];
      }
    }

    connectedCallback() {
      this.generateStyle();
      const domParser = new DOMParser();
      const responseToHTML = domParser.parseFromString(response, "text/html");
      this.replaceWith(responseToHTML.body.children[0]);

      this.setOwnAttributes();
    }
  }
  
  const nameOfComponent = `${className.toLowerCase()}-component`;
  customElements.define(nameOfComponent, classes[className]);
}

function renderComponent(component){
  fetch(`./HTMLComponents/${component}/index.html`)
  .then(response => {
    if(response.status === 404){
      return "";
    }

    response.text()
    .then(response => createCustomTag(component, response));
  });
}

function componentExist(Component){
  return tagsFormatted.some(tag => Component.name.toUpperCase() === tag);
}

getAllComponents()
.then( Components => {
  for (const Component of Components) {
    const componentsExists = componentExist(Component) ? Component.name : "";
    if (!componentsExists) {
      continue;
    }

    renderComponent(componentsExists);
  }
});