<h3 align="center">RESTful API - Presentation home assigment</h3>
About The Project

This project is basicly a RESTful API with mongoDB with a few functions which includes:

* reading and writing presentations using calls to the API 
* Change and modify article's detailes and even individual slides 
* Deleting presentations and slides 

This project uses mongo's online interface and Mongoose's API and built-in functions


<h2 align="center">⚒️ Languages-Frameworks-Tools ⚒️</h2>
<br/>
<div align="center">
    <img src="https://skillicons.dev/icons?i=vscode,github,javascript,mongodb,nodejs,express" />  
</div>

<h2 align="center">How to use</h2>
<br/>
<h3 ><u>Schema</u></h3>

In the Data Base we have 2 schemes:
* Presentation's schema
* Slide's schema

The Presentation schema is built from an ID (mongo's) and a unique title,  an array of Authors, the date it was created on and an array Slides in order.
All of the fields are mendatory.

The Slide schema is built from 2 mandatory fields the header (title) and the content also it has an optional field which is a string array that called photos which you can store the url of all th photos in your slide.

<h3 ><u>Functions</u></h3>

As mentioned above the API supports reading writing and deleting data 

<h4 ><u>Reading</u></h4>
The user can read all the presentations from  our API using GET HTTP request to : http://localhost:3000/presentation/get/all 

The user can also read particular presentation our API using GET HTTP request to : http://localhost:3000/presentation/get/:title

In the link you will have to replace the "title" parameter with the actuall title of the presentation that he is looking for.

<h4 ><u>Writing</u></h4>
The user can create a new presentation using a
POST HTTP request to :

 http://localhost:3000/presentation/new

In this request the user is acuired to send a JSON with the request which contain :
"Title" string, "Slides" array, "Authors" array and "Date_of_Publishment" in the format of "YYYY-MM-DD"

<h5 ><u>example :</u></h5>

{
    
    "Title":"home assigment2",

    "slides":[{"header":"slide 1","content":"content"}],

    "Authors": ["mozart","charmander"],
    "Date_of_Publishment": "2012-04-23"
}

If the user will try to add a presentation with a title that is already exist he will get an error

The user can also modify the presentation's authors list by using a
PATCH HTTP request to : http://localhost:3000/presentation/modify/authors

In this case the presentation's title and the fixed authors list should be sent in a JSON format as shown in the example above 

Editing slides is also an option we can add a slide using a
PATCH HTTP request to : http://localhost:3000/presentation/new/slide

In this case the user will have to send the new slide in the format of the schema listed above and the index of which place in the presentation the new slide suppose to be if the index is lesser then one an error will ouccur but if the index is higher then the amount of the existing slides it will add it to the back no matter the amount of slides.

We can also modify a slide from the presentation by using a
PATCH HTTP request to : http://localhost:3000/presentation/modify/slide

The user will provide a JSON with the title of the presentation and the entire data of the altered slide including everythin that is in the schema
<h4 ><u>Deleting</u></h4>
we can delete an individual slide or an entire presentation.
To delete an entire presentation send a DELETE HTTP request to : 

http://localhost:3000/presentation/delete/:title

In the link you will have to replace the "title" parameter with the actuall title of the presentation that he is looking for.

And finally we can also delete an individual slide by using a
DELETe HTTP request to : http://localhost:3000/presentation/delete/slide
in this case the user will need to send a JSON with the title of the presentation and the index of the requested slide 





