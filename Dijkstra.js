// Dijkstra's Algorithm will return every node in the order in which they were visited and GUARANTEE the shortest path
export const Dijkstra = (grid, startNode, endNode) => {
    // Set the distance of the start node to zero
    startNode.distance = 0;

    // Initialize the set of visited nodes and the set of unvisited nodes
    const dijkstraVisitedNodes = [];
    const unvisitedNodesSet = getEveryNode(grid);

    // While there are nodes we have not yet visited
    while (unvisitedNodesSet.length) {
        // Find the node with the shortest distance and set it as the current node
        sortNodesByDistance(unvisitedNodesSet);
        const currentNode = unvisitedNodesSet.shift();
        
        // If the current node is a wall
        if (currentNode.isAWall) { 
            continue; // Skip this wall
        }

        // If the closest node has a distance of infinity then we are trapped and need to stop
        if (currentNode.distance === Infinity) {
            return dijkstraVisitedNodes; // Return the list of visited nodes
        }

        // Mark the current node as visited and push this current node to the list of visited nodes
        currentNode.hasBeenVisited = true; 
        dijkstraVisitedNodes.push(currentNode);
        
        // Find neighbors of the current node that have not yet been visited
        const unvisitedNeighbors = getUnvisitedNeighbors(grid, currentNode);
        
        // For every neighbor
        for (const neighbor of unvisitedNeighbors) {
            // Length of the path from the root node to this neighbor if it were to go through the current node
            const alternativePath = currentNode.distance + getEuclideanDistance(currentNode, neighbor); 
            
            // If this alternative path is shorter than the current shortest path recorded for this neighbor, then that path is replaced with the alternative path.
            if (alternativePath < neighbor.distance) {
                neighbor.distance = alternativePath;
                neighbor.previousNode = currentNode; // Make the current node the parent of this neighbor
            }
        }

        // If the current node is the end node
        if (currentNode === endNode) {
            return dijkstraVisitedNodes; // Return the list of visited nodes
        }
    }
};

// Start from endNode and works backwards to find the shortest path and works ONLY when called after method Dijkstra()
export const getShortestDijkstraPath = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};

const getEveryNode = (grid) => {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};

const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((firstNode, secondNode) => {
        return (
            firstNode.distance - secondNode.distance
        );
    });
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

const getUnvisitedNeighbors = (grid, node) => {
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

    return (
        neighbors.filter(neighbor => !neighbor.hasBeenVisited) // Return each neighbor in neighbors that has not been visited
    );
};