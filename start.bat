@echo off
title Starting Minecraft Bot + Electron
@echo Installing dependencies...
start cmd /k "npm install mineflayer electron socket.io socket.io-client mineflayer-pathfinder"
echo Starting the Minecraft bot...
start cmd /k "node bot.js"
echo Launching the Electron app...
start cmd /k "npx electron ."
echo Everything started successfully!
exit
