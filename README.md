# Movieholics

Movieholics is a command-line application built with C++ that recommends different movies depending on a set of parameters. 
The program takes data from the imdb movie database ```https://datasets.imdbws.com/``` and uses the uses parameters on movie genre,
rating popularity, and length to give each movie a weight. Once weighted, the movies are sorted by score with both quick sort and merge sort and
then displayed. The time for each sorting algorithim is also dispalyed.

## Table of Contents

- [Prerequisites](#Prerequisites)

- [Installation](#Installation)


## Prerequisites

(NOTE: All prerequisite instructions are for windows only)

- MinGW or some other form of C++ devlopment envrionment
    * Download here: https://sourceforge.net/projects/mingw/
    * add MinGW path to PATH variable

- Make (MinGW's make is recommended)
    - To install mingw make run ```mingw-get install mingw32-make```
## Installation

- Open a command line and enter the root directory of the repo

- Run ```make``` or ```mingw32-make``` depending on your make installation

- Run the Movieholics.exe using ```./Movieholics.exe```
