---
layout: post
title:  GrindTime
image_path: /images/projects/grindTime/grindTime_demo.png
panel_desc: Quick and Convenient Way to Manage and Grind Through Your Applications
tagline: GrindTime
filters: hacks
skills:
    - HTML/CSS
    - JavaScript
    - Chrome
---

# Overview

Using the Raspberry Pi4 (2GB), I built a two-wheeled rover mounted with a pan-tilt camera that can track objects. In order to work with the rpi's relatively weak CPU, I used Tensorflow Lite and Mobilenet-Single Shot Detection (SSD), a lightweight model with decent performance. To control the pan-tilt camera, I used twotuned Proportional Integral Derivative (PID) processes to control two servo motors.