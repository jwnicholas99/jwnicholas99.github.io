---
layout: post
title:  Diagnosis Clarity
image_path: /images/projects/weenix/weenix_demo.png
banner_path:
panel_desc: Mood-tracking Web Application
tagline: Raspberry Pi rover mounted with a pan-tilt camera that is capable of tracking objects using object detection and Proportional Integral Derivative processes
card_color: "#CB356B"
filters: software
skills:
    - Python
    - TensorFlow
    - Raspberry Pi
    - OpenCV
---

# Overview

Using the Raspberry Pi4 (2GB), I built a two-wheeled rover mounted with a pan-tilt camera that can track objects. In order to work with the rpi's relatively weak CPU, I used Tensorflow Lite and Mobilenet-Single Shot Detection (SSD), a lightweight model with decent performance. To control the pan-tilt camera, I used twotuned Proportional Integral Derivative (PID) processes to control two servo motors.