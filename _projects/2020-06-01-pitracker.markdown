---
layout: post
title:  PiTracker
image_path: /images/projects/pitracker/rpi_demo.gif
banner_path:
panel_desc: Deep-tracking Raspberry Pi Rover
tagline: Raspberry Pi rover mounted with a pan-tilt camera that is capable of tracking objects using object detection and Proportional Integral Derivative processes
card_color: "#CB356B"
filters: hacks
skills:
    - Python
    - TensorFlow
    - Raspberry Pi
    - OpenCV
---

# Overview

Using the Raspberry Pi4 (2GB), I built a two-wheeled rover mounted with a pan-tilt camera that can track objects. In order to work with the rpi's relatively weak CPU, I used Tensorflow Lite and Mobilenet-Single Shot Detection (SSD), a lightweight model with decent performance. To control the pan-tilt camera, I used twotuned Proportional Integral Derivative (PID) processes to control two servo motors.