const bodyChildren = document.querySelector("body").children;
const tags = [...bodyChildren];
const CustomTagsFiltered = tags.filter(item =>item.tagName.includes("-"))
.map(item => item.tagName.split("-"));
const tagsFormatted = CustomTagsFiltered.map( item => formattTags(item))

function formattTags(item){
  const firstPartOfTag = item[0];
  const secondPartOfTag = item[1];
  return (
    firstPartOfTag[0] + firstPartOfTag.slice(1, firstPartOfTag.length).toLowerCase() + 
    secondPartOfTag[0] + secondPartOfTag.slice(1, secondPartOfTag.length).toLowerCase()
  );
}

async function getHtmlOfHeaderComponent(){
  const response = await fetch("./HTMLComponents/Components.json");
  const HTMLComponents = await response.json();
  return HTMLComponents;
}

getHtmlOfHeaderComponent()
.then( response => {
  for(let Component of response){
  console.log(tagsFormatted, Component);
    if(tagsFormatted == Component.name){
      fetch(`./HTMLComponents/${Component.name}/index.html`)
      .then(response => response.text())
      .then(response => {

        class HeaderComponent extends HTMLElement{
          constructor(){
            super();
          }

          connectedCallback() {
            this.innerHTML = response;
          }
        }

        customElements.define("header-component", HeaderComponent)
      },
    )}
  }
});