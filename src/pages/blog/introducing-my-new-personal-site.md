---
layout: ../../layouts/ArticleLayout.astro
title: 'Mi primera publicación en el blog'
pubDate: 2024-08-25
author: 'Alumno de Astro'
image:
    url: 'https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=1080'
    alt: 'El logotipo completo de.'
tags: ["astro", "bloguear", "aprender en público"]
---

¡Bienvenido a mi _nuevo blog_ !


### Formato de texto

*Italic characters* 

_Italic characters_

**bold characters**

__bold characters__

~~strikethrough text~~

### Citas

Introducing my quote:

> Neque porro quisquam est qui 
> dolorem ipsum quia dolor sit amet, 
> consectetur, adipisci velit...

### Links

This is [an example](http://www.example.com/) inline link.

Links are also auto-detected in text: http://example.com/

### Divisores

***

### Imagenes

![The San Juan Mountains are beautiful!](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=1080 "San Juan Mountains")

```md
![The San Juan Mountains are beautiful!](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=1080 "San Juan Mountains")
````


### Tablas

| Mes | Ciudad | Gasto|
| --------| ------- | ------- |
| Enero | Florencia | 250€ |
| Febrero | Budapest | 80€ |
| Marzo | Annecy | 420€ |


### Listas ordenadas 

1. **Instalación de Astro**: En primer lugar, he creado un nuevo proyecto Astro y configurar mis cuentas en línea.

2. **Creación de páginas**: Luego aprendí cómo hacer páginas creando nuevos archivos `.astro` y colocándolos en la carpeta `src/pages/`.

3. **Creación de publicaciones**: ¡Esta es mi primera publicación! ¡Ahora tengo páginas de Astro y publicaciónes en Markdown!

### Listas desordenadas

*  Item 1
*  Item 2
*  Item 3
    *  Item 3a
    *  Item 3b
    *  Item 3c

### Bloque de código

He instalado un bloque de código para poder añadir al blog lo que quiera enseñar y que se vea super guay y super pro!

```js
import { defineConfig } from 'astro/config'
import astroExpressiveCode from 'astro-expressive-code'
// Import the plugin's initialization function
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

export default defineConfig({
  integrations: [
    astroExpressiveCode({
      plugins: [
        // Call the plugin initialization function inside the `plugins` array
        pluginCollapsibleSections(),
      ],
    }),
  ],
})

```

CSS art never captivated me from a creator’s perspective. Despite seeing amazing examples, the idea of investing time in what seemed like an aimless endeavor puzzled me. To me, design was a tool for communication and problem-solving, not an end in itself.

Yet, during an intense period — wrapping up my final months at Help Scout shipping neat features, diving into an ambitious AI side project, quietly launching another, and on the cusp of leading design at GiveDirectly — I found myself completely fatigued. It wasn’t just physical exhaustion; I was creatively spent. The past year of purpose-driven work had made me drained.

Code as a refuge
Over the years, coding had become a refuge of sorts. It engaged my brain in ways designing didn’t. So much of its binary in aspect. It either works or it doesn’t. The grey area often found when designing is less apparent with code, and so it had evolved into an enjoyable pastime.

I craved a project that would let me wear my coding hat whilst creating something visually appealing, without the usual heavy scrutiny.

During this time, Teenage Engineering launched the ep-133. Designers tend to fawn over all their gadgets, with fairly good reason. In my opinion, their devices showcase the creativity and playfulness often missing in designers’ lives.

For the first time, I was interested in recreating something with CSS for the sake of it. It was time to disengage my design brain and play!