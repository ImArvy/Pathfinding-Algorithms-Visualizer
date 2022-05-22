// Iterative BFS Algorithm
export const IterativeBFS = (grid, startNode, endNode) => {
    // Initialzie the queue
    const queue = [];
    const queueHistory = [];

    // Mark the the start node as visited and it to the queue 
    startNode.hasBeenVisited = true;
    queue.push(startNode);
    queueHistory.push(startNode);

    // While there are nodes in the queue
    while(queue.length) {
        // Make the current node the first node in the queue and find its neighbors
        const currentNode = queue.shift(); 

        // If the current node is the end node
        if (currentNode === endNode) {
            return queueHistory; // Return the queue
        }

        const neighbors = getBFSNeighbors(grid, currentNode);
        
        // For every neighbor
        for (const neighbor of neighbors) {
            // If the current node has not been marked as visited
            if (neighbor.hasBeenVisited === false) { 
                // If this neighbor is a wall
                if (neighbor.isAWall) { 
                    continue; // Skip this wall
                }
                
                // If this neighbor is not already in the queue
                if (queue.includes(neighbor) === false) {
                    neighbor.previousNode = currentNode; // Make the current node the parent of this neigbor
                }
                
                // Mark the current node as visited and add it to the queue
                neighbor.hasBeenVisited = true;
                
                // Push this neighbor to the queue
                queue.push(neighbor);
                queueHistory.push(neighbor);

                // If the current node is the end node
                if (neighbor === endNode) {
                    return queueHistory; // Return the queue history
                } 
            }
        }
    }
    return queueHistory; // If there is no solution, return the queue
};

// Helper function to return the shortest path found from BFS
export const getShortestBFSPath = (endNode) => {
    const shortestBFSPath = [];
    let currentNode = endNode;
    while (currentNode) {
        shortestBFSPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return shortestBFSPath;
};

const getBFSNeighbors = (grid, node) => {
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
        neighbors.filter(neighbor => !neighbor.hasBeenVisited) // Return each neighbor in neighbors that has not been visited
    );
};