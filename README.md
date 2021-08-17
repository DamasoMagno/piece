# O projeto
<p align="justify">
 <strong>HTMLComponents</strong> é um projeto desenvolvido para atuar como um  framework simples na criação de componentes, para facilitar o desenvolvimento de projetos usando <strong>HTML, CSS e Javascript Vanilla.</strong>
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
      { "component": "ComponentName" }, 
      { "component": "ComponentName" }
    ]
  -> index.js
```

</br>

## Função de cada arquivo
* Components: Conterá todos os components
* Components.json: Irá deixar público quais components existem na pasta Components
* ComponentName: É a pasta do componente
* Index.js: Arquivo responsavel por converter os conteudos de um componente em uma tag

</br>

## Como usar no HTML
<p>
 Para o usuário conseguir manusear o framework corretamente em seu projetos, é nescessário seguir os seguintes padrões

 ```html
  <body>
    <componentName-component></componentName-component>

    <script src="./Components/index.js"></script>
  </body>
 ```
</p>

<br>

## Todo componente deve conter a seguinte estrutura
```html
  <componentName-component></componentName-component>
```

<br>

## Adicionar atributos dinamicamente
```html
<componentName-component>
 id-tagNameId-html
 class-tagNameClass-attributes
> </componentName-component>
```

<p>O usuário pode usar os seguintes atributos:</p>
<ul>
  <li> html: Permite que o usuário adicione html dinamicamente para o elemento através do componente
  </li>
  <li> attributes: Permite que o usuário adicionar atributos como classes ou ações de clicks pelo componente
  </li>
</ul>
  



