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

function removeDeadTags(component = false){
  if(!!component.length){
    customTagsFiltered.forEach(tag => {
      if(tag.tagName.split("-")[0] !== component.toUpperCase()){
        body.removeChild(tag);
      }
    });

    return;
  }  

  customTagsFiltered.forEach(tag => {
    body.removeChild(tag);
  });
} 

getAllComponents()
.then( Components => {
  if(!!Components.length){
    for (const Component of Components) {
      const componentsExists = verifyIfComponentExist(Component) && Component.name;
      if (!componentsExists) {
        continue;
      }
      renderComponent(componentsExists);
    }
    return;
  }
  removeDeadTags();
});


function createCustomTag(className, contentHTML){
  const classes = {};
  classes[className] = class extends HTMLElement {
    constructor(){
      super();
    }

    formatSelector(selector){
      return selector === "id" ? "#" : ".";
    }

    createSelector(key, nameSelectorPosition, typeAttributePosition){
      const typeSelector = this.formatSelector(key.slice(0, nameSelectorPosition));
      const nameSelector = key.slice(nameSelectorPosition, typeAttributePosition).toLowerCase();

      const selector = typeSelector.concat(nameSelector);
      return selector;
    }

    generateStyle(){
      const head = document.querySelector("head");
      const link = document.createElement("link");

      link.href = `../../Components/${className}/style.css`;
      link.rel = "stylesheet";
      head.appendChild(link);
    }

    setContentOfAttributes(data){
      const { type, element, content } = data;

      if(type === "html" && element){
        element.innerHTML = content;
        return;
      }


      if(type === "attributes" && element){
        content.split(",").forEach( attribute => {
          const [attributeType, attributeValue] = attribute.split("-");
          if(!!element.classList.length && attributeType.trim("") === "class"){
            element.classList.add(attributeValue);
            return;
          }

          element.setAttribute(attributeType.trim(""), attributeValue.trim(""));
        });
      }

    }

    setOwnAttributes(){
      Object.keys(this.dataset)
      .forEach( key => {
        let typeAttributePosition = "";
        let nameSelectorPosition = "";
        
        for(const letter of key){
          if(letter === letter.toUpperCase()){
            if(nameSelectorPosition){
              typeAttributePosition = key.indexOf(letter);
              continue; //return
            }

            nameSelectorPosition = key.indexOf(letter);
          }
        }
                
        const type = key.slice(typeAttributePosition).toLowerCase();
        const content = this.dataset[key];

        const selector = this.createSelector(key, nameSelectorPosition, typeAttributePosition);
        const element = document.querySelector(`${selector}`);

        const data = { type, content, element }
        this.setContentOfAttributes(data);
      });
    }

    renderComponent(){      
      const domParser = new DOMParser();
      const responseToHTML = domParser.parseFromString(contentHTML, "text/html");
      this.replaceWith(responseToHTML.body.children[0]);
    }

    connectedCallback() {
      this.generateStyle();
      this.renderComponent();
      this.setOwnAttributes();
    }
  }
  
  let nameOfComponent = `${className.toLowerCase()}-component`;
  customElements.define(nameOfComponent, classes[className]);
}

function renderComponent(component){
  fetch(`./Components/${component}/index.html`)
  .then(response => {
    if(response.status === 404){
      return "";
    }

    return response.text()
  }).then(response => createCustomTag(component, response));
}
