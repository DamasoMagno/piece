const bodyChildren = document.querySelectorAll("body *");
const tags = [...bodyChildren];
const customTagsFiltered = tags.filter(tag => customTagsFilter(tag));
const tagsFormatted = customTagsFiltered.map( item => formattTags(item));

function customTagsFilter(tag){
  return tag.tagName.includes("-component".toUpperCase());
}

function formattTags(item){
  const componentName = item.tagName.split("-")[0];
  return componentName[0] + componentName.slice(1, componentName.length).toLowerCase();
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
      const link = document.createElement("link");
      link.href = `../../HTMLComponents/${className}/style.css`;
      link.rel = "stylesheet";
      this.appendChild(link);
    }

    setOwnAttributes(){
      const element = document.querySelector(`${this.dataset.tag}`);

      if(this.dataset.attribute){
        const [attributeName, attributeValue] = this.dataset.attribute.split("-");
        element.setAttribute(attributeName, attributeValue);
      }

      if(element && !element.innerHTML){
        element.innerHTML = this.dataset.html || `Tag don't have content`;
      }

      const datasetKeys = Object.keys(this.dataset);
      for(const key of datasetKeys){
        delete this.dataset[key];
      }
    }

    connectedCallback() {
      this.generateStyle();
      this.innerHTML += response;
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
    return response.text();
  })
  .then(response => createCustomTag(component, response));
  
}

getAllComponents()
.then( Components => {
  for(const Component of Components){
    const componentsExists = tagsFormatted.find(tag => Component.name === tag);
    if(!componentsExists){
      continue;
    }

    renderComponent(componentsExists);
  }
});