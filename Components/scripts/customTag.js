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
      const link = document.createElement("link");
      link.href = `../../Components/${className}/style.css`;
      link.rel = "stylesheet";
      
      const head = document.querySelector("head");
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
        return;
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
              typeAttributePosition = key.indexOf(letter);
              continue;
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
      if(!contentHTML){
        return;
      }

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

export { createCustomTag };