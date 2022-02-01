# O projeto
<p align="justify">
 Piece.js foi desenvolvido com a missão de ajudar desenvolvedores que ainda atuam usando JavaScript Vanilla, por meio da componentização, sistema usado hoje pelos mais famosos frameworks JavaScript. Através dessa ferramenta, é possível criar um arquivo html com função especifica e integra-la as mais diversas páginas, evetiando a repetição de código html.
</p>

</br>

## Estrutura de um projeto usando Piece.js
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

## Todo componente deve conter a seguinte estrutura
```html
  <componentName-component></componentName-component>
```

<br>

## Como usar no HTML
<p>
 Para o usuário conseguir manusear o framework corretamente, é nescessário seguir os seguintes padrões

 ```html
  <body>
    <componentName-component></componentName-component>

    <script src="./Components/index.js" />
  </body>
 ```
</p>

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
  



