---
layout: post
title:  PiTracker
image_path: /images/projects/piTracker/piTracker_demo.gif
panel_desc: Deep-tracking Raspberry Pi Rover
tagline: Raspberry Pi rover mounted with a pan-tilt camera that is capable of tracking objects using object detection and Proportional Integral Derivative processes
filters: hacks
links:
    code: 
        text: code
        link: https://github.com/jwnicholas99/PiTracker
        logo: fa fa-github
skills:
    - Python
    - TensorFlow
    - Raspberry Pi
    - OpenCV
---
## 1&nbsp;&nbsp;&nbsp;Overview

Using a Raspberry Pi4 (2GB), I built a two-wheeled rover capable of tracking objects with its pan-tilt camera. To accomodate the RPi's relatively weak CPU, I used Tensorflow Lite and Mobilenet-Single Shot Detection (SSD), a lightweight model with decent performance. To control the pan-tilt camera, I tuned two Proportional Integral Derivative (PID) controllers to control two servo motors (one for panning and another for tilting).

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/piTracker_demo.gif">
    <figcaption>
        PiTracker tracking a human (me! :))
    </figcaption>
</figure>

## 2&nbsp;&nbsp;&nbsp;Motivation
During the (sweltering) summer of 2020, our pet Crystal developed a skin condition that forced her to be in a constant state of itchiness. As biting and scratching herself drew blood, we needed to constantly observe her and intervene when necessary. Frustrated with how often she sneaked off to bite herself, I built an object-tracking rover to follow her around.

## 3&nbsp;&nbsp;&nbsp;Design

### 3.1&nbsp;&nbsp;Hardware

I used the following hardware:
* Raspberry Pi 4B (at least 2GB recommended)
* [Robot Car Chassis](https://sg.cytron.io/p-2wd-smart-robot-car-chassis?src=us.special.c)
  * TT Motor + Wheel  X 2
  * 4xAA battery holder
  * Acrylic board to hold everything together
* [L298N Motor Driver](https://sg.cytron.io/p-2amp-7v-30v-l298n-motor-driver-stepper-driver-2-channels?src=us.special) (Used to control the motors)
* [5MP Camera for Raspberry Pi](https://sg.cytron.io/p-5mp-camera-board-for-raspberry-pi?search=camera&description=1&src=search.list)
* [FFC Cable longer than 20cm](https://sg.cytron.io/p-raspberry-pi-15-pin-camera-ffc-cable-50cm?search=FFC%20cable&description=1&src=search.list) (as you will need to move your camera around)
* [SG90 Micro Servo](https://sg.cytron.io/p-sg90-micro-servo?search=servo&description=1&src=search.list) X 2 (to pan/tilt camera)
* Mini breadboard
* Jumper wires

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/overall_schematic.png">
    <figcaption>
        Overall schematic diagram 
    </figcaption>
</figure>

The above schematic is how I connected all the components together. There are two parts to the diagram: the motors (the batteries, L298N motor driver and the two DC motors) and the servos (the breadboard and two servos).

#### 3.1.1&nbsp;The Motors

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/motors_schematic.png">
    <figcaption>
        Schematic diagram of motors 
    </figcaption>
</figure>

1. Connect the two DC motors to the L298N motor driver 
2. Connect GPIO BOARD pin 13 to the L298N in1 pin (Brown) ![#B63802](https://via.placeholder.com/15/B63802/000000?text=+)
3. Connect GPIO BOARD pin 11 to the L298N in2 pin (Orange) ![#F6C02C](https://via.placeholder.com/15/F6C02C/000000?text=+)
4. Connect GPIO BOARD pin 15 to the L298N en1 pin (Green) ![#2FF32](https://via.placeholder.com/15/12FF32/000000?text=+)
5. Connect GPIO BOARD pin 16 to the L298N in3 pin (Blue) ![#1261FF](https://via.placeholder.com/15/1261FF/000000?text=+)
6. Connect GPIO BOARD pin 18 to the L298N in4 pin (Purple) ![#9012FF](https://via.placeholder.com/15/9012FF/000000?text=+)
7. Connect GPIO BOARD pin 22 to the L298N en2 pin (White) ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+)
8. Connect the batteries to the L298N
9. Connect the L298N to a GPIO GND pin

#### 3.1.2&nbsp;The Servos
The servos are simply wired up according to the previous schematic diagram. The servos are used to build the pan-tilt camera (with some old-fashioned duct-tape):
<figure class="lazyload">
    <div class="img-two-cols">
        <img class="responsive-image lazyload left" data-src="/images/projects/piTracker/camera-front.jpg">
        <img class="responsive-image lazyload right" data-src="/images/projects/piTracker/camera-side.jpg">
    </div>
    <figcaption>
        Front and side view of pan-tilt camera
    </figcaption>
</figure>

### 3.2&nbsp;&nbsp;Software

To track an object, the PiTracker needs to be able to, first, detect and draw bounding boxes around objects, and second, move the pan-tilt camera to track the detected object.

#### 3.2.1&nbsp;Object Detection
<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/object_detection.png">
    <figcaption>
        Bounding boxes in object detection 
    </figcaption>
</figure>
In object detection, bounding boxes are drawn around detected objects and labelled with a class and corresponding class confidence score. In the diagram above, after feeding the image into an object detection model, a bounding box is drawn around the person and given a high confidence score of 93% for the "human" label. On the other hand, a bounding box is drawn around the jellyfish with a low confidence score of 36% for the "fish" label.

As the RPi has limited CPU resources, most state-of-the-art object detection models like Faster-RCNN and YOLO-v3 (even the Tiny version) are too demanding, resulting in an abysmal ~0.1-0.2 FPS. After experimenting with various object detection models, I found that using a quantized Mobilenet-Single Shot Detection (SSD) on TensorFlow Lite was able to detect objects with decent accuracy at a reasonable 3-4 FPS. 

Refer to [<code>/utils/obj_detector.py</code>](https://github.com/jwnicholas99/PiTracker/blob/master/utils/obj_detector.py) for the implementation details.


#### 3.2.2&nbsp;Moving the Pan-Tilt Camera
After detecting an object, the PiTracker needs to be able to move the pan-tilt camera according to the position of the bounding box drawn around the detected object. As the pan and tilt of the camera are each determined by a servo motor, I tuned two PID controllers to change the angle of the servo motors according to the position of the bounding box.
<figure class="lazyload">
    <img class="responsive-image lazyload small" data-src="/images/projects/piTracker/pan_tilt.png">
    <figcaption>
       Pan and tilt directions 
    </figcaption>
</figure>
<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/tracker_calculate.png">
    <figcaption>
       Calculating how to move camera according to bounding box 
    </figcaption>
</figure>
The inputs to the pan servo PID controller and tilt servo PID controller are the differences in the x-axis position (X) and the y-axis position (Y) of the center of the frame and the center of the bounding box accordingly. The goal of the controllers is to move their servo motors to reduce X and Y to 0, essentially centering the object in the frame. 

Note that as SSD can detect multiple objects in one frame, I restricted the tracker to only track the object with the highest confidence score of the chosen class (eg. human, dog, book, etc.).

Refer to [<code>/utils/tracking.py</code>](https://github.com/jwnicholas99/PiTracker/blob/master/utils/tracking.py) for the implementation details.

## 4&nbsp;&nbsp;&nbsp;Results
Here's a gif of the PiTracker tracking Crystal:

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/piTracker/pitracker_crystal.gif">
    <figcaption>
        Scratching herself again...
    </figcaption>
</figure>