---
layout: post
title: Building a Custom React Image Hotspot from scratch
date: 2024-01-20 13:32:20 +0300
description: Custom-React-Image-Hotspot
img: https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal//hotspots.jpg
---

<h3>Introduction</h3>
Hello viewers and readers,

Welcome to my blog where I showcase my ideas on How to build a custom Image Hotspot from scratch using React. Though there are many libraries available for adding Hotspots over the image, some libraries did not give me the flexibility I needed. So, I decided to build a custom one based on my requirements.

Before going into detail and the steps, let's learn what image hotspots are.

<h3>Image-Hotspots</h3>
The Image Hotspots Element allows you to add hotspots to an image, allowing you to highlight a certain area, or areas, of the image with a label that can either open a popover box or just be a link. It’s a very useful element when you want to quickly describe parts of an image.

<h3>What was the Actual Requirement?</h3>

- Build an Image-Hotspot feature
- Add and Remove comments functionality for each hotspot
- Multiple Hotspots for a single image
- Store the comments for a hotspot in a database
- Seamlessly scale the position of the hotspot based on the screen and image dimensions.

> Also, we will be not focusing on storing the data in any of the databases. My blog will focus only on adding hotspots to the image, adding comments to the hotspots with the data flow process and scaling the hotspot's position based on the screen dimensions.

Let's do this!!!

<h3>Getting Started</h3>
We will be using create-react-app to set up the base project for this tutorial. Run the following command in the terminal:
    
    yarn create-react-app react-image-hotspots

After the setup,
Go to the project folder and add tailwind to the project by running the following command in the terminal.

    yarn add -D tailwindcss postcss autoprefixer

Once the tailwind is installed, generate the tailwind.config.js by running the following command.

    yarn tailwindcss init -p

Once this is done, configure the tailwind.config.js file by adding the following code

     /** @type {import('tailwindcss').Config} */
    module.exports = {
        content: [
            "./src/**/*.{js,jsx,ts,tsx}",
        ],
        theme: {
            extend: {},
        },
        plugins: [],
    }

Once this is finished, modify the postcss.config.js with the following code

    module.exports = {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    }

Also, add the below code to the index.css or App.css of your Project

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

Once you have finished all these steps, tailwind CSS has been successfully added to the React project.
Now the project has been set up, let's get started!!!

> Note that each one will have a different perspective or process for adding hotspots to the images.

As for the flow process is concerned, I have followed a method. You can also customize the method based on your requirements.

<h3>Uploading Images</h3>
Build a front-end for uploading images to the websites.

Write the following code in the App.js file
    <div className="w-full h-screen bg-neutral-700 flex justify-center text-center items-center">
        <button className="flex px-4 py-2 items-center justify-center rounded-md text-2xl text-black bg-tealblue">
            Upload Images
        </button>
    </div>

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot1.webp)

Create a new file called Hotspots.js. All the hotspots regarding functions are written in this file.

First, write the following function for uploading images. For uploading the images the logic is simple as I have used the FileReader to read the files and store it in an array.

    import React, {useState} from 'react';

    const HotspotImage = () => {
        const [imageList, setImageList] = useState([]);
        const handleImageUpload = (e) => {
            const files = e.target.files;
            const newImageList = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onloadend = () => {
                newImageList.push(reader.result);
                if (i === files.length - 1) {
                    setImageList(newImageList);
                }
            }
            reader.readAsDataURL(file)
        }
        return (
        <div>
            <input
            className="text-white"
            type="file"
            multiple
            accept="*"
            onChange={handleImageUpload}
            />
        </div>
        )
    }

Once this is done, build the UI for displaying the images.

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot2.webp)

> Note that I am not focusing on the UI part of the project in this blog. For more reference, you can refer to the source code link which I will be sharing below the blog.

The next would be to add hotspots to the image.

While adding a hotspot, the following data needed to be stored in the database or variable. The x and y coordinates of the hotspot need to be stored so that they can be retrieved somewhere else. The comment input added to each hotspot needs to be stored in that particular hotspot. Additionally, the file name of the image is also stored in the list of data.

So, the final output of the data stored looks somewhat like the below-mentioned structure.

    [
        0:[    //image1 index
            0:{hotspot:{...}, comment:""}     //image1 hotspot1 index
            1:{hotspot:{...}, comment:""}     //image1 hotspot2 index
            filename:""
        ],
        1:[
            0:{hotspot:{...}, comment:""}
            1:{hotspot:{...}, comment:""}
            filename:""
        ],
        3:[
            0:{hotspot:{...}, comment:""}
            1:{hotspot:{...}, comment:""}
            filename:""
        ],
    ]

Inside each hotspot field, the x and the y coordinates of that hotspot are stored.

    0:{
        hotspot:{
                    x: 35,    // x coordinate value
                    y: 96     // y coordinate value
                }
        comment:""
    }

Each hotspot requires a hotspot placing function, hotspot addition function, hotspot removal function and edit comment function.

Let's go step by step.

<h3>Placing Hotspots</h3>
Once the images are uploaded, the hotspots are placed just by clicking on the image. Once a hotspot is placed the x & y coordinates are calculated. Add the following function to the Hotspots.js file.

    const handleImageClick = (event) => {
        const rect = event.target.getBoundingClient();
        const xCoord = ((event.clientX - rect.left) / rect.width) * 100;
        const yCoord = ((event.clientY - rect.top) / rect.height) * 100;
    }

Once the hotspot is placed, as per my UI a textbox with Add and Remove buttons is rendered.

I have used the TextareaAutoSize component library to give a textarea that automatically adjusts the height to match the length of the content within.

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot3.webp)

<h3>Adding Comments</h3>
Since multiple images are uploaded and also each image has an index value. Each image can have multiple hotspots placed. Each hotspot has an index value and a comment text box. So the comment added to this hotspot should not be stored for other hotspots.

So by sending the imageIndex and the hotspotIndex in the add function, the hotspot coordinates and the comment values do not overlap with other hotspot data.

Update the following code in the Hotspots.js file

    const [hotspotData, setHotspotData] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [comments, setComments] = useState([]);

    const handleImageUpload = (e) => {
        const files = e.target.files;
        const newImageList = [];
        const newHotSpotData = [];
        const newInputValues = [];
        const newComments = [];
        for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
            newImageList.push(reader.result);
            newHotSpotData.push([]);
            newInputValues.push([]);
            newComments.push([]);
            if (i === files.length - 1) {
            setSelectedImage(newImageList[0]);
            setImageList(newImageList);
            setHotspotData(newHotSpotData);
            setInputValues(newInputValues);
            setComments(newComments);
            }
        }
            reader.readAsDataURL(file);
        }
    }

    // To handle the textarea for the hotspot
    const handleTextareaChange = (event, imageIndex, hotspotIndex) => {
        // Update the textarea value for this hotspot
        const newInputValues = [...inputValues];
        newInputValues[imageIndex][hotspotIndex] = event.target.value;
        setInputValues(newInputValues);
    };

To select different Image

    const handleImageSelect = (index) => {
        if (imageList[index]) {
        setSelectedImage(imageList[index]);
        setFileName(comments[index].filename);
        }
    };

To handle the text area of the hotspots

    const handleTextareaChange = (event, imageIndex, hotspotIndex) => {
        // Update the textarea value for this hotspot
        const newInputValues = [...inputValues];
        newInputValues[imageIndex][hotspotIndex] = event.target.value;
        setInputValues(newInputValues);
    };

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot4.webp)

After entering the comment to a hotspot the Add button is clicked so that the entered comment and the coordinates of the hotspot are stored in that hotspot. Once the Add button is clicked, the Add button changes to the Edit button. Here's the function for Adding the comment

    const handleAddComment = (imageIndex, hotspotIndex) => {
        const updatedComments = [...comments];
        if (!updatedComments[imageIndex]) {
        updatedComments[imageIndex] = [];
        }

        const hotspotComment = {
        hotspot: hotspotData[imageIndex][hotspotIndex],
        comment: inputValues[imageIndex][hotspotIndex] || "",
        };

        const existingCommentIndex = updatedComments[imageIndex].findIndex(
        (comment) => comment.hotspot === hotspotComment.hotspot
        );
        if(existingCommentIndex !== -1){
        updatedComments[imageIndex][existingCommentIndex] = hotspotComment;
        } else {
        updatedComments[imageIndex].push(hotspotComment);
        }

        setComments(updatedComments);
        // setInputValues([""]);
    };

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot5.webp)

Unless the Add button is clicked, the hotspot data does not get stored. Now with the AddComment function added, we have to add the remove hotspot function that removes the hotspot from that particular image and also the data stored in that hotspot.

Here's the function,
    const handleRemoveHotspot = (imageIndex, hotspotIndex) => {
        const updatedHotspots = [...hotspotData];
        updatedHotspots[imageIndex].splice(hotspotIndex, 1);
        setHotspotData(updatedHotspots);

        const updatedComments = [...comments];
        if (updatedComments[imageIndex]) {
        updatedComments[imageIndex].splice(hotspotIndex, 1);

        const updatedInputValues = [...inputValues];
        if (updatedInputValues[imageIndex]) {
            updatedInputValues[imageIndex].splice(hotspotIndex, 1);
        }

        const newHotspotData = [...hotspotData];
        newHotspotData[imageIndex] = updatedHotspots;

        const newComments = [...comments];
        newComments[imageIndex] = updatedComments;

        const newInputValues = [...inputValues];
        newInputValues[imageIndex] = updatedInputValues;

        setComments(updatedComments);
        setInputValues(updatedInputValues);
        }
    };

Now that we have written the add and remove functions, we have to write the edit function for the editing of the comment added to the data. Once the Add button is clicked the text input field becomes uneditable. To edit the field the Edit button is clicked. To perform that function, we have to add two more state variables to the existing code. Also, set the state variable for setting the Active Image for the selected Image.

    //     ...existing code    //
    const [commentStates, setCommentStates] = useState([]);
    const [editStates, setEditStates] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

    const handleImageUpload = (e) => {
        ...existing code
        const newCommentStates = [];
        const newEditStates = [];
        for (let i = 0; i < files.length; i++) {
            ...existing code
            reader.onloadend = () => {
            ...existing code
                newCommentStates.push(Array(newHotSpotData.length).fill(false));
                newEditStates.push([]);
                if (i === files.length - 1) {
                setActiveImage(0);
                setCommentStates(newCommentStates);
                setEditStates(newEditStates);
                }
        }
        reader.readAsDataURL(file);
        }
    }

Now add the handleEditComment function, where I have set a boolean state which sets the edit state of the textarea input field edit state for that hotspot.

    const handleEditComment = (imageIndex, hotspotIndex) => {
        const newEditStates = [...editStates];
        newEditStates[imageIndex][hotspotIndex] = true; // Set edit state to true
        setEditStates(newEditStates);
    };

Also, update the handleAddComment, and handleRemoveHotspot functions

    const handleAddComment = (imageIndex, hotspotIndex) => {
        //    ...existing code    //

        setComments(updatedComments);
        const newCommentStates = [...commentStates];
        newCommentStates[imageIndex][hotspotIndex] = true;
        setCommentStates(newCommentStates);

        const newEditStates = [...editStates];
        newEditStates[imageIndex][hotspotIndex] = false; // Set edit state to false
        setEditStates(newEditStates);
        // setInputValues([""]);
    };

    const handleRemoveHotspot = (imageIndex, hotspotIndex) => {
        //    ...existing code    //

        const newCommentStates = [...commentStates];
        newCommentStates[imageIndex].splice(hotspotIndex, 1);

        const newEditStates = [...editStates];
        newEditStates[imageIndex].splice(hotspotIndex, 1);

        setCommentStates(newCommentStates);
        setEditStates(newEditStates);
        }
    }

Now that we have set up everything, we can upload the images start placing hotspots and add comments to the hotspots. The final output will be something like the output displayed in the below image.

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Hotspot6.webp)

<h3>Scaling and Positioning</h3>
Now, there will be one question in everyone's mind. We have added the hotspots on the image concerning a specified image dimension. What happens when the screen resolution changes or the width and height of the images change?

So, to fix the issue I wrote a scalability function that scales the dimensions of the image based on the screen dimensions.

How did I achieve that?

Here's the code

    const calcuateScale = () => {
        if (imageRef.current && containerRef.current) {
        const imageWidth = imageRef.current.width;
        const imageHeight = imageRef.current.height;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;

        setScaleX(scaleX);
        setScaleY(scaleY);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", calcuateScale);
        return () => {
        window.removeEventListener("resize", calcuateScale);
        };
    }, []);

I added two reference hooks that refer to the same element. The reason I set the reference hook to the same element is that the width and height of the image refer to the width and height of the reference container. So, whenever the width and height of the reference container change, the image width and height are scaled based on the container size which happens automatically by calling the function inside a useEffect hook.

By performing all these functions, the image hotspots are added and their position is scaled based on the changes in the screen dimension.

> Note that I am displaying how the data can be stored in a database by displaying the values by logging the data in the console.

Once the entire process is done and the hotspot data are stored in the database, they can be retrieved later and can be rendered in the front end later.

You can get the entire code by clicking <a style='Color:blue' href="https://github.com/JoelRevington1305/React-Image-Hotspots" >React Image Hotspots</a>.


[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
