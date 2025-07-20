---
layout: post
title: RemoteExplorer
image_path: /images/projects/remoteExplorer/remoteExplorer_demo.png
panel_desc: Environment Mapping and Reconstruction for Remote Exploration
tagline: Mapping an environment using LiDAR + RGB-D sensor data and dynamically reconstructing it as a 3D Unity virtual reality environment
filters: research academics
links:
  unity_code:
    text: Unity code
    link: https://github.com/jwnicholas99/vrRemoteExplorer
    logo: fa fa-github
  ros_code:
    text: ROS code
    link: https://github.com/jwnicholas99/ros_remote_explorer
    logo: fa fa-github
  report:
    text: report
    link: /remoteExplorer_report
    logo: fa fa-file-pdf-o
skills:
  - Python
  - C++
  - ROS
  - C#
  - Unity
---

## 1&nbsp;&nbsp;&nbsp;Overview

As the self-proposed project for CSCI2951K: Topics in Collaborative Robotics, I worked on the mapping and reconstruction of remote environments as a 3D virtual environment for exploration. For this project, I used the Kinova Movo as the robot.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/remoteExplorer_demo.png">
    <figcaption>
        Reconstruction of the 8th floor of the Brown Sciences Library
    </figcaption>
</figure>

## 2&nbsp;&nbsp;&nbsp;Motivation

Robots are powerful tools for exploring remote and hostile environments inaccessible to humans. From conducting rescue operations in disaster zones to surveying unexplored areas in combat situations to space exploration, robots present a safe, viable alternative to direct human engagement. Using robots for remote exploration first requires mapping the remote environment.

The current approach to mapping an unknown environment is using a simultaneous localization and mapping (SLAM) algorithm. However, these maps are often not virtual environments that can be explored. As such, the 3D environment needs to be projected onto a 2D surface like a screen - this is unintuitive for exploration as this is different from how humans view the world. Previous approaches are also mostly focused on VR teleoperation - this means that they only visualize the immediate surroundings of the robot at that point in time instead of generating a persistent map.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/3d_to_2d.png">
    <figcaption>
        Loss of curvature when mapping from 3D to 2D
    </figcaption>
</figure>

Therefore, the motivation of this project is to map and reconstruct environments in a way that is intuitive for human exploration. I believe that a 3D virtual environment that is explorable via a virtual reality (VR) system best answers this.

<br>
## 3&nbsp;&nbsp;&nbsp;Technical Approach
As off-the-shelf SLAM algorithms are already mature and robust, we used [RTAB-Map](http://introlab.github.io/rtabmap/) as the SLAM algorithm for mapping the environment.

With this, we essentially need to facilitate the following feedback loop:

1. The robot collects and sends sensor data to RTAB-Map
2. RTAB-Map generates and transmits map data to Unity
3. Unity renders the map as a virtual environment for the user to see
4. The user sees the virtual environment that is updated in real-time and sends the appropriate movement inputs to the robot (back to step 1)

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/feedback_loop.png">
    <figcaption>
        Feedback loop
    </figcaption>
</figure>

To faciliate the above feedback loop, we created a software stack outlined below:

<figure class="lazyload">
    <img class="responsive-image lazyload large" data-src="/images/projects/remoteExplorer/software_stack.png">
    <figcaption>
        Software stack
    </figcaption>
</figure>

On the ROS side (right), the robot publishes 4 ROS topics: color image (`sensor_msgs/CompressedImage`) and depth image (`sensor_msgs/CompressedImage`) from the Movo’s Kinect2, transform (`tf2_msgs/TFMessage`) and base scan (`sensor_msgs/LaserScan`) from the Movo’s LiDAR.

RTAB-Map subscribes to these 4 topics and performs SLAM, publishing two ROS topics that constitute the map: grid map (`nav_msgs/OccupancyGrid`) and global map (`rtabmap_ros/mapData`).

We then use ROS-Sharp to communicate between the ROS side and the Unity side - 5 streams of data are sent over to the Unity side: transform, color image, depth image, grid map and global map. The Unity scene has 4 GameObjects that render these 5 data streams:

1. TF Listener: Uses transform to position the virtual Movo within the scene
2. Grid Map Renderer: Renders grid map as a 2D mesh covering the floor
3. RGB-D Renderer: Uses color image and depth image to generate and render a RGB-D point cloud that represents the current view from the Movo’s Kinect2
4. Global Map Renderer: Renders map data as a global point cloud representing the map of the remote environment.

As the Unity scene is continuously updated in near real-time, the user views the scene using an Oculus Quest VR system. The user then uses the Oculus Quest controllers to send controller inputs (`sensor_msgs/Joy`) that are sent over ROS-Sharp and published as movement inputs (`geometry_msgs/Twist`) to the Movo. The Movo moves according to these movement inputs. This completes the feedback loop.

### 3.1&nbsp;&nbsp;Rendering in Unity

Here, I will elaborate on how each of the 5 data streams is rendered and the problems encountered.

#### 3.1.1&nbsp;Transform

A robot has many different coordinate frames - the transform describes how they are arranged in relation to each other.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/transform.png">
    <figcaption>
        Transform between multiple frames
    </figcaption>
</figure>

To position the virtual Movo within the Unity scene, we parse the transform messages and arrange the Movo’s frames accordingly. However, we encounter bandwidth issues as there are a lot of frames within the Movo, hence creating a flood of `tf2_msgs/TFMessage` messages.

**Optimization**: As we only need `/map->/odom` and `/odom->base_link messages`, we wrote a ROS node ([`tf_minimal.py`](https://github.com/jwnicholas99/ros_remote_explorer/blob/master/slam/src/tf_minimal.py)) to filter out other uneeded transform messages. To filter out all the other unneeded `tf2_msgs/TFMessage` messages, we wrote a ROS node (`tf_minimal.py`) to filter out messages from `/tf` and only publish `/map->/odom` and `/odom->base_link` messages on the `/tf_minimal` topic.

#### 3.1.2&nbsp;Grid Map

The grid map is a 2D map of the environment taken at the height of the Movo’s LiDAR sensor.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/grid_map.png">
    <figcaption>
        Rendering of the grid map in Unity
    </figcaption>
</figure>

We initially transferred `nav_msgs/OccupancyGrid` messages published by RTAB-Map and manually created a texture with the data stored in these messages. However, we encountered bandwidth issues when sending nav_msgs/OccupancyGrid messages across ROS-Sharp. This would cause the Unity scene to freeze for a moment every time a grid map is sent.

**Optimization**: We created a ROS node ([`slam/grid_image_node.cpp`](https://github.com/jwnicholas99/ros_remote_explorer/blob/master/slam/src/grid_image_node.cpp)) that first converts the grid map into an image, then compresses it using OpenCV into a JPEG image. As the grid map grows larger, the ratio of compression grows from ~x2 to ~x15. Therefore, compression of the grid map image scales well with the size of the grid map.

#### 3.1.3&nbsp;RGBD Image

A RGB-D image is produced by the Movo’s Kinect2 as a color (RGB) image and a depth (D) image, providing the current view from the Movo.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/rgbd_image.png">
    <figcaption>
        Rendering of the RGBD image in Unity
    </figcaption>
</figure>

We initially transferred `sensor_msgs/PointCloud2` messages that were generated by RTAB-Map as they are easier to render, but again faced bandwidth issues.

**Optimization**: We send compressed color and depth images, then manually integrate them to generate a point cloud on the Unity side ([`RGBDRenderer.cs`](https://github.com/jwnicholas99/vrRemoteExplorer/blob/master/Assets/Scripts/RGBD/RGBDRenderer.cs)). This overcomes the bandwidth issue as the images have been compressed.

<figure class="lazyload">
    <img class="responsive-image lazyload large" data-src="/images/projects/remoteExplorer/depth_and_color_images.png">
    <figcaption>
        Color (left) and depth (right) images
    </figcaption>
</figure>

To generate a point cloud from the color and depth images:

1. Decompress images using OpenCVSharp
2. Generate a Unity mesh instead of a GameObject for each pixel as this is less computationally expensive
3. Use a shader instead of setting the depth and color for each vertex of the mesh manually so as to leverage the GPU for faster rendering

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/rgbd_point_cloud.png">
    <figcaption>
        RGBD point cloud generated from color and depth images
    </figcaption>
</figure>

#### 3.1.4&nbsp;Global Map

The global map is a map of all the areas of the remote environment that RTAB-Map has mapped so far.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/global_map_point_cloud.png">
    <figcaption>
        Point cloud of the global map
    </figcaption>
</figure>

We initially transferred `sensor_msgs/PointCloud2` messages published by RTAB-Map as they are far easier to render, but encountered bandwidth issues again. This is because the `sensor_msgs/PointCloud2` messages contains the whole map instead of just newly added points, hence transferring a lot of redundant data. Furthermore, these messages do not contain any information about direction of each point, so we are unable to draw a quad for each point, resulting in a rather sparse rendering of the environment.

**Optimization**: We transferred `rtabmap_ros/mapData` messages published by RTAB-Map that is a representation of RTAB-Map’s internal graph. As each `rtabmap_ros/mapData` message contains only the latest graph node’s RGB-D image, no redundant data is sent. Additionally, each node has a position and orientation, allowing us to generate a point cloud for each node from its RGB-D image with quads. This results in a denser rendering of the environment:

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/remoteExplorer_demo.png">
    <figcaption>
        Denser rendering using rtabmap_ros/mapData
    </figcaption>
</figure>

### 3.2&nbsp;&nbsp;User View and Control

As we want the user to be able to freely explore the Unity scene without being restricted to the Movo’s physical location, we separated the user and the Movo as two distinct entities.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/movo_and_user.png">
    <figcaption>
        Movo and user as separate entities
    </figcaption>
</figure>

## 4&nbsp;&nbsp;&nbsp;Evaluation

### 4.1&nbsp;&nbsp;Successes

In regards to mapping, we successfully mapped the 8th floor of the SciLi using RTAB-Map as our SLAM algorithm. Mapping was done close to real-time in a Ubuntu 16.04 virtual machine with ROS Kinetic and playing a rosbag that recorded a session of driving the Movo around on the 8th floor of the SciLi.

In terms of rendering, we were able to transfer all 5 streams of data from ROS to Unity in close to real-time. We were able to achieve this by overcoming significant bandwidth constraints through optimizing the transmission of data from ROS (in the Ubuntu 16.04 VM) to Unity through ROS-Sharp.

We were also able to render these streams of data in the Unity scene to form a generally cohesive virtual environment for the user to explore. We believe that this is an improvement on current approaches for mapping and reconstructing a virtual environment:

<figure class="lazyload">
    <img class="responsive-image lazyload large" data-src="/images/projects/remoteExplorer/compare_map_reconstruction.png">
    <figcaption>
        Comparison of map reconstruction between our project (left) and Sekula (right)
    </figcaption>
</figure>

### 4.2&nbsp;&nbsp;Shortcomings

One shortcoming is that we have not been able to run the project on the actual Movo. For some yet-unknown reason, RTAB-Map is not receiving any messages published by the Movo, despite us being able to echo the messages on the command line. As such, we have only ran the project on a Ubuntu 16.04 VM and ROS Kinetic with a rosbag recording.

Another thing we can improve is the rendering of the global map. As seen below, some of the nodes are not positioned correctly, resulting in an inconsistent scene.

<figure class="lazyload">
    <img class="responsive-image lazyload" data-src="/images/projects/remoteExplorer/incohesive_scene.png">
    <figcaption>
        Inconsistencies in global map rendering
    </figcaption>
</figure>

## 5&nbsp;&nbsp;&nbsp;Future Work

There are a few paths for future work:

1. Improve transmission of data
   - Parallelize the transmission of data or find a better alternative to ROS-Sharp
   - Can transmit higher quality data or operate with even greater bandwidth constraints
2. Automation of exploration and pathfinding
   - If unable to overcome bandwidth constraints such that real-time mapping and control of the robot is impossible, can allow the robot to autonomously explore the environment
   - Use pathfinding so that robot can move to selected locations within the map autonomously
3. Integration with VR Teleoperation
   - Allow the robot to manipulate objects in the environment
   - Can even enhance exploration by opening up new areas (eg. opening doors or remove obstacles)
