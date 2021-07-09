const bodyChildren = document.querySelector("body").children;
const tags = [...bodyChildren];
const customTagsFiltered = tags.filter(tag => customTagsFilter(tag));
const tagsFormatted = customTagsFiltered.map( item => formattTags(item));

function customTagsFilter(tag){
  return tag.tagName.includes("-component".toUpperCase());
}

function formattTags(item){
  const ComponentName = item.tagName.split("-")[0];
  return ComponentName[0] + ComponentName.slice(1, ComponentName.length).toLowerCase();
}

async function getHTMLComponents(){
  const response = await fetch("./HTMLComponents/Components.json");
  const HTMLComponents = await response.json();
  return HTMLComponents;
}

function createCustomTag(className, response){
  const classes = {};
  classes[className] = class extends HTMLElement {
    constructor(){
      super();
    }

    generateStyle(){
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `../../HTMLComponents/${className}/style.css`;
      this.appendChild(link);
    }

    connectedCallback() {
      this.generateStyle();
      this.innerHTML += response;
    }
  }
  
  const nameOfComponent = `${className.toLowerCase()}-component`;
  customElements.define(nameOfComponent, classes[className]);
}

getHTMLComponents()
.then( Components => {
  for(const Component of Components){
    const customComponent = Component.name;
    if(tagsFormatted == customComponent){
      fetch(`./HTMLComponents/${customComponent}/index.html`)
      .then(response => response.text())
      .then(response => {
        createCustomTag(customComponent, response);
      },
    )}
  }
});