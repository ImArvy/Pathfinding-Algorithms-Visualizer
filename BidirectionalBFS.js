// Bidirectional BFS Algorithm
export const BidirectionalBFS = (grid, startNode, endNode) => {
    // Initialzie the forward search queue
    const queueOne = [];
    const queueOneHistory = [];

    // Initialize the backward search queue
    const queueTwo = [];
    const queueTwoHistory = [];

    let currentOne;
    let currentTwo;
    let currentPath = 'none';

    // Mark the start node as visited and add it to the first queue
    startNode.forwardVisited = true;
    queueOne.push(startNode);
    queueOneHistory.push(startNode);

    // Mark the end node as visited and add it to the second queue
    endNode.backwardVisited = true;
    queueTwo.push(endNode);
    queueTwoHistory.push(endNode);

    // While there are nodes in the queue
    while(queueOne.length && queueTwo.length) {
        // Make the first current node the first node in the first queue and find its neighbors
        const currentOne = queueOne.shift(); 
        const neighborsOne = getBidirectionalBFSNeighbors(grid, currentOne);

        // Make the second current node the first node in the second queue and find its neighbors
        const currentTwo = queueTwo.shift();
        const neighborsTwo = getBidirectionalBFSNeighbors(grid, currentTwo);

        // If the first current node is the intersection of the two searches
        if (currentOne.forwardVisited && currentOne.backwardVisited) {
            currentPath = 'one';
            return {queueOneHistory, queueTwoHistory, currentOne, currentTwo, currentPath}; // Return the queues and current nodes
        }

        // If the second current node is the intersection of the two searches
        if (currentTwo.forwardVisited && currentTwo.backwardVisited) {
            currentPath = 'two';
            return {queueOneHistory, queueTwoHistory, currentOne, currentTwo, currentPath}; // Return the queues and current nodes
        }
        
        // For every neighbor
        for (const neighborOne of neighborsOne) {
            for (const neighborTwo of neighborsTwo) {
                // FORWARD SEARCH
                // If this first neighbor has not been marked as visited and is not a wall
                if (neighborOne.forwardVisited === false && neighborOne.isAWall === false) {
                    // If this first neighbor is not already in the first queue
                    if (queueOne.includes(neighborOne) === false) {
                        neighborOne.forwardNode = currentOne; // Make the first current node the parent of this first neigbor
                    }

                    // Mark this first neighbor as visited and add it to the queue
                    neighborOne.forwardVisited = true;
                    
                    // Add this first neighbor to the first queue
                    queueOne.push(neighborOne);
                    queueOneHistory.push(neighborOne);
                }
                
                //BACKWARD SEARCH
                // If this second neighbor has not been marked as visited and is not a wall
                if (neighborTwo.backwardVisited === false && neighborTwo.isAWall === false) {
                    // If this second neighbor is not already in the second queue
                    if (queueTwo.includes(neighborTwo) === false) {
                        neighborTwo.backwardNode = currentTwo; // Make the second current node the parent of this second neigbor
                    }

                    // Mark this second neighbor as visited and add it to the queue
                    neighborTwo.backwardVisited = true;
                    
                    // Add this second neighbor to the second queue
                    queueTwo.push(neighborTwo);
                    queueTwoHistory.push(neighborTwo);
                }
            }
        }
    }
    return {queueOneHistory, queueTwoHistory, currentOne, currentTwo, currentPath}; // Return the queues and current nodes if there is no solution
};

// Helper function to return the shortest forward path found from Bidirectional BFS
export const getForwardBidrectionalBFSPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.forwardNode;
    }
    return nodesInShortestPathOrder;
};

// Helper function to return the shortest backward path found from Bidirectional BFS
export const getBackwardBidirectionalBFSPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.backwardNode;
    }
    return nodesInShortestPathOrder;
};

const getBidirectionalBFSNeighbors = (grid, node) => {
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

    return neighbors;
};