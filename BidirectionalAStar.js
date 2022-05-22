// This is the front-to-front variation of the Bidirectional A* Algorithm
export const BidirectionalAStar = (grid, startNode, endNode) => {
    // Initialize the open set and closedSet
    const openSetStart = [];
    const openSetEnd = [];
    
    const closedSetStart = [];
    const closedSetEnd = [];
    
    const openSetStartHistory = [];
    const openSetEndHistory = [];

    let currentOne = null;
    let currentTwo = null;

    // Push the starting node to the first open set and leave its f at zero
    openSetStart.push(startNode); 
    openSetStartHistory.push(startNode);

    // Push the end node to the second open set and leave its f at zero
    openSetEnd.push(endNode); 
    openSetEndHistory.push(endNode);

    // While the second open set is not empty
    while (openSetStart.length && openSetEnd.length) {
        // Find the node with lowest f in the first open set
        let firstLowestFValue = 0;
        for (let i = 0; i < openSetStart.length; i++) { // For every node in the first open set
            if (openSetStart[i].fValue < openSetStart[firstLowestFValue].fValue) { // If the f value at openSetStart[i] is lower than the fValue at openSetStart[lowestFValue]
                firstLowestFValue = i; // Make i the index of the lowest fValue in openSetStart
            }
        }
        currentOne = openSetStart[firstLowestFValue]; // Make current the node with the lowest fValue from the first open set

        // Find the node with lowest f in the first open set
        let secondLowestFValue = 0;
        for (let j = 0; j < openSetEnd.length; j++) { // For every node in the second open set
            if (openSetEnd[j].fValue < openSetEnd[secondLowestFValue].fValue) { // If the f value at openSetEnd[i] is lower than the fValue at openSetEnd[lowestFValue]
                secondLowestFValue = j; // Make i the index of the lowest fValue in openSetEnd
            }
        }
        currentTwo = openSetEnd[secondLowestFValue]; // Make current the node with the lowest fValue from the second open set

        //-----------------------------------------------------------------------------------------------------------------------

        // Take current node out of the first open set and push it to the first closed set
        const currentIndexOne = openSetStart.indexOf(currentOne);
        openSetStart.splice(currentIndexOne, 1);
        closedSetStart.push(currentOne);

        // Take current node out of the second open set and push it to the second closed set
        const currentIndexTwo = openSetEnd.indexOf(currentTwo);
        openSetEnd.splice(currentIndexTwo, 1);
        closedSetEnd.push(currentTwo);

        // If the two current nodes are in the same postion
        if (currentOne === currentTwo) {
            return {closedSetStart, openSetStartHistory, closedSetEnd, openSetEndHistory, currentOne, currentTwo}; // Return
        }

        //-----------------------------------------------------------------------------------------------------------------------

        // Get neighbors of the first current node
        const neighborsOne = getNeighbors(grid, currentOne);

        // Get neighbors of the second current node
        const neighborsTwo = getNeighbors(grid, currentTwo);

        //-----------------------------------------------------------------------------------------------------------------------

        for (const neighborOne of neighborsOne) { // For each neighbor in the first set of neighbors
            for (const neighborTwo of neighborsTwo) { // For each neighbor in the secon set of neighbors
                let newForwardPathFound = false;
                let newBackwardPathFound = false;

                // FORWARD SEARCH
                if (closedSetStart.includes(neighborOne) === false && neighborOne.isAWall === false) { // If the neighbor is not in the first closed set
                    let tempGOne = currentOne.gValue + heuristicFunction(neighborOne, currentOne); // Set the temporary gValue
    
                    // Find out if we have a better path than before
                    if (openSetStart.includes(neighborOne) === true) { // If the neighbor is in the open set
                        if (tempGOne < neighborOne.gValue) { // If the temporary gValue is less than the neighbor's gValue
                            neighborOne.gValue = tempGOne; // Assign the temporary gValue to the neighbor's gValue
                            newForwardPathFound = true; // We have found a new path
                        }
                    } else { // Otherwise
                        neighborOne.gValue = tempGOne; // Assign the temporary gValue to the neighbor's gValue
                        newForwardPathFound = true; // We have found a new path
                        openSetStart.push(neighborOne); // Push this neighbor to the open set
                        openSetStartHistory.push(neighborOne);
                    }
                }

                //-----------------------------------------------------------------------------------------------------------------------

                // BACKWARD SEARCH
                if (closedSetEnd.includes(neighborTwo) === false && neighborTwo.isAWall === false) { // If the neighbor is not in the first closed set
                    let tempGTwo = currentTwo.gValue + heuristicFunction(neighborTwo, currentTwo); // Set the temporary gValue

                    // Find out if we have a better path than before
                    if (openSetEnd.includes(neighborTwo) === true) { // If the neighbor is in the second open set
                        if (tempGTwo < neighborTwo.gValue) { // If the temporary gValue is less than the neighbor's gValue
                            neighborTwo.gValue = tempGTwo; // Assign the temporary gValue to the neighbor's gValue
                            newBackwardPathFound = true; // We have found a new path
                        }
                    } else { // Otherwise
                        neighborTwo.gValue = tempGTwo; // Assign the temporary gValue to the neighbor's gValue
                        newBackwardPathFound = true; // We have found a new path
                        openSetEnd.push(neighborTwo); // Push this neighbor to the second open set
                        openSetEndHistory.push(neighborTwo);
                    }
                }

                // If we do have a better forward and backward path
                if (newForwardPathFound === true) {
                    neighborOne.hValue = heuristicFunction(neighborOne, neighborTwo); // Compute the neighbor's hValue
                    neighborOne.fValue = neighborOne.gValue + neighborOne.hValue + neighborTwo.gValue; 
                    neighborOne.forwardNode = currentOne; // Make the current node the parent node of this neighbor
                }

                // If we do have a better backward path
                if (newBackwardPathFound) {
                    neighborTwo.hValue = heuristicFunction(neighborOne, neighborTwo); // Compute the neighbor's hValue
                    neighborTwo.fValue = neighborOne.gValue + neighborTwo.hValue + neighborTwo.gValue; 
                    neighborTwo.backWardNode = currentTwo; // Make the current node the parent node of this neighbor
                }
            }
        }
    }
    return {closedSetStart, openSetStartHistory, closedSetEnd, openSetEndHistory, currentOne, currentTwo}; // If there is no solution, return
};

// Helper function to return the shortest path found from AStar
export const getForwardBidrectionalAStarPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.forwardNode;
    }
    return nodesInShortestPathOrder;
};

export const getBackwardBidirectionalAstartPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.backWardNode;
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