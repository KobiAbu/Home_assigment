<h3 align="center">RESTful API - Presentation Home Assignment</h3>
About The Project

This project is basically a RESTful API with MongoDB with a few functions which include:

* Reading and writing presentations using calls to the API 
* Changing and modifying article's details and even individual slides 
* Deleting presentations and slides 

This project uses Mongo's online interface and Mongoose's API and built-in functions.

<h2 align="center">⚒️ Languages-Frameworks-Tools ⚒️</h2>
<br/>
<div align="center">
    <img src="https://skillicons.dev/icons?i=vscode,github,javascript,mongodb,nodejs,express" />  
</div>

<h2 align="center">How to Use</h2>
<br/>
<h3><u>Schema</u></h3>

In the database, we have 2 schemas:
* Presentation's schema
* Slide's schema

The Presentation schema is built from an ID (Mongo's) and a unique title, an array of Authors, the date it was created on, and an array of Slides in order.
All of the fields are mandatory.

The Slide schema is built from 2 mandatory fields: the header (title) and the content. It also has an optional field, which is a string array called 'photos' where you can store the URLs of all the photos in your slide.

<h3><u>Functions</u></h3>

To start the server, type `npm start` in the console, and the server will run on `localhost:3000` (you may need to install dependencies).

As mentioned above, the API supports reading, writing, and deleting data.

<h4><u>Reading</u></h4>
The user can read all the presentations from our API using a GET HTTP request to: 
`http://localhost:3000/presentation/get/all`

The user can also read a particular presentation from our API using a GET HTTP request to: 
`http://localhost:3000/presentation/get/:title`

In the link, you will have to replace the "title" parameter with the actual title of the presentation that they are looking for.

<h4><u>Writing</u></h4>
The user can create a new presentation using a POST HTTP request to:

`http://localhost:3000/presentation/new`

In this request, the user is required to send a JSON with the request which contains:
"Title" string, "slides" array of type slide by its schema, "Authors" array, and "Date_of_Publishment" string in the format of "YYYY-MM-DD".

<h5><u>Example :</u></h5>

```json
{
    "Title": "home assignment 2",
    "slides": [{"header": "slide 1", "content": "content"}],
    "Authors": ["Mozart", "Charmander"],
    "Date_of_Publishment": "2012-04-23"
}
```

If the user tries to add a presentation with a title that already exists, they will get an error. Also, if the user tries to add a date that is not possible or not in the right format, it will send a custom error. The API will also check that the authors' list and the slides list are not empty and that all the slides are in the right format.

The user can also modify the presentation's authors list by using a PATCH HTTP request to: `http://localhost:3000/presentation/modify/authors`

In this case, the presentation's title, list of authors, and an 'action' string are required, which can be either:
* 'replace' to fully replace the authors list with the given list
* 'delete' to delete the authors that are given inside the new list from the list of authors (if one of the names is not in the original authors list, then the entire request will be denied, and also if the user tries to delete all of the authors in the list)
* 'add' which will add the new authors to the existing list of authors 

Editing slides is also an option. We can add a slide using a PATCH HTTP request to: `http://localhost:3000/presentation/new/slide`

In this case, the user will have to send the new slide in the format of the schema listed above and the index of the place in the presentation where the new slide is supposed to be. If the index is less than one, an error will occur, but if the index is higher than the number of existing slides +1 (in the case that the user wants to add it to the top), an error will be thrown.

We can also modify a slide from the presentation by using a PATCH HTTP request to: `http://localhost:3000/presentation/modify/slide`

The user will provide a JSON with the title of the presentation and the index of the slide that they would like to edit. In editing, the user could change the following fields: the header (specify in the 'header' field), the text (specify in the 'text' field), and the list of photos (specify in the 'photos' field). To change any of them, just specify the field you want to change with the data in the correct format.

<h5><u>Example:</u></h5>

```json
{
    "Title": "hey333",
    "index": 1,
    "photos": ["a", "b"],
    "header": "new header"
}
```
<h4><u>Deleting</u></h4>
We can delete an individual slide or an entire presentation. To delete an entire presentation, send a DELETE HTTP request to:

`http://localhost:3000/presentation/delete/:title`

In the link, you will have to replace the "title" parameter with the actual title of the presentation that they are looking for.

Finally, we can also delete an individual slide by using a DELETE HTTP request to: `http://localhost:3000/presentation/delete/slide`

In this case, the user will need to send a JSON with the title of the presentation and the index of the requested slide.






