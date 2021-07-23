const Errors = {
  bodySyles: [
    { name: "height", value: "100vh" },
    { name: "display", value: "flex" },
    { name: "justifyContent", value: "center" },
    { name: "alignItems", value: "center" },
    { name: "padding", value: "0 1rem" }
  ],

  insertStylesBody(){
    this.bodySyles.forEach( style =>  {
      body.style[style.name] = style.value;
    });
  },

  generateHTMLError(error){
    this.insertStylesBody();
  
    const errorHTML = `
      <div style="background: #000;padding: 1rem; border-radius: 1rem; box-shadow: 5px 5px 10px rgba(0,0,0,.5);">
        <div style="background: #FFFF; color: #FF0000; width: 100%; height: 100%; padding: 1rem; border-radius: 1rem;">
         <p style="width: 100%; word-break: break-all; font-weight: bold; letter-spacing: .1em;">
         Error: ${error.status}
         <br>
         File: ${error.url} ${error.statusText.toLowerCase()}
         </p>
        </div>
      </div>  
    `;
  
    return errorHTML;
  }
};

export { Errors };