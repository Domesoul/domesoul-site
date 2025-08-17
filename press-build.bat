@echo off
setlocal
mkdir images\press 2>nul

call :make brand      press-brand-poster
call :make instrument press-instrument
call :make mission    press-mission

echo.
echo Done! Files are in images\press
pause
exit /b

:make
set IN=%1.png
set OUT=%2
magick "%IN%" -resize 1600x -strip -colorspace sRGB -quality 82 "images\press\%OUT%-1600.jpg"
magick "%IN%" -resize 800x  -strip -colorspace sRGB -quality 82 "images\press\%OUT%-800.jpg"
magick "images\press\%OUT%-1600.jpg" -quality 82 "images\press\%OUT%-1600.webp"
magick "images\press\%OUT%-800.jpg"  -quality 82 "images\press\%OUT%-800.webp"
exit /b
