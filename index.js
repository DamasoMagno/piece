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
  const allComponents = await fetch("./Components/Components.json");
  return allComponents.json();
}

function createCustomTag(className, contentHTML){
  class customTag extends HTMLElement {
    constructor(){
      super();
    }

    formatSelector(attributeType, attributeName){
      switch(attributeType){
        case "id":
          return "#".concat(attributeName);
        case "class": 
          return ".".concat(attributeName);
        default:
          return attributeType;
      }
    }

    createSelector(key, nameSelectorPosition, typeAttributePosition){
      const typeSelector = this.formatSelector(key, nameSelectorPosition);
      const nameSelector = key.slice(nameSelectorPosition, typeAttributePosition).toLowerCase();
      const selector = typeSelector.concat(nameSelector);
      return selector;
    }

    setContentOfAttributes(data){
      const { typeAttribute, element, content } = data;
      
      if(typeAttribute === "html" && element){        
        element.innerHTML = content;
      }

      if(typeAttribute === "attributes" && element){
        content.split(",")
          .forEach( attribute => {
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
      [...this.attributes].forEach( attribute => {
        let { nodeName, nodeValue } = attribute;
        let [ typeSelector, selectorName ] = nodeName.split("-");
        const selector = this.formatSelector(typeSelector, selectorName);

        const typeAttribute = nodeName.slice(nodeName.lastIndexOf("-") + 1 );
        const content = nodeValue;
        const element = document.querySelector(`${selector}`);

        this.setContentOfAttributes({typeAttribute, element, content})
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
  bodyChildren.forEach( tagExisting => {
    customTagsFiltered.forEach( customTag => {
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

const renderComponents = async () => {
  try {
    for(const Component of await getAllComponents()){
      const componentsExists = verifyIfComponentExists(Component) && Component.component;    
      if(!componentsExists) continue;

      for(const customTag of customTagsFiltered){
        if(customTag.tagName.split("-")[0] === componentsExists.toUpperCase()){
          const indexOfCustomTag = customTagsFiltered.findIndex(tag => tag === customTag);
          customTagsFiltered.splice(indexOfCustomTag, 1);
        }
      }

      generateComponent(componentsExists);
    }

    removeDeadTags();
  } catch(e){
    console.log("Error", e.message);
  }
};

function generateComponent(component){
  fetch(`./Components/${component}/index.html`)
  .then(response => {
    if(response.status === 404){
      body.innerHTML = Errors.generateHTMLError(response);
      return;
    }

    return response.text()
  })
  .then(response => createCustomTag(component, response));
};

renderComponents();