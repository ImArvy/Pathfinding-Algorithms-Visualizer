// Weighted A* Search Algorithm : f(n) = g(n) + weight * h(n)
export const WeightedAStar = (grid, startNode, endNode) => {
    // Initialize the open set and closedSet
    const openSet = [];
    const closedSet = [];
    const openSetHistory = [];
    const weight = 2.0;

    // Push the starting node to the open set and leave its f at zero
    openSet.push(startNode); 
    openSetHistory.push(startNode);

    // While the open list is not empty
    while (openSet.length) {
        // Find the node with lowest f in the open set
        let lowestFValue = 0;
        for (let i = 0; i < openSet.length; i++) { // For every node in the open set
            if (openSet[i].fValue < openSet[lowestFValue].fValue) { // If the f value at openSet[i] is lower than the fValue at openSet[lowestFValue]
                lowestFValue = i; // Make i the index of the lowest fValue in openSet
            }
        }
        let currentNode = openSet[lowestFValue]; // Make current the node with the lowest fValue from openSet

        // Take current node out of the open set and push it to the closed set
        const currentIndex = openSet.indexOf(currentNode);
        openSet.splice(currentIndex, 1);
        closedSet.push(currentNode);
        
        // Get neighbors of the current node
        const neighbors = getNeighbors(grid, currentNode);

        // If the current node is the end node
        if (currentNode === endNode) {
            return {closedSet, openSetHistory}; // Return the closed and open sets
        }

        // For each neighbor
        for (const neighbor of neighbors) {
            // If the neighbor is not in the closed set
            if (closedSet.includes(neighbor) === false) { 
                // If this neighbor is the end node
                if (neighbor === endNode) {
                    // Make the current node the parent node of this neighbor and push this neighbor to the open set and closed set
                    neighbor.previousNode = currentNode; 
                    openSet.push(neighbor);
                    openSetHistory.push(neighbor);
                    closedSet.push(neighbor);
                    
                    // Return the closed and open sets
                    return {closedSet, openSetHistory}; 
                }
                
                // If this neighbor is a wall
                if (neighbor.isAWall === true) { 
                    continue; // Skip this wall
                }

                let tempGValue = currentNode.gValue + heuristicFunction(neighbor, currentNode); // Set the temporary gValue

                // Find out if we have a better path than before
                let newPathFound = false;
                if (openSet.includes(neighbor) === true) { // If the neighbor is in the open set
                    if (tempGValue < neighbor.gValue) { // If the temporary gValue is less than the neighbor's gValue
                        neighbor.gValue = tempGValue; // Assign the temporary gValue to the neighbor's gValue
                        newPathFound = true; // We have found a new path
                    }
                } else { // Otherwise
                    neighbor.gValue = tempGValue; // Assign the temporary gValue to the neighbor's gValue
                    newPathFound = true; // We have found a new path
                    openSet.push(neighbor); // Push this neighbor to the open set
                    openSetHistory.push(neighbor);
                }

                // If we do have a better path
                if (newPathFound === true) {
                    neighbor.hValue = heuristicFunction(neighbor, endNode); // Compute the neighbor's hValue
                    neighbor.previousNode = currentNode; // Make the current node the parent node of this neighbor

                    /*
                    Weight of 0 means Dijkstra's Algorithm 
                    Weight of infinity means Greedy Best First Search
                    Weight of 1.0 means A*
                    Weighted A* is between A* and Greedy Best First Search => between 1.0 and infinity
                    */
                    //neighbor.fValue = neighbor.gValue + weight * neighbor.hValue;

                    /*
                    // Dynamic Weighted A* (pxWU): This is decreases the weight as you near the end node (Less optimal)
                    if (neighbor.gValue < (2 * weight - 1) * neighbor.hValue) { // If g(p) < (2 * w - 1) * h(p)
                        neighbor.fValue = neighbor.gValue / (2 * weight - 1) + neighbor.hValue; // f(p) = g(p) / (2 * w - 1) + h(p)
                    } else { // Otherwise
                        neighbor.fValue = (neighbor.gValue + neighbor.hValue) / weight; // f(p) = (g(p) + h(p)) / w
                    }
                    */
                    
                    // Dynamic Weighted A* (pxWD): This is increases the weight as you near the end node (More optimal)
                    if (neighbor.gValue < neighbor.hValue) { // If g(p) < h(p)
                        neighbor.fValue = neighbor.gValue + neighbor.hValue; // f(p) = g(p) + h(p)
                    } else { // Otherwise
                        neighbor.fValue = (neighbor.gValue + (2 * weight - 1) * neighbor.hValue) / weight; // f(p) = (g(p) + (2 * w - 1) * h(p)) / w
                    }
                }
            }
        }
    }
    return {closedSet, openSetHistory}; // If there is no solution, return the closed and open sets
};

// Helper function to return the shortest path found from AStar
export const getShortestWeightedAStarPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};

// Helper function to generate neighbors of the current node
const getNeighbors = (grid, node) => {
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