# Pathfinding-Algorithms-Visualizer

IF YOU USE MY CODE FOR YOUR PROJECT, IT IS NOT REQUIRED BY LICENSE BUT I WOULD APPRECIATE CREDIT :)

This is my Pathfinding Algorithms Visualizer, I have created this while teaching myself React and plan on working this into an interactive, education website in the future. In the case that I do this, I will implement other algorithms such as sorting algorithms. Until then here is a link to my website that runs the current build of this project.

Some useful information about the project:

1) Clicking anywhere on the grid will allow the user to place walls at the location of their mouse. Holding the mouse and dragging it will allow you to place continuous walls, these walls can be vertical, horizontal, diagonal, or a combination of those.

2) The green node in the top left corner is the START node, the red node in the bottom right corner is the END node. These can be moved in the same way as walls are created: click on the node and hold the mouse button down while dragging it. 

**NOTE: these previous features still need some polishing, for example the pathfinding algorithms do not yet adapt to these changes in real time while they are running. This means the user can place walls and change the position of start and end nodes while an algorithm is running but this logical change is not computed by the algorithm.**

3) The user can generate walls in two other ways: 1) "Generate Maze" - Recursive Division Maze Algorithm recursively divide the grid into smaller and smaller squares down to a specified "resolution" and, upon making each wall, randomly remove one wall node to allow a path through it. 2) "Add Walls" - Randomly add walls anywhere on the grid, about twenty percent of the nodes should become walls per use of the button. 

4) The user can reset the grid by clicking "Reset Grid". This will clear the grid of walls and visited nodes aswell as returning the START and END nodes to their initial positions. Again, this is not yet functioning while in algorithm is in the process of running.

5) That is about it! Just click one of the pathfinding algorithm buttons above the grid and watch the animated search for the end node. Upon completion of the search a yellow line of nodes will be drawn to signify the path found, in some cases this will be the first path to the end node and in others the shortest path. This is of course entirely dependent on the optimality of each algorithm. There does exist the possibility of not finding the end node, for example Greedy BFS may never find the end node as it is not complete as a pathfinding algorithm. Another case would be adding walls using "Add Walls", since it is random there exists the possibility that the walls trap the search from the start node or blokc the end node from being reached. My implemenation of these algorithms accounts for these cases and will terminate if there is no route to the end node.

https://pathfinding-visualizers.herokuapp.com/
