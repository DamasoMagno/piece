const body = document.querySelector("body");
const bodyChildren = body.querySelectorAll("*");
const customTagsFiltered = [...bodyChildren].filter(tag => customTagsFilter(tag));
const tagsFormatted = customTagsFiltered.map( item => formattTags(item));

function customTagsFilter(tag){
  return tag.tagName.includes("-component".toUpperCase());
}

function formattTags(item){
  return item.tagName.split("-")[0];
}

const Errors = {
  generateHTMLError(error){  
    const errorHTML = `
      <div style="width: 80%; max-width: 500px; min-height: 200px; background-color: rgb(196, 0, 0); position: fixed;
      top: 50%; left: 50%; right: 0px; transform: translate(-50%, -50%); border-radius: 6px; padding: 4px;
      box-sizing: border-box; box-shadow: 0px 0px 6px #00000079; border: 2px solid #ff9900;
      letter-spacing: 0.25px;">
        <h4 style="width: 100%; color: #ffd700; border-bottom: 1.4px solid #ff9900; padding-bottom: .3rem; 
        margin-top: .4rem; user-select: none; font-size: 18px;">
          Error: ${error.status} 
        </h4>
        <p style="color: #ffd700; font-size: 16px; word-break: break-all;  
        letter-spacing: .1rem; line-height: 1.25rem;">
          File: ${error.url} </br> ${error.statusText.toLowerCase()}
        </p>
      </div>  
    `;

    return errorHTML;
  }
};

async function getAllComponents(){
  const response = await fetch("./Components/Components.json");
  const allComponents = await response.json();
  return allComponents;
}

function createCustomTag(className, contentHTML){
  class customTag extends HTMLElement {
    constructor(){
      super();
    }

    formatSelector(key, nameSelectorPosition){
      let typeSelector = "";
      const selectorName = key.slice(0, nameSelectorPosition);
      if(selectorName === "id"){
        typeSelector = "#";
      } else if(selectorName === "class"){
        typeSelector = ".";
      }

      return typeSelector;
    }

    createSelector(key, nameSelectorPosition, typeAttributePosition){
      const typeSelector = this.formatSelector(key, nameSelectorPosition);
      const nameSelector = key.slice(nameSelectorPosition, typeAttributePosition).toLowerCase();
      const selector = typeSelector.concat(nameSelector);
      return selector;
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
        let typeAttributePosition = 0;
        let nameSelectorPosition = 0;
        
        for(const letter of key){
          if(letter === letter.toUpperCase()){
            if(nameSelectorPosition){
              typeAttributePosition = key.lastIndexOf(letter);
              continue;
            }
            
            nameSelectorPosition = key.indexOf(letter);
          }
        }
                
        const type = key.slice(typeAttributePosition).toLowerCase();
        const content = this.dataset[key];
        
        const selector = this.createSelector(key, nameSelectorPosition, typeAttributePosition);
        const element = document.querySelector(`${selector}`);
        
        this.setContentOfAttributes({ type, content, element });
      });
    }

    generateStyle(){
      const head = document.querySelector("head");
      const link = document.createElement("link");

      link.href = `./Components/${className}/style.css`;
      link.rel = "stylesheet";
      head.appendChild(link);
    }

    renderComponent(){ 
      if(!contentHTML) return;

      const domParser = new DOMParser();
      const convertContentToHTML = domParser.parseFromString(contentHTML, "text/html");
      this.replaceWith(convertContentToHTML.body.children[0]);
    }

    connectedCallback() {
      this.generateStyle();
      this.renderComponent();
      this.setOwnAttributes();
    }
  }
  
  const nameOfComponent = `${className.toLowerCase()}-component`;
  customElements.define(nameOfComponent, customTag);
}

function removeDeadTags(){
  customTagsFiltered.forEach( customTag => {
    bodyChildren.forEach( tagExisting => {
      if(tagExisting.tagName.includes("-") && tagExisting === customTag){
        body.removeChild(tagExisting);
      }
    });
  });
} 

function verifyIfComponentExists(Component){
  const component = Component.component.toUpperCase();
  return tagsFormatted.some(tag => component === tag);
}

getAllComponents()
.then( Components => {
  for(const Component of Components) {
    const componentsExists = verifyIfComponentExists(Component) && Component.component; 
    if(!componentsExists) continue;     

    for(const customTag of customTagsFiltered){
      if(customTag.tagName.split("-")[0] === componentsExists.toUpperCase()){
        const indexOfCustomTag = customTagsFiltered.findIndex(tag => tag === customTag);
        customTagsFiltered.splice(indexOfCustomTag, 1);
        continue;
      }
    }

    renderComponent(componentsExists);
  }
  removeDeadTags();
}); 

function renderComponent(component){
  fetch(`./Components/${component}/index.html`)
  .then(response => {
    if(response.status === 404){
      body.innerHTML = Errors.generateHTMLError(response);
    }

    return response.text()
  })
  .then(response => createCustomTag(component, response));
};