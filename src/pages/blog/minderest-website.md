---
layout: ../../layouts/ArticleLayout.astro
title: 'La web corporativa de Minderest.com'
pubDate: 2025-08-11
author: 'Alumno de Astro'
image:
    url: '/images/minderest-public-web.png'
    alt: 'Minderest Insite Illustration'
tags: ["astro", "bloguear", "aprender en público"]
---

Durante mis más de 8 años en Minderest, uno de los proyectos que más satisfacción me ha dado ha sido el de liderar el desarrollo del sistema de diseño que permitió construir la web corporativa de Minderest en tiempo récord. 

En la planificación y preparación de este proyecto estuvieron involucradas una cantidad de personas tan grande que no podría nombrarlas a todas. Esta fase de preproducción abarcó bastante tiempo, cerca de un año y medio de planificación. Era una web **gigante**. Cada párrafo estudiado. Marketing, Diseño, y Negocio habían redactado miles de líneas de texto e ilustraciones. Cada funcionalidad de Minderest plasmada. Era mastodóntica. La ejecución del proyecto era algo que ponía nervioso a mucha gente. Era normal. Al equipo y a mi nos enorgullece decir que tuvimos todo en producción a tiempo. En este post voy a contar cómo lo hicimos.

Sabíamos que al ser una web tan grande y que involucraba tantos desarrolladores y tantas páginas tan diferentes entre sí no podíamos permitirnos el lujo de retrabajar. Ni de que aparecieran errores en una página y en otra otros diferentes. Ni que alguien tocara algo y rompiera otra cosa que desconocía que estaba en otra página escondida. No teníamos ese tiempo. Cualquier tontería podía convertirse en buscar una aguja en un pajar. Era imposible construir esta web sin pararse a pensar bien en cómo organizar todo el desarrollo.

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDloaGo2dTRmbjF3aWRnODYxMjc1YWdqYW1pcWhvdTNsZGFxOTB6OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13R4gPwPpLHQwU/giphy.gif"/>

Era un viernes a las 14.45, me faltaban 15 minutos para irme cuando me enteré de que el Lunes yo era el primero que empezaba a trabajar activamente en esta obra faraónica. No era moco de pavo. **Pensé que era mejor dedicarle un tiempo a pensar cómo hacerlo durante el fin de semana. Como diantres hacer que todo el equipo se focalizara en construir en lugar de pelearnos por "que se vea todo bien".**

Resulta que **la respuesta estaba en [Vanesa Marcos Dávila](https://www.linkedin.com/in/vanesa-marcos-davila/)**, la diseñadora de producto que trabajababa en el equipo, que fué mi compañera durante muchos años y a la que considero mi amiga. Había estado claudicando cosas como **Atomic Design** y la idea de que en desarrollo también teníamos que centrarnos en desarrollar átomos, que pudieramos reutilizar en moléculas, que a su vez estas partículas formaran organismos y poder construir cada página a base de plantillas o elemenos más reutilizables y modulares que poder intercambiar.

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3M2bGt1cDhtN3YwdHdndnBhaXp0MGJwZGI2ajRjZnRnamIzMWQ0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZtwEXtGMG80xWetwUb/giphy.gif"/>

Ella, en su programa de diseño (Figma), tenía cada página hecha pero realmente se dedicaba a colocar piezas ya hechas y listas para cambiar por otras variantes en cuestión de segundos. No se equivocaba nunca porque esos módulos estaban muy bien construidos, con todos los espacios bien puestos, colores, diseño responsive y todo el "rollo este" que en un proyecto así podía quitar muchísimo tiempo y personas para que el acabado fuera simplemente "ok". Todas sus piezas se veían y se comportaban bien.

<img src="/images/partes-atomic-design.webp"/>
Fuente: uifrommars.com

Os explicaría mejor esto del Atomic Design pero es que [aqui lo tienen tan bien](https://www.uifrommars.com/atomic-design-ventajas/) explicado que os aconsejo que leáis bien de que va, es super interesante. 

En desarrollo no había nada así. Nada tan organizado y menos nada que el resto de compis devs pudieran integrar en su flujo de trabajo. De oídas, estos galimatías sonaban muy bien pero en una aplicación tan grande y con tantas partes legacy era algo muy dificil de poner en práctica. 

Con la web corporativa estábamos en un terreno completamente nuevo. Inexplorado. Diferente. Necesitábamos reducir errores. Ganar velocidad. Dejarnos de "rollos".

Lo más cómodo para todos los desarrolladores era poder ir a algún sitio en el que pudieran encontrar cada sección que tuviera la página a realizar, copiar-pegar la sección en su correcta variante, poner textos, traducirlos y a otra página.

El sábado recordé que había leído sobre [Vitepress](vitepress.dev) en Twitter. Lo usaban varios proyectos open source del ecosistema de Vue para construir sus propias documentaciones. Al final era un paso más cerca de lo que necesitábamos, un sitio en el que los desarrolladores pudieran encontrar esos componentes ya hechos y listos para copiar. 

<img src="/images/vitepress.png" />

Lo instalé y me puse a ver que posibilidades nos daba. Fui instalandole cosillas y acabé más o menos con el mismo set de tecnologías que íbamos a usar para levantar la web corporativa. Sass + TailwindCss y  Vue. Además tenía una forma muy guay de levantar los artículos de la documentación, el menú se generaba solo. Dejaban jugar con componentes de Vue directamente en un archivo .md (Markdown). Las posibilidades eran ilimitadas. Todo empezaba a tomar cuerpo. Con estas 3 cosas eran suficientes para construir lo que necesitaba.

En mi cabeza, quería generar el set de piezas, componentes y todo lo necesario para montar la web. Igual que una fábrica de coches pero en otra fábrica más rápida. Si pensáramos en esto como si fuera una fábrica de coches, en ese sitio **aparte**, quería dejar hechas todas las variedades de puertas, motores, ventanillas y otros componentes mecánicos necesarios para que el resto del equipo pudiera entrar a juntarlo todos acabando con la página final perfectamente hecha. Con cada detalle cuidado. El coche montado. Perfecto. Una cadena de producción.

Me faltaba resolver una última variable en la ecuación. 

Aún tenía que dilucidar cómo iba a hacer que todas esas piezas de montaje acabaran juntas en el proyecto de la web corporativa que, al fin y a la postre, era la finalidad de todo este tinglado. Y hacer que el proyecto de la web corporativa funcionara.

Me faltaba encontrar el pegamento.

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzd4dWFjeXFoaWN1a2NtbnQxdDA5M2g0cGlwbHBiNXRleGpiZHo0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ootyIvFrXuFy0/giphy.gif"/>

Si estás dentro del mundo del desarrollo, sabrás que es muy normal tirar de librerías, paquetes o similares para desarrollar algo. Si no lo estás dentro del mundo dev no pasa nada. Hablo de piezas de código que alguien mucho más listo que tu de la comunidad dev que se haya encontrado el mismo problema y lo ha resuelto, ha sido lo suficientemete majo como para ponerlo a disposición de internet para que cada uno pueda usarlo también. Si la rueda ya está inventada no hace falta que la reinventes, reutiliza y pon tu atención en lo importante: Desarrollar.

Lo que estaba intentando hacer yo aquí era un paquete de código. La web corporativa iba a tener como dependencia este paquete de código. Lo que quería era que el resto del equipo pusiera su atención en lo importante, llegar a tiempo y bien. Al ser todo javascript, css y sass, el pegamento que nos faltaba era que necesitábamos publicar este set de piezas de coche en forma de paquete de NPM.
 
¿La pega? Que no debía ser algo que estuviera disponible en internet, era de la empresa, su imagen de marca. Debía de ser algo privado. Para hacer esto medianamente bien había que montar algún Nexus para mantener el registro de versiones. Conectarlo con algún bucket de S3 y que estuviera alojado totalmente dentro de la red de la empresa. Es lo que con el tiempo acabamos haciendo, la solución inicial y la que usamos para salir a producción fue usar Github para publicar los paquetes privados de NPM y hacer que el proyecto de la web corporativa los usara como dependencias y poder usarlos en ese proyecto. Solo había que generar un token privado en la configuración de cuenta de Github para que nos funcionara a todos.

Despúes de un par de pruebas, errores y consultar mucha documentación, conseguí publicar un par de versiones de esa primera librería de NPM. No solo eso, conseguí instalarla en un proyecto de web corporativa y que además también mostrara esos componentes tal y como los había dejado en **_la fábrica_**. 

Íbamos a seguir Atomic Design. Íbamos a ser una fábrica de coches. Estaba emocionado por plantear lo que había encontrado ese fin de semana al equipo. Por fin íbamos a cambiar la forma en la que trabajabamos. Estaba seguro de que todo el mundo iba a estar tan entusiasmado como yo. No veía otra manera de cumplir los plazos y no provocar una marabunta de fallos en caso de hacerlo de otra manera, estaba segurísimo. 

Ese era el camino.

Cuando mostré todo lo que había descubierto ese fin de semana y expliqué la idea ese mismo lunes al equipo, recuerdo que, en líneas generales, no gustó.

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW82cXpyb3gwNXRrcXZiMHkzNHdjcWo5MGFjc2htMjR1NnFlanR2NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OOezqqxPB8aJ2/giphy.gif" />

Tardamos algunos días en convencer a todos de que era la única manera de avanzar. Habían miembros del equipo que podían dedicarse más en el SEO, otros en el contenido y otros aún tenían que acabar otras tareas que estabamos finalizando. Por suerte [David Zamora](https://www.linkedin.com/in/davidzamoragutierrez/), el Team Lead a cargo del equipo, apoyó la idea y vimos que en una semana o dos podía dejar todas las piezas que íbamos a necesitar para levantar todo. Una sola persona iba a encargarse del diseño. Yo iba a ser esa persona. Otras 5-8 personas quedaban totalmente libres para centrarse en finalizar por completo cada página.

Apodamos a ese sistema de diseño "Penguin" Design System. Creo que fue David quién apodó así a _la fábrica_ de componentes en los que iba a dejar todo. El logo de Minderest realmente son 3 delfines. Necesitábamos un animal marino "corporativo". Al final un pinguino es un animal marino y parece que va vestido en un esmoquin. Quedaba bien. 🐧

Esto de los sistemas de diseño no es algo que hayamos inventado aquí. Es un marco de trabajo bastante extendido en la industria. 

- Decathlon [link](https://zeroheight.com/726f8c765/p/75e137-digital-overview)
- Emiratos Árabes [link](https://designsystem.gov.ae/)
- Salesforce [link](https://www.lightningdesignsystem.com/2e1ef8501/p/85bd85-lightning-design-system-2)
- IBM [link](https://carbondesignsystem.com/)
- Shopify [link](https://polaris-react.shopify.com/)
- Apple [link](https://developer.apple.com/design/human-interface-guidelines/)

El desarrollo fue como esperábamos. Algunas cosas dentro del sistema de diseño se atascaron un poco más pero en lineas generales conseguimos hacerlo funcionar todo. En cuanto tuve el sistema de diseño algo cocinado, el resto del equipo pudo ir entrando poco a poco al proyecto.

Conforme avanzaban los días, los compañeros iban terminando de desarrollar más y más páginas. El flujo de trabajo era el que me imaginaba, copiar, pegar y todo se veía como debía. Salían errores pero estabamos bastante sincronizados. Al final cada cosa que alguien me comentaba que necesitaba ajustar o corregir era algo que yo revisaba, discutía con Vanesa y lo aplicaba al sistema de diseño. El flujo de trabajo estaba más organizado, no era lo mismo ir 5-8 devs a ver cosas que corregir con la UX Designer que tener a otro dev encargado en exclusiva de corregirlas. Las interrupciones no son las mismas y compartimentamos la resolución de problemas. 

La comunicación fluía bien con Vanesa y cuando publicaba una actualización, la recibían el resto de compañeros. El sistema de diseño mejoraba por días y tardamos poco tiempo en implantar el sistema de Copia y Pega para levantar cada una de las páginas.

Una vez estuvieron casi todas las páginas terminadas, fuimos encontrando algún error como es normal. Corregirlo en el sistema de diseño y lanzar una actualización hacía que el fix fuera global para todas las páginas. El ahorro de tiempo, multiplicado por todos los compañeros y por el número de páginas se hizo bastante dificil de calcular. El ahorro de tiempo fue exponencial.

Todo este lío resultó ser la fundación de la creación de un sistema de diseño pensado para la aplicación principal que puede que trate en otra entrada. 

Al final, conseguimos lanzar este mastodonte de web a tiempo, todos juntos. En equipo.

<img src="/images/lanzamiento.jpg"/>


--- 

**Aviso legal**

_Todos los nombres comerciales, marcas registradas, logotipos, imágenes y referencias a productos o servicios mencionados en esta publicación pertenecen a sus respectivos propietarios. Minderest es una marca registrada propiedad de Minderest S.L., y yo no poseo derechos sobre ella. El contenido de este artículo refleja mi experiencia personal y profesional en el desarrollo de proyectos durante mi etapa en la empresa, y se comparte únicamente con fines informativos y divulgativos._