/* 
Recursive implementation of the DFS Algorithm
Pushing to the stack prior to recursive call generates a more typical DFS pattern
Pushing to the stack after recursive call generates a maze pattern
*/
export const RecursiveDFS = (grid, startNode, endNode) => {
    // Initialize the stack
    const stack = [];
    const stackHistory = [];
 
    // Push the start node to the stack
    stack.push(startNode);
    stackHistory.push(startNode);

    doRecursion(grid, endNode, stack, stackHistory);
    
    return {stack, stackHistory};
};

// Helper function 
const doRecursion = (grid, endNode, stack, stackHistory) => {
    while (stack.length) {
        // Pop the current node off the stack and mark it as visited
        const currentNode = stack.pop();
        currentNode.hasBeenVisited = true;
    
        // If the current node is the end node
        if (currentNode === endNode) {
            return {stack, stackHistory}; // Return the stack
        }

        // Find the neighbors of the current node
        const neighbors = getDFSNeighbors(grid, currentNode);

        // For every neighbor 
        for (const neighbor of neighbors) {
            // If this neighbor has not been marked as visited
            if (neighbor.hasBeenVisited === false) { 
                // If this neighbor is the end node
                if (neighbor === endNode) {
                    // Push this neighbor to the stack and make the current node the parent of this neighbor
                    stack.push(neighbor); 
                    stackHistory.push(neighbor);
                    neighbor.previousNode = currentNode;

                    // Return the stack
                    return {stack, stackHistory}; 
                }

                // If this neighbor is a wall
                if (neighbor.isAWall) { 
                    continue; // Skip this wall
                }

                // If this neighbor is not already in the stack
                if (stack.includes(neighbor) === false) { 
                    // Push this neighbor to the stack
                    stack.push(neighbor); 
                    stackHistory.push(neighbor);
                }

                // Recursively perform the same steps on the subtree of this neighbor
                doRecursion(grid, endNode, stack, stackHistory); 
            }
            // Make the current node the parent of this neigbor
            neighbor.previousNode = currentNode; 
        }
    }
    return {stack, stackHistory}; // If there is no solution, return the stack
};

// Helper function to return the shortest path found from DFS
export const getShortestRecursiveDFSPath = (endNode) => {
    const shortestRecursiveDFSPath = [];
    let currentNode = endNode;
    while (currentNode) {
        shortestRecursiveDFSPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestRecursiveDFSPath;
};

const getDFSNeighbors = (grid, node) => {
    const neighbors = [];
    const {column, row} = node;
    if (row > 0) { // If we are not at the first row
        neighbors.push(grid[row - 1][column]); // Push top neighbor to neighbors
    }
    if (row < grid.length - 1) { // If we are not at the last row
        neighbors.push(grid[row + 1][column]); // Push bottom neighbor to neighbors
    }
    if (column > 0) { // If we are not at the first column
        neighbors.push(grid[row][column - 1]); // Push left neighbor to neighbors
    }
    if (column < grid[0].length - 1) { // If we are not at the last column
        neighbors.push(grid[row][column + 1]); // Push right neighbor to neighbors
    }

    // Top left, top right, bottom left, bottom right
    if (row > 0 && column > 0) { // If we are not at the first row and first column
        neighbors.push(grid[row - 1][column - 1]); // Push top left neighbor to neighbors
    }
    if (row > 0 && column < grid[0].length - 1) { // If we are not at the first row and last column
        neighbors.push(grid[row - 1][column + 1]); // Push top right neighbor to neighbors
    }
    if (row < grid.length - 1 && column > 0) { // If we are not at the last row and first column
        neighbors.push(grid[row + 1][column - 1]); // Push bottom left neighbor to neighbors
    }
    if (row < grid.length - 1 && column < grid[0].length - 1) { // If we are not at the last row and last column
        neighbors.push(grid[row + 1][column + 1]); // Push bottom right neighbor to neighbors
    }

    return (
        neighbors.filter(neighbor => neighbor.hasBeenVisited === false) // Return each neighbor in neighbors that has not been visited
    );
};