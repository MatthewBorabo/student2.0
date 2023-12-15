---
layout: base
title: Music Testing
description: Trying to implement music into the game.
type: devops
courses: { csse: {week: 15} }
---
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .hidden-audio {
            position: absolute;
            left: -9999px;
            visibility: hidden;
        }
    </style>
</head>
<body>

<audio class="hidden-audio" autoplay controls>
    <source src="your-audio-file.mp3" type="audio/mp3">
    Your browser does not support the audio tag.
</audio>

</body>
</html>
```