// Greedy BFS Search Algorithm : f(n) = h(n)
export const GreedyBFS = (grid, startNode, endNode) => {
    // Initialize the open set and closedSet
    const openSet = [];
    const closedSet = [];
    const openSetHistory = [];

    // Push the starting node to the open set and leave its f at zero
    openSet.push(startNode); 
    openSetHistory.push(startNode);

    // While the open list is not empty
    while (openSet.length) {
        // Find the node with lowest f in the open set
        let lowestFValueIndex = 0;
        for (let i = 0; i < openSet.length; i++) { // For every node in the open set
            if (openSet[i].fValue < openSet[lowestFValueIndex].fValue) { // If the f value at openSet[i] is lower than the fValue at openSet[lowestFValue]
                lowestFValueIndex = i; // Make i the index of the lowest fValue in openSet
            }
        }
        const currentNode = openSet[lowestFValueIndex]; // Make current the node with the lowest fValue from openSet

        // Take current node out of the open set and push it to the closed set
        const currentIndex = openSet.indexOf(currentNode);
        openSet.splice(currentIndex, 1);
        closedSet.push(currentNode);

        // If the current node is the end node
        if (currentNode === endNode) {
            return {closedSet, openSetHistory}; // Return the closed and open sets
        }

        // Get neighbors of the current node
        const neighbors = getGreedyBFSNeighbors(grid, currentNode);

        // For each neighbor
        for (const neighbor of neighbors) {
            // If this neighbor is not in the closed set
            if (closedSet.includes(neighbor) === false) { 
                // If this neighbor is the end node
                if (neighbor === endNode) {
                    // Make the current node the parent node of this neighbor
                    neighbor.previousNode = currentNode; 
                    
                    // Push this neighbor to the open set
                    openSet.push(neighbor);
                    openSetHistory.push(neighbor);

                    // Push this neighbor to the closed set
                    closedSet.push(neighbor);

                    // Return the closed and open sets
                    return {closedSet, openSetHistory}; 
                }

                // If this neighbor is a wall
                if (neighbor.isAWall) { 
                    continue; // Skip this wall
                }

                // Set the temporary hValue to be the heuristic distance to the end node and initialize newPathFound to false
                const tempHValue = heuristicFunction(neighbor, endNode); 
               
                // Find out if we have a better path than before
                let newPathFound = false;
                // If this neighbor is in the open set
                if (openSet.includes(neighbor) === true) { 
                    // If the temporary hValue is less than this neighbor's hValue
                    if (tempHValue < neighbor.hValue) { 
                        // Assign the temporary hValue to this neighbor's hValue and set newPathFound to true
                        neighbor.hValue = tempHValue; 
                        newPathFound = true; 
                    }
                // If this neighbor is not in the open set
                } else { 
                    // Assign the temporary hValue to this neighbor's hValue and set newPathFound to true
                    neighbor.hValue = tempHValue; 
                    newPathFound = true; 
                    
                    // Push this neighbor to the open set
                    openSet.push(neighbor); 
                    openSetHistory.push(neighbor);
                }

                // If we do have a better path
                if (newPathFound) {
                    // Assign this neighbor's hValue to this neighbor's fValue and make the current node the parent node of this neighbor
                    neighbor.fValue = neighbor.hValue; 
                    neighbor.previousNode = currentNode; 
                }
            }
        }
    }
    return {closedSet, openSetHistory}; // If there is no solution, return the closed and open sets
};

// Helper function to return the shortest path found from Greedy BFS
export const getShortestGreedyBFSPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};

// Helper function to generate neighbors of the current node
const getGreedyBFSNeighbors = (grid, node) => {
    const neighbors = [];
    const {column, row} = node;
    // Top, bottom, left, right
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

    return neighbors; // Return each neighbor in neighbors
};

// Helper function that uses approximation heuristics to calculate distance
const heuristicFunction = (a, b) => {
    // Manhattan distance (AKA Taxi Cab Distance)
    //const manhattanDistance = Math.abs(b.column - a.column) + Math.abs(b.row - a.row); 
    //return manhattanDistance;
    
    // Euclidean distance
    const euclideanDistance = getEuclideanDistance(a, b);
    return euclideanDistance;

    // Hamming distance
    //const hammingDistance = getHammingDistance(a, b);
    //return hammingDistance;
};

const getEuclideanDistance = (a, b) => {
    const dx = Math.abs(b.column - a.column); // dx = x2 - x1
    const dy = Math.abs(b.row - a.row); // dy = y2 - y1
    
    const dxSqaured = dx * dx;
    const dySquared = dy * dy;
    const addedTogether = dxSqaured + dySquared;

    const distance = Math.sqrt(addedTogether); // Distance between two points = sqrt(dx^2 + dy^2)
    return distance;
};

const getHammingDistance = (a, b) => {
    let distanceOne = 0;
    let distanceTwo = 0;

    // a ^ b calculates the XOR, the difference in bit representation of two integers
    let hammingDistanceOne = a.column ^ b.column; 
    let hammingDistanceTwo = a.row ^ b.row;

    // h & (h - 1) removes the LSB(Least Significant Bit), for example : 11100 & 11011 = 11000
    while (hammingDistanceOne > 0) {
        distanceOne += 1;
        hammingDistanceOne &= (hammingDistanceOne - 1); 
    }

    while (hammingDistanceTwo > 0) {
        distanceTwo += 1;
        hammingDistanceTwo &= (hammingDistanceTwo - 1);
    }

    const distance = distanceOne * distanceTwo;
    return distance;
};