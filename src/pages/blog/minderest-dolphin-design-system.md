---
layout: ../../layouts/ArticleLayout.astro
title: 'Así se hizo · Dolphin Design System - '
pubDate: 2025-08-13
author: 'Alumno de Astro'
image:
    url: '/images/penguin-1.jpeg'
    alt: 'Minderest Insite Illustration'
tags: ["astro", "bloguear", "aprender en público"]
---

En [este artículo](/blog/minderest-website) os he contado como logramos construir la web corporativa de Minderest en tiempo récord usando un sistema de diseño en código. Cómo se vivió desde dentro y cómo el equipo tuvo que adaptarse a un flujo de trabajo **radicalmente** diferente.

## El Problema

Me he dejado por contar un problema que nos encontramos durante [el desarrollo de la web corporativa](/blog/minderest-website) que me va a servir para mostrar un poco mejor este sistema de diseño. 

Vamos a volver a hacer un juego de imaginación. Necesito que te imagines que después de llevar casi 1 mes de desarrollo y a falta de 1 semana para la entrega, te das cuenta de que hay una página en concreto que se sale por completo de todo lo establecido dentro del Penguin. No valía ninguna pieza.

Recordemos que esto del sistema de diseño venía a ser como si fuera una fábrica de coches. Teníamos ya hechas todas las variedades de puertas, motores, ventanillas y otros componentes mecánicos necesarios para que el resto del equipo pudiera entrar a juntarlo todos acabando con la página final perfectamente hecha. Con cada detalle cuidado. El coche montado. Perfecto. Una cadena de producción. Pues esta página rompía todos los esquemas.

En el Penguin todo lo que había en ese momento eran colores azules. Botones azules, secciones azules. [Esta página](https://www.minderest.com/dynamic-pricing-tool-ecommerce) es rosa. **MUY** rosa.

Y es que Minderest, además de su propia app y extensión de navegadores, tiene también una app completamente "standalone" llamada [Reactev](https://www.reactev.com). Usan todos los datos recopilados en Minderest para realizar forecasts, predicciones y recomendaciones de stock usando IA. He de decir que el equipo encargado de esta app son unos cracks. Les mando un saludo y un abrazo a Rubén, Jose, Joaquín y a mi tocayo Fernando.

Por supuesto, la flamante nueva web corporativa de Minderest, debía tener una entrada destinada a hablar de Reactev. Por supuesto, esta página en exclusiva iba a tener unos colores totalmente diferentes. Es de cajón.

Imagináos el marrón. Quedaba una semana para la entrega y te dicen que todos los componentes que habías fabricado en el sistema de diseño había que adaptarlos. No quedaba tiempo para adaptar todo. La solución tenía que ser integral y rápida.



--- 

## La solución


Volvemos al concepto de Atomic Design. Vamos a dividir el problema en partes pequeñitas: Un botón es un átomo. Un Input de texto al lado de un Botón son 2 átomos y juntos hacen una molécula. Podemos llamar a esto molécula, y si le pones fondo, algo de padding también podemos llamarla "sección de suscripción a Newsletter". 

Para apañar lo de Reactev y no verme en la situación de tener que **DUPLICAR** todo el sistema de diseño, todos los componentes y todas las secciones, necesitaba algo que estuviera un nivel anterior al átomo. Alguien ya se había topado con este problema.

La respuesta eran los design tokens.

### Design Tokens - ¿Qué leches son?

> In the world of UI, design tokens are subatomic particles. The design token `color-brand-blue` is a critical ingredient of a UI, but it’s not exactly functional on its own. It needs to be applied to an “atom” (such as the background color of a button) in order to come to life.

Fuente: https://bradfrost.com/blog/post/extending-atomic-design/

Toda esta teoría está genial pero teníamos que incorporar el concepto en el proyecto y cuanto antes. Estábamos usando Tailwindcss y si leemos su documentación, hablaban en varios puntos de usar variables de css. Tocaba jugar un poco con la idea a ver que podíamos hacer.

### Añadir un color que use una variable de CSS

Para esto tendremos que ir al fichero de configuración de Tailwindcss. Si estamos en la última versión de Tailwind, no será necesario hacerlo (su configuración está basada en css y no en un fichero js).

<img src="/images/tailwind-colors-design-token.png"/>

Como véis, hemos definido una serie de colores nuevos cuyo valor de color es una variable de css.

Ahora podemos reemplazar a nuestro gusto el valor de esa variable. 

### Definir el valor de la variable

```css
.brand-a {
    --color-brand-background-default: #7058ff;
    --color-brand-border-default: #7058ff;
    --color-brand-text-default: #7058ff;
    --color-brand-background-hover: #bba4ff;
    --color-brand-border-hover: #bba4ff;
    --color-brand-text-hover: #bba4ff;
    --color-brand-border-focus: #bba4ff;
}

.brand-b {
    --color-brand-background-default: #ff368b;
    --color-brand-border-default: #ff368b;
    --color-brand-text-default: #ff368b;
    --color-brand-background-hover: #ff8caf;
    --color-brand-border-hover: #ff8caf;
    --color-brand-text-hover: #ff8caf;
    --color-brand-border-focus: #a80055;
}
```
Aquí la cosa se empieza a poner interesante.

Si aplicamos la clase `brand-a` a cualquier elemento, lo que haremos será decirle a ese elemento que use esas variables.



### Usar la variable

Siguiendo esta norma. Ahora podemos ir a nuestro botón, sección, loquesea de nuestro sistema de diseño y decirle: Ahora tu en vez de usar el `bg-indigo-600`, vas a usar el `bg-color-brand-background-default`. Así, en cuanto ese elemento o cualquier elemento a más alto nivel en el DOM tenga la clase `brand-a`, hará uso del valor de la variable y `bg-color-brand-background-default` podrá tener varios valores. Infinitos.

La declaración de un botón incluyendo este token para personalizar el fondo se quedaría algo así:

```css
.brand-button {
  @apply bg-color-brand-background-default text-white rounded-8 px-16 py-12 inline-flex justify-center items-center gap-8;
}
```

Tenemos la estructura preparada para tener átomos polivalentes. El concepto puro de Design Token es este, modificar los átomos. Sin darnos cuenta, hemos abrierto la puerta a crear Sistemas de Diseño Multimarca. 

Era justo lo que necesitábamos.

---

### Resultado final

En la siguiente imagen os muestro el mismo átomo, un botón primario y otro átomo, un botón secundario.

La diferencia es que uno usa el color estándar. Los de abajo usan los colores de la marca "b".

<img src="/images/brand-b-button.png" />


Os dejo una demo interactiva con el concepto aplicado y con el código.

https://play.tailwindcss.com/eWQvBKp8iE


## Penguin Design System

En este proyecto, dejé hechas cada una de las piezas que íbamos a necesitar. Viendo lo sencillo que ha sido crear Design Tokens, aplicarlo a los componentes que tenía ya hechos fue coser y cantar. En unas pocas horas había añadido un nuevo tema a todos los átomos de todo el sistema de diseño.

Por cortesía de Minderest, he podido sacar alguna captura de pantalla mostrando un selector bien chulo que dejé puesto y que automáticamente cambiaba el tema de lo que fuera que estuviéramos viendo.

Este sería el formulario de contacto para demo que hay pero con el color de marca de Minderest.

<img src="/images/penguin-form-blue.jpeg"/>

Y al seleccionar Reactev, todo cambiaba.

<img src="/images/penguin-form-pink.jpeg" />

La gracia de todo esto es que lo que se representaba en el Penguin no era una image ni una simulación de como iban a quedar todo finalmente en la web corporativa. Era el mismo código y por tanto el propio componente mostrándose en vivo y moviendose como se movería en el proyecto final.

Además, que justo debajo de cada "preview" de la variante del componente, dejé unas cajitas preparadas para que el resto de compañeros pudieran copiar y pegar. 

En secciones algo más complicada como esta era esencial. El formulario debía de quedar posicionado de forma sticky en la pantalla, el texto debía de verse bien. Con pegar ese código solo tenías que reemplazar el texto para hacerlo funcionar todo.

<img src="/images/penguin-form-code.jpeg" />

---



**Aviso legal**

_Todos los nombres comerciales, marcas registradas, logotipos, imágenes y referencias a productos o servicios mencionados en esta publicación pertenecen a sus respectivos propietarios. Minderest es una marca registrada propiedad de Minderest S.L., y yo no poseo derechos sobre ella. El contenido de este artículo refleja mi experiencia personal y profesional en el desarrollo de proyectos durante mi etapa en la empresa, y se comparte únicamente con fines informativos y divulgativos. El código mostrado aquí no guarda ninguna relación con Minderest S.L y que fue creado para la ocasión con fines didácticos._