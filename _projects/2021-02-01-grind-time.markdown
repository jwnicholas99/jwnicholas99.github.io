---
layout: post
title:  GrindTime
image_path: /images/projects/grindTime/grindTime_demo.png
panel_desc: Quick and Convenient Way to Manage and Grind Through Your Applications
tagline: Chrome extension that saves application URLs and autofills applications for configured fields  
filters: hacks
links:
    code: 
        text: code
        link: https://github.com/jwnicholas99/ApplicationPlayList
        logo: fa fa-github
    devpost:
        text: devpost
        link: https://devpost.com/software/grind-time-79qdh4
        logo: fa fa-globe
skills:
    - HTML/CSS
    - JavaScript
    - Chrome
---

## 1&nbsp;&nbsp;&nbsp;Overview
For Hack@Brown 2021, we built a Chrome extension for managing applications. We were awarded the Wolfram Award as one of the top hackathon projects.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/grindTime/grindTime_demo.png">
    <figcaption>
        Snapshot of Chrome extension
    </figcaption>
</figure>

## 2&nbsp;&nbsp;&nbsp;Motivation
Applying for jobs is often a tedious and extremely repetitive process - there are just so many applications, and each requires you to fill in the same few fields: name, education, experience, etc.

As such, we hoped to create an easily accessible yet simple to use browser extension that can alleviate these pain-points.

<br>

## 3&nbsp;&nbsp;&nbsp;Design
### 3.1&nbsp;&nbsp;&nbsp;Play/Pause
We conceive applying to jobs as "sessions" - you sit down and grind through a bunch of application in one session. To facilitate such a workflow, we have a play/pause button that triggers the start and end of a session. When you start a session, the extension first saves the current webpage you are on, then loads the first application URL on your list. When you end a session, the extension loads the saved webpage you were on before you started the session. This allows for quick context-switching where you can easily switch between other work and applying for jobs.

<figure class="lazyload">
    <img class="responsive-image lazyload large" data-src="/images/projects/grindTime/play_pause.gif">
    <figcaption>
        Play/Pause for quick context-switching
    </figcaption>
</figure>

### 3.2&nbsp;&nbsp;&nbsp;Saving Applications
Application URLs are saved as a list. Using Chrome's special purpose APIs like <code>chrome.storage</code>, application URLs are stored in your browser's local storage and will persist across sessions. 

### 3.3&nbsp;&nbsp;&nbsp;Autofill
Most applications have the same few fields: First Name, Last Name, Email, etc. We allow users to autofill these fields with a click of a button:

<figure class="lazyload">
    <img class="responsive-image lazyload large" data-src="/images/projects/grindTime/autofill.gif">
    <figcaption>
        Autofill application form fields
    </figcaption>
</figure>

## 4&nbsp;&nbsp;&nbsp;Future Work
Additional features we can implement:
* Ability to save application form progress
* Support autofilling file fields (eg. upload resume)
* Incentivising users for completing applications

<br>
_Thanks [Alex](https://github.com/alexanderivanov2424) and [Jason](https://github.com/jason-crowley) for working on this with me!_