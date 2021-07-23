import { createCustomTag } from "./scripts/customTag.js";
import { Errors } from "./scripts/errors.js";

const body = document.querySelector("body");
const bodyChildren = document.querySelectorAll("body *");
const customTagsFiltered = [...bodyChildren].filter(tag => customTagsFilter(tag));
const tagsFormatted = customTagsFiltered.map( item => formattTags(item));

function customTagsFilter(tag){
  return tag.tagName.includes("-component".toUpperCase());
}

function formattTags(item){
  return item.tagName.split("-")[0];
}

async function getAllComponents(){
  const response = await fetch("./Components/Components.json");
  const allComponents = await response.json();
  return allComponents;
}

function verifyIfComponentExist(Component){
  const component = Component.name.toUpperCase();
  return tagsFormatted.some(tag => component === tag);
}

function removeDeadTags(){
  customTagsFiltered.forEach(tag => {
    body.removeChild(tag);
  });
} 

getAllComponents()
.then( Components => {
  if(Components.length){
    for(const component of Components){
      const componentsExists = verifyIfComponentExist(component) && component.name;
      if(!componentsExists){
        continue;
      }

      renderComponent(componentsExists);
    }
  }

  removeDeadTags();
});

function renderComponent(component){
  fetch(`./Components/${component}/index.html`)
  .then(response => {
    if(response.status === 404){
      body.innerHTML = Errors.generateHTMLError(response);
      return;
    }
    return response.text()
  })
  .then(response => createCustomTag(component, response));
}