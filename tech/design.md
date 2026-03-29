# Introduction
this is my blog site, so it will be just silent, I think it should be like just HTML+CSS+JS, no more database
## Some design
We first denote the kind of files
### HTML
**post files**
    I will store them into folder "posts". 
    Posts have **tags**: Languages(Chinese or English), date(when set it up), subject(math, poem, ideas...), 
    Posts have a basic background design, and the design templates can decide its own or selected by subjects. When I want to make a new post, I just need to create a html file in folder posts, then add a line of code in <head> to use the templates and like 
    ```
    <tag date="yyyy-mm-dd", subject="", title="", author="", custom_subject="", language="",and so on...   ></tag>
    ```
    for example I can add a file "静夜思.html" then there can be in head, I will add <tag date="2026-03-29", subject="中国文学", title="静夜思", author="李白", custom_subject="唐诗", language="中文",and so on...   ></tag>
**index.html** 
    it can auto tect new files in post files and find the tags.
    **Daily new files**: this is check the date, and post daily files, else, just type "no articles come out yet today."
    In this section, it shows the entry of each files which contains "title, author, subject, views(read times),language" of each entry
    **Top read files**, there will be a section which shows the top 10 read files, which shows "title, author, subject, views, date，language"
    **sections**, this is a filter of each section, every block means an entry to each file. like there should be a block of "math" and it guides to "math.index.html" and the css there should be pretty mathmatical. 
    **language**, in index.html, add a change language selection, first add English and Chinese


### The functions
1. every post file will count the enter times, that is what i have said, the "views"


    
