# Manga-curator
## A site to search for similar manga!

## Live demo on:
https://manga-curator.herokuapp.com/

# Screenshots of the project

## Homepage
![Screenshot of home page](https://github.com/kshitij-p/manga-curator/blob/main/docs/images/homepage.png?raw=true)

## Display page
![Screenshot of display page](https://github.com/kshitij-p/manga-curator/blob/main/docs/images/showpage.png?raw=true)

## Search for similar page
![Screenshot of search similar page](https://github.com/kshitij-p/manga-curator/blob/main/docs/images/similarpage.png?raw=true)

# Technologies used:
### 1. Jikan API to get data
### 2. Express for backend
### 3. MongoDB for storing users and cache (Didnt want to get into setting up Webdis and also wanted to not load the similar list completely on the back end as that makes for a very bad user experience making the user wait for too long without feedback)
### 4. Redis to cache display page results
### 5. Mailgun(send in blue) and nodemailer for mails
