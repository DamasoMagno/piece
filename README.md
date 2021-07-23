# O projeto
<p align="justify">
 <strong>HTMLComponents</strong> é um projeto desenvolvido para atuar como um  framework simples na criação de componentes como é feito em React(outro framework Javascript), para facilitar o desenvolvimento de projetos usando <strong>HTML, CSS e Javascript Vanilla.</strong>
</p>

</br>

## Estrutura de um projeto usando HTMLComponents
```javascript
Components
-> ComponentName
   -> index.html
   -> style.css
-> Components.json
    [ 
      { "name": "ComponentName" }, 
      { "name": "ComponentName" } 
    ]
-> index.js

index.html
script.js
style.css
```

</br>

## Função de cada arquivo
* Components: Conterá todos os components
* Components.json: Irá deixar publico quais components existem na pasta Components
* ComponentName: É a pasta do componente
* Index.js: Arquivo responsavel por converter os conteudos de um componente em uma tag

</br>

## Como usar no HTML
<p>
 Caso o usuario queira usar algum componente, ele nescessitará realizar os seguintes passos
</p>


