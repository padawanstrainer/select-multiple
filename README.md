# SEARCH MULTIPLE

Componente HTML de tipo Select que permite la selección de múltiples opciones, con un campo de búsqueda (input de tipo text) para filtrar los valores del select.

ToC:  
* [Instalación](#install)
* [Implementación](#usage)
* [Agregar el buscador de opciones](#search)
* [Agregar una opción vacía](#empty)
* [Mostrar el texto del option y su value](#value)
* [Aplicar estilos a los elementos](#style)
* [Limitaciones y pendientes](#next)

## <a name="install" id="install"></a> Instalación
### 🔹 Para un proyecto node / vite (o similar)
Para instalar el componente como módulo de node (en un proyecto que ejecute servidor de node), ejecutar en la consola del proyecto el comando:  
```sh
npm install @padawanstrainer/select-multiple
```

Y hacer el import del componente en el archivo main.js de tu aplicación (o el nombre que tenga tu archivo principal), haciendo un:
```js
import '@padawanstrainer/select-multiple'
```

### 🔹 Como un módulo de ES, sin usar npm install
Si no se quiere instalar por medio de npm, clonar o descargar el proyecto desde el repositorio [https://github.com/padawanstrainer/select-multiple](https://github.com/padawanstrainer/select-multiple).  

Copiar el archivo `main.js` en el directorio de su preferencia e importarlo con un script de tipo `module`.  
Imaginando que has copiado el archivo `main.js` a tu directorio `assets/js/select_multiple/main.js`, debería incluirse el siguiente archivo:

```html
<script type="module" src="/assets/js/select_multiple/main.js"></script>
```

### 🔹 Directamente desde CDN
Si no se quiere descargar el proyecto desde el repositorio de GitHub y tampoco se planea utilizar el proyecto como un módulo de node, se puede insertar directamente el script desde el CDN ubicado en [https://unpkg.com/@padawanstrainer/select-multiple](https://unpkg.com/@padawanstrainer/select-multiple).  
También debe ser un script de tipo módulo.

```html
<script type="module" src="https://unpkg.com/@padawanstrainer/select-multiple"></script>
```

Esto ejecutará la versión más actual del script.  
Si se necesita una versión en especial, indicarlo luego del nombre del paquete con un arroba y la versión a usar:  

```html
<script type="module" src="https://unpkg.com/@padawanstrainer/select-multiple@1.0.0"></script>
```

Por cualquiera de las tres vías, el componente será registrado en el DOM para poder usarse como etiqueta en el HTML.  
Veamos cómo lo podemos personalizar.

## <a name="usage" id="usage"></a> Implementación
Insertar en el HTML, la etiqueta:  
```html
<select-multiple></select-multiple>
```
El atributo `name` indica el nombre que tendrá el control al ser enviado con el formulario (si no se indica este atributo, se ignorará el envío del control al endpoint que procese la información).  
El atributo `label` indica el texto que aparecerá en el select mientras no se haya elegido alguna de sus opciones.

Adentro de la misma insertar etiquetas `<option></option>` con su respectivo `value` y texto interno.  
Tal como sucede con la etiqueta nativa `select`, si no se especifica el atributo `value`, se tomará el texto interno de la etiqueta.  
La opción (u opciones) que deba estar marcada por defecto, deberá tener el atributo `selected`.

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

Esto renderizará este componente:  

![Componente simple](https://iili.io/2cRQGHP.jpg)

Como vía alternativa, se puede indicar en la etiqueta `select-multiple`, el atributo `value` que se usará para marcar la opción seleccionada.  

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad" value="ch">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

Que usará ese valor para marcar la opción pre-seleccionada:  

![Componente simple con value](https://iili.io/2cYnrfj.jpg)  

Si se quiere crear un control de selección múltiple, respetando el aspecto de _dropdown_, solo se necesita agregar el atributo `multiple`.  
Esto permitirá tildar más de una opción y se agregará al final del texto del label un contador con la cantidad de opciones elegidas.

![Select multiple](https://iili.io/2lsyUDN.jpg)

En el caso del `select` que tenga el atributo `multiple`, se pueden definir tantas opciones como sean necesarias con el atributo `selected`, o indicar en el atributo `value` todos los valores separados por coma.  

```html
<select-multiple name="pais" multiple label="Elija sus destinos" value="ch,uy">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

En este caso, las dos opciones (delimitadas por la coma), serán seleccionadas por defecto:

![Select multiple - varios values](https://iili.io/2lsb5oF.jpg)


Esto no inclue el campo de búsqueda, para habilitarlo hace falta indicar otras propiedades de tipo `data-attributes`.  

Y dado que este control será un elemento de formulario, se lo puede deshabilitar mediante el atributo `disabled`:  

```html
<select-multiple name="pais" multiple label="Elija sus destinos" disabled>
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```
Este atributo no solo impedirá la interacción con el componente, sino que omitirá su envío al action del formulario.  

![Componente deshabilitado](https://iili.io/20pOXft.png)

Cabe destacar que este atributo se puede manipular desde Javascript como los demás controles de formulario.  
En este supuesto, para Javascript `disabled` es una propiedad booleana, aceptando los valores _true_ para deshabilitar el componente, _false_ para habilitarlo.

```js
const sm = document.querySelector('select-multiple');
sm.disabled = true; //control deshabilitado

/* resto de la lógica */

sm.disabled = false; //control shabilitado

/* Toggle de estado */
document.querySelector('my-button')
        .addEventListener('click', e => {
            sm.disabled = ! sm.disabled;
        } );
```

## <a name="search" id="search"></a> Habilitar el buscador
Ya sea un select simple o múltiple, agregar el atributo `data-search` para habilitar el filtro de opciones.  
Si además se le pasa un valor, aparece por delante del input para filtrar las opciones.

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad" data-search="Filtrar país">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

Generando el siguiente output:  

![Componente con buscador](https://iili.io/2c5n6fR.jpg)  

El buscador no diferencia mayúsculas de minúsculas y compara contra el `value` de cada option, así como su texto interno.  

![Componente con buscador por value](https://iili.io/2c5NHt1.jpg)

Si una búsqueda no coincide con ninguna entrada no se mostrará ninguna opción.

## <a name="empty" id="empty"></a> Agregar una opción "vacía"

Para agregar una opción que represente a "_niguna seleccionada_", indicar un valor para el atributo `data-null` que agregará una nueva opción con el valor del atributo como texto visible del option.  

Si además se indica el atibuto `data-null-value`, éste será el valor usado al envíar el formulario (caso contrario se mandará el texto indicado en el atributo `data-null`).  
Acepta el envío de una cadena de texto vacía, que llegará como `''`.  

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad" data-search="Filtrar país" data-null="Ninguna opción" data-null-value="">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

Esto generará la siguiente opción extra:  

![Select simple - Ninguna opción](https://iili.io/2cY7Mpj.jpg)

**IMPORTANTE**  
En el select con atributo `multiple` se ignora, aunque se lo indique explícitamente, el atributo `data-null`, ya que al poderse deseleccionar todas las opciones, no tendría sentido agregar una opción que confunda al usuario final (porque habria que elegir esta nueva opción para no estar eligiendo nada).  
No obstante el atributo `data-value-null` es el valor que se enviará si no se seleccionó nada, de no estar definido se manda una cadena de texto vacía.

## <a name="value" id="value"></a> Mostrar text y value

Si se agrega el atributo `data-value` (que no es lo mismo que el atributo `value` que define las opciones seleccionadas), se antepone al texto de cada opción (salvo al de ninguna opción seleccionada) un label con el value de dicha opción.  

Este atributo puede ser útil en los casos que el value también pueda representar algo para el usuario final de la página, a fin de poder ver ambos valores.  
No requiere valor, con solo indicar el atributo, se habilita la funcionalidad.  

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad" data-search="Filtrar país" data-value>
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

El cual generará este control de formulario:  

![Select simple con text y value](https://iili.io/2ca5jae.jpg)  

Claro que podríamos tener una opción con un value demasiado largo que nos rompa visualmente el resto del componente, como por ejemplo:

```html
<option value="supercalifragilisticoespialidoso">Super value</option>
``` 

En este caso, el value de las opciones tomará el valor más largo generando esta atrocidad visual:  

![Select simple - value muy largo](https://iili.io/2caMLg4.jpg)


En consecuencia, de ser necesario, se puede definir el ancho máximo para ese label, y todo lo que exceda ese ancho será truncado con puntos suspensivos (_ellipsis_).  
Esto se hace por medio del atributo `data-value-width` que espera recibir un valor numérico que será traducido a la unidad ch (en una fuente monoespaciada, serían la cantidad de caracteres/chars) en la muestra final, en una fuente NO monoespaciada, puede no representar el mismo ancho.

Ejemplo:
```html
<select-multiple name="pais" label="Elija su nacionalidad" data-search="Filtrar país" data-value data-value-width="5">
    <option value="ar">Argentina</option>
    <option value="bo">Bolivia</option>
    <option value="br">Brasil</option>
    <option value="ch">Chile</option>
    <option value="py">Paraguay</option>
    <option value="uy">Uruguay</option>
</select-multiple>
```

El cual generará este control de formulario:  

![Select simple con value visible truncado](https://iili.io/2cc9RcX.jpg)  

Este atributo se ignorará en dos casos:  
1. Si el atributo no tiene valor.   
1. Si el valor del `data-value-width` es mayor que el ancho del texto más largo (aplicando el ancho del texto más largo).

## <a name="style" id="style"></a> Estilar el componente

Dado que el componente está encapsulado, no se puede acceder a la estructura de etiquetas internas para estilizarlas (esto también garantiza que no se rompa el componente por algún conflicto con una hoja de estilos externa). Por lo cual, las propiedades que se pueden modificar ya están predefinidas como variables CSS (o mejor dicho, _Custom properties_).  

Como sucede con cualquier etiqueta HTML, se puede aplicar estilos creando una regla para la etiqueta `select-multiple`, o asignarles un `class` o `id`.  
En este documento, se ejemplificará accediéndola por nombre de etiqueta.

El `select-multiple` está formado por 3 elementos:

![Areas del select-multiple](https://iili.io/20vTXUl.png)

Este es un listado de las opciones formateables:

### 🔹 _El dropdown_

La familia y el tamaño tipográfico del combo y sus opciones, es heredada del último elemento padre que tenga una fuente definida.  

Pero se puede indicar una fuente puntual para el _combo-header_ con la propiedad `--sm-font`, que espera un valor válido para la familia tipográfica (uno o varios nombres separados por coma).  

El border que rodea tanto al _combo-header_ como al _combo-body_ se indica con la propiedad `--sm-border` que acepta cualquier notación de color válida.  

El color de fondo del _combo-header_ se indica  con la propiedad `--sm-bg-color`, que acepta cualquier notación de color. Este valor no se propagará al _combo-body_ ni a los _combo-options_.  
Mientras que el ícono del _drop-down_ (la fecha para abajo) también se puede customizar, por medio de la propiedad `--sm-bg-icon`, que espera una `url( )` con la ruta a la imagen a usar como ícono.  
Por defecto las imágenes a usar como ícono del dropdown, tiene un alto de `.5lh` (la mitad del valor indicado como line-height), se puede modificar con la propiedad `--sm-bg-size` que acepta cualquier unidad que se pueda usar como _background-size_ (en px, lh, ch, em, etc).

Y en los casos que la cantidad de opciones supere el alto máximo del _combo-body_ se mostrará una barra de scroll, cuyos colores también se pueden definir con las propiedades `--sm-scrollbar-front` que aplica al elemento de frente que se desplaza con el scroll y `--sm-scrollbar-back` que es color de fondo de todo el alto del scrollbar (el elemento que no se mueve junto al scroll). Acepta cualquier notación de color válida.

Este es un ejemplo de las propiedades explicadas:

```css
select-multiple{
    /* Aplica solo para el combo-header */
    --sm-font: 'Poppins', sans-serif; 
    
    /* Combo-header y options */
    font-family: 'Vivaldi', cursive; 

    --sm-border: #1B4D78;
    --sm-bg-color: #286090;
    --sm-bg-icon: url('arrow.png');
    --sm-bg-size: 1.2em;
    --sm-color: white;

    --sm-scrollbar-front: #FFFFC9;
    --sm-scrollbar-back: #1A3146;
}
```

Que se mostraría así:

![Select multiple - estilos generales.png](https://iili.io/20vbdfj.png)

### 🔹 _Las opciones_
Al igual que sucede con el _combo-header_, las opciones aceptan definir su familia tipográfica, independiente del valor del combo.  
Esto se hace con la propiedad `--sm-options-font`, que acepta el listado de familias tipográficas a aplicar.  
De no estar definida, heredará la tipografía del último elemento que tenga un valor explícito o usará la fuente por defecto del navegador.  
El tamaño de la fuente se indica con la propiedad `--sm-options-size`.  

Y al igual que sucede con el _combo-header_ se puede indicar el color de fondo y color de texto con las propiedades `--sm-options-bg` y `--sm-options-color`, respectivamente.

Por cada opción se muestra un `border-bottom`, cuyo color se puede definir con la propiedad `--sm-options-border`.  

Y los _combo-options_ aceptan el estado `:hover`, en este caso se puede cambiar el color de fondo y de texto de la opción con los atributos `--sm-options-hover-color` y `--sm-options-hover-bg`, respectivamente.

Si agregamos estos estilos al combo:

```css
select-multiple{
    --sm-options-font: 'Impact', sans-serif;
    --sm-options-size: 25px;
    --sm-options-bg: #F0F0BC;
    --sm-options-color: #7C0305;
    --sm-options-border: transparent;

    --sm-options-hover-bg: #480A2C;
    --sm-options-hover-color: #7CE0A2;
}
```
 
Se vería de esta manera:  

![Select multiple - estilos de las opciones](https://iili.io/208ZxGj.png)`


### 🔹 _Los íconos de la opciones_
Al seleccionar una opción del menú desplegable, se muestra el ícono de un tilde de check `✓` .  
Esta imagen se puede cambiar con la propiedad `--sm-options-checked` que espera una `url( )` que apunte a la imagen a usar como estado :checked.

Adicionalmente, se puede indicar un ícono para las opciones que no fueron seleccionadas, por medio de la propiedad `--sm-options-unchecked` que también espera una `url( )`.  
Y, dado que al pasar el mouse por encima de una opción no seleccioanda, su ícono podría no hacer suficiente contraste con el color de fondo, se puede cambiar la imagen en el estado :hover con el atributo `--sm-options-unchecked-hover`


Entonces, si a los _combo-options_ le damos estos estilos:

```css
select-multiple{
    --sm-options-size: 20px;
    --sm-options-bg-color: lightyellow;
    --sm-options-checked: url(check_si.svg);
    --sm-options-unchecked: url(check_no.svg);
    --sm-options-unchecked-hover: url(check_no_negro.svg);
}
```

Veremos este menú desplegable:

![Select multiple - Opciones tildadas](https://iili.io/20UXJdQ.png)

### 🔹 _El valor visible en la opción_
Si habilitamos la muestra de los _values_ por delante del texto de la opción, podemos indicar el color del texto con la propiedad `--sm-options-value-color`.  

Y el color del texto, cuando se pase el mouse por encima de una opción, se define con la propiedad `--sm-options-value-hover-color`.

Estos estilos: 

```css
select-multiple{
    --sm-options-value-color: red;
    --sm-options-value-hover-color: yellow;
}
```

Genera este menú desplegable.

![Select multiple - Estilos de valores](https://iili.io/20Sjh6G.png)

### 🔹 _El filtro/buscador de opciones_

Si se habilita el filtro de búsqueda de opciones, se pueden customizar los estilos principales del buscador.  
Esto involucra al color de fondo de la barra de búsqueda con la propiedad `--sm-search-bg`, el color del texto con la propiedad `--sm-search-color` y si se ha definido un valor para el texto del `data-search` y se quiere usar un color distinto, se lo puede indicar con el atributo `--sm-search-label-color`.  

Tal como se puede ver en el ejemplo a continuación:

```css
select-multiple{
    --sm-search-bg: #460848;
    --sm-search-color: #00FF12;
    --sm-search-label-color: #F5EA9B;
}
```

Que afectará al _select-multiple_ de esta manera:

![Select multiple - estilos buscador](https://iili.io/20SDqPa.png)

### 🔹 _CSS específico para las opciones seleccionadas_

Finalmente, al tener una opción seleccionada, no solo se puede modificar el ícono que se muestra, sino que podemos cambiar todas las propiedades ya declaradas para las opciones.  

El color de fondo y de texto de una opción seleccionada, se definen con las propiedades `--sm-options-checked-bg` y `--sm-options-checked-color`, respectivamente.  

Y si se tiene habilitada la muestra de los _values_, el color para la el estado :checked se define con la propiedad `--sm-options-checked-value-color`.

Por ejemplo con estos valores: 
```css
select-multiple{
    --sm-options-checked-bg: #FFCE6C;
    --sm-options-checked-color: #2150D1;
    --sm-options-checked-value-color: #FFFFFF;
}
```

Tendríamos esta salida visual:

![Select multiple - estilos de las opciones tildadas](https://iili.io/20UBpXs.png)


Y lógicamente, todos los valores pueden modificarse al pasar el mouse por encima.

El color de fondo y de texto se definen por medio de los atributos `--sm-options-checked-hover-bg` y `--sm-options-checked-hover-color`, respectivamente.  
El color del _value_ visible se define con la propiedad `--sm-options-checked-value-hover-color`.  
Y dado que el ícono puede no hacer suficiente contraste con el nuevo esquema de colores, si se necesita cambiar el archivo se puede hacer con el atributo `--sm-options-checked-hover-icon` que espera una `url( )` hacia la imagen a usar y, de no indicarse, seguirá usando el ícono de la opción seleccionada por defecto.  

Con lo cual, podrías sobreescribir todos los valores de las opciones seleccioandas en el estado `:hover`, aplicando estos estilos.

```css
select-multiple{
    --sm-options-checked-hover-bg: #D39008;
    --sm-options-checked-hover-color: black;
    --sm-options-checked-hover-value-color: black;
    --sm-options-checked-hover-icon: url(check_si_blanco.svg);
}
```

Y nuestro combo se vería de esta manera:

![Select simple - Estilos del hover en las opciones seleccioandas](https://iili.io/20U7Tej.png)

##  <a name="next" id="next"></a> Limitaciones y pendientes
En el caso de ser una etiqueta de selección múltiple, el componente enviará como valor todos los value de las opciones seleccionadas en un único string delimitado por comas.  
En consecuencia, en el lenguaje que se deba procesar la información, si se requiere cada valor por separado, se deberá usar el método correspondiente para separar el string por comas (sea `split`, `strsplit`, `explode`, etc).  

La versión actual no permite la agupación visual de opciones como sucede con la etiqueta `<optgroup></optgroup>` de HTML. Sin embargo está en mi intención el ofrecer una solución para poder jerarquizar mejor la información del menú desplegable.  

Este componente se ofrece sin fines de lucro, con la intención de facilitarle el trabajo a quienes ya tuvieros esta misma pelea y no encontraron aún una solución para poder elegir múltiples opciones desde un _dropdown_ sin tener que expandir por defecto las opciones.  
Esto significa que pude haber cometido algún error de programación que no esté viendo o no me haya saltado en mis casos de usos habituales, o que la semana que viene la W3C o WHATWG saquen su propia implementación nativa del select-multiple, haciendo este script obsoleto.  
Pero si hasta entonces, este _CustomElement_ te sirvió de algo, mi misión está cumplida.  

Te deseo lo mejor en tus proyectos y nunca dejes de aprender y desafiarte.  

♞

![Memecito](https://iili.io/2lQS8Je.jpg)