---
layout: post
title: Mario OOP Overview
description: What is GameEnvironment, GameLevel, GameObject, and GameControl? 
courses: { csse: {week: 13} }
type: collab
---

# GameEnvironment:
- GameEnvironment is the parent of GameLevel, GameObject, and GameControl (which are described below). It "manages the overall game state variables", which means that it covers the attributes (levels, GameObjects) and methods (update, destroy).

# GameObject:
- GameObject is an attribute of the GameEnvironment. "GameObjects provides a common base for defining game entities." Simply, this defines the 'objects' of the game, which is the player, background, platform, and many more.

# GameLevel:
- GameLevel is an attribute of the GameEnvironment. "GameLevel holds level-specific assets and creates GameObjects." GameLevel is closely related to GameObject as it holds attributes such as the playerAssets, backgroundAssets, and platformAssets. Additionally, one method that can be used with GameLevel is to load the levels and objects.

# GameControl:
- GameControl is the last of the child branches of the GameEnvironment hierarchy. "GameControl handles the transition between different Game Levels." One way to control this is to use a gameLoop: drive the action of the game level. Secondly, it can be controlled using a transitionToLevel by destroying and creating objects for a game level.