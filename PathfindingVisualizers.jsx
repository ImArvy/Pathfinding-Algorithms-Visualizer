import React, {Component} from 'react';
import Node from './Node';
import {Dijkstra, getShortestDijkstraPath} from './Pathfinding Algorithms/Dijkstra';
import {AStar, getShortestAStarPath} from './Pathfinding Algorithms/AStar';
import {WeightedAStar, getShortestWeightedAStarPath} from './Pathfinding Algorithms/WeightedAStar';
import {BidirectionalAStar, getForwardBidrectionalAStarPath, getBackwardBidirectionalAStarPath} from './Pathfinding Algorithms/BidirectionalAStar';
import {IterativeDFS, getShortestIterativeDFSPath} from './Pathfinding Algorithms/IterativeDFS';
import { RecursiveDFS, getShortestRecursiveDFSPath } from './Pathfinding Algorithms/RecursiveDFS';
import {IterativeBFS, getShortestBFSPath} from './Pathfinding Algorithms/IterativeBFS';
import {BidirectionalBFS, getForwardBidrectionalBFSPath, getBackwardBidirectionalBFSPath} from './Pathfinding Algorithms/BidirectionalBFS';
import {GreedyBFS, getShortestGreedyBFSPath} from './Pathfinding Algorithms/GreedyBFS';

import './PathfindingVisualizers.css';

let rowAmount = 40;
let columnAmount = 100;

let startNodeRow = rowAmount - (rowAmount); // Start at 0
let startNodeColumn = columnAmount - (columnAmount); // Start at 0
let endNodeRow = rowAmount - (rowAmount - 39); // Start at 39
let endNodeColumn = columnAmount - (columnAmount - 99); // Start at 99

const defaultStartNodeRow = rowAmount - (rowAmount); // Start at 0
const defaultStartNodeColumn = columnAmount - (columnAmount); // Start at 0
const defaultEndNodeRow = rowAmount - (rowAmount - 39); // Start at 39
const defaultEndNodeColumn = columnAmount - (columnAmount - 99); // Start at 99

/*
let startNodeRow = rowAmount - (rowAmount - 20); // Start at 20
let startNodeColumn = columnAmount - (columnAmount - 20); // Start at 20
let endNodeRow = rowAmount - (rowAmount - 20); // Start at 20
let endNodeColumn = columnAmount - (columnAmount - 100); // Start at 100

const defaultStartNodeRow = rowAmount - (rowAmount - 20); // Start at 20
const defaultStartNodeColumn = columnAmount - (columnAmount - 20); // Start at 20
const defaultEndNodeRow = rowAmount - (rowAmount - 20); // Start at 20
const defaultEndNodeColumn = columnAmount - (columnAmount - 100); // Start at 100
*/

export default class PathfindingVisualizers extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            mouseMoveStartNode: false,
            mouseMoveEndNode: false,
        };
    }

    componentDidMount() {
        document.title = "Pathfinding Algorithms Visualizer"
        
        const grid = this.createNewGrid(startNodeRow, startNodeColumn, endNodeRow, endNodeColumn);
        this.setState({grid});
    }

    createNewGrid(startNodeRow, startNodeColumn, endNodeRow, endNodeColumn) {
        const grid = [];
        for (let row = 0; row < rowAmount; row++) {
            const currentRow = [];
            for (let column = 0; column < columnAmount; column++) {
                currentRow.push(this.createNewNode(row, column, startNodeRow, startNodeColumn, endNodeRow, endNodeColumn));
            }
            grid.push(currentRow);
        }
        return grid;
    }

    createNewNode(row, column, startNodeRow, startNodeColumn, endNodeRow, endNodeColumn) {
        return {
            row,
            column,
            startNode: row === startNodeRow && column === startNodeColumn,
            endNode: row === endNodeRow && column === endNodeColumn,
            distance: Infinity,
            hasBeenVisited: false,
            isAWall: false,
            previousNode: null,
            fValue: 0,
            gValue: 0,
            hValue: 0,
            forwardNode: null,
            backwardNode: null,
            forwardVisited: false,
            backwardVisited: false,
        };
    }

    // Allow user to move startNode
    getNewStartNodeGrid(grid, row, column) {
        startNodeRow = row;
        startNodeColumn = column;
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node,
            startNode: node.row === startNodeRow && node.column === startNodeColumn,
        };
        for (const row of grid) {
            for (const node of row) {
                if (node.row !== startNodeRow || node.column !== startNodeColumn) {
                    if (node.startNode) {
                        node.startNode = false;
                    }
                }
            }
        }
        newGrid[row][column] = newNode;
        return newGrid;
    }

    // Allow user to move endNode
    getNewEndNodeGrid(grid, row, column) {
        endNodeRow = row;
        endNodeColumn = column;
        const newGrid = grid.slice();
        const node = newGrid[row][column];

        const newNode = {
            ...node,
            endNode: node.row === endNodeRow && node.column === endNodeColumn,
        };
        for (const row of grid) {
            for (const node of row) {
                if (node.row !== endNodeRow || node.column !== endNodeColumn) {
                    if (node.endNode) {
                        node.endNode = false;
                    }
                }
            }
        }
        newGrid[row][column] = newNode;

        return newGrid;
    }

    // Allow user to place walls
    getNewGridWithWallsOn(grid, row, column) {
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node,
            isAWall: !node.isAWall,
        };
        newGrid[row][column] = newNode;
        return newGrid;
    }

    // Allow user to place walls randomly
    addWalls(grid) {
        const newGrid = grid.slice();
        for (let row = 0; row < rowAmount; row++) {
            for (let column = 0; column < columnAmount; column++) {
                if (Math.random() < 0.2) {
                    const node = newGrid[row][column];
                    const newNode = {
                        ...node,
                        isAWall: node.isAWall = true,
                    };
                    newGrid[row][column] = newNode;
                }
            }
        }
        this.setState({grid: newGrid});
    }

    // Create walls using Recursive Division Maze Algorithm
    recursiveDivisionMaze(grid) {
        const newGrid = grid.slice();
        
        const HORIZONTAL = 1;
        const VERTICAL = 2;
        
        // Helper to get either horizontal or vertical orientation
        const getOrientation = (width, height) => {
            // If width is less than height, return horizontal
            if (width < height) {
                return HORIZONTAL;
            } 
            
            // If height is less than width, return vertical
            if (height < width) {
                return VERTICAL;
            } 

            // Otherwise
            return (Math.floor(Math.random() * 2)) === 0 ? HORIZONTAL : VERTICAL; 
        }; 

        // Helper to get random number for wall to remove
        const getRandomNumber = (value) => {
            const randomNumber = ((Math.floor(Math.random() * value)));
            return randomNumber;
        };

        const divideRecursively = (grid, width, height, verticalSplitIndex, horizontalSplitIndex, orientation) => {
            // Terminate once either the height or width is less than 2
            if (width < 2 || height < 2) {
                return;
            }
            
            // If we should cut vertically
            const verticalWallToRemove = getRandomNumber(height);
            if (orientation === VERTICAL) {
                // Make a vertical wall at the vertical split index
                for (let row = 0; row < height; row++) {
                    for (let column = 0; column < width; column++) {
                        if (column === verticalSplitIndex && row !== verticalWallToRemove) {
                            const node = grid[row][column];
                            const newNode = {
                                ...node,
                                isAWall: node.isAWall = true,
                            };
                            grid[row][column] = newNode;
                        }
                    }
                }

                const gridLeft = [];
                const gridRight = [];
                for (let row = 0; row < height; row++) {
                    const gridLeftRow = [];
                    const gridRightRow = [];
                    for (let column = 0; column < width; column++) {
                        // If we are to the left of the vertical split index
                        if (column < verticalSplitIndex) {
                            const node = grid[row][column];
                            gridLeftRow.push(node);
                        }

                        // If we are to the right of the vertical split index
                        if (column > verticalSplitIndex) {
                            const node = grid[row][column];
                            gridRightRow.push(node);
                        }
                    }
                    gridLeft.push(gridLeftRow);
                    gridRight.push(gridRightRow);
                }

                width = gridRight[0].length;
                height = gridRight.length;

                verticalSplitIndex = Math.floor(width / 2);
                horizontalSplitIndex = Math.floor(height / 2);

                divideRecursively(gridLeft, width, height, verticalSplitIndex, horizontalSplitIndex, getOrientation(width, height));
                divideRecursively(gridRight, width, height, verticalSplitIndex, horizontalSplitIndex, getOrientation(width, height));
            } 
            
            // If we should cut horizontally
            const horizontalWallToRemove = getRandomNumber(width);
            if (orientation === HORIZONTAL) {
                // Make a horizontal wall at the horizontal split index
                for (let row = 0; row < height; row++) {
                    for (let column = 0; column < width; column++) {
                        if (row === horizontalSplitIndex && column !== horizontalWallToRemove) {
                            const node = grid[row][column];
                            const newNode = {
                                ...node,
                                isAWall: node.isAWall = true,
                            };
                            grid[row][column] = newNode; 
                        }
                    }
                }

                // Create top subgrid
                const gridTop = [];
                for (let row = 0; row < horizontalSplitIndex; row++) {     
                    const gridTopRow = [];
                    for (let column = 0; column < width; column++) {
                        const topNode = grid[row][column];
                        gridTopRow.push(topNode);
                    }
                    gridTop.push(gridTopRow);
                }

                // Create bottom subgrid
                const gridBottom = [];
                for (let row = horizontalSplitIndex + 1; row < height; row++) {     
                    const gridBottomRow = [];
                    for (let column = 0; column < width; column++) {
                        const topNode = grid[row][column];
                        gridBottomRow.push(topNode);
                    }
                    gridBottom.push(gridBottomRow);
                }

                width = gridBottom[0].length;
                height = gridBottom.length;

                verticalSplitIndex = Math.floor(width / 2);
                horizontalSplitIndex = Math.floor(height / 2);

                divideRecursively(gridTop, width, height, verticalSplitIndex, horizontalSplitIndex, getOrientation(width, height));
                divideRecursively(gridBottom, width, height, verticalSplitIndex, horizontalSplitIndex, getOrientation(width, height));
            }
        }

        divideRecursively(newGrid, columnAmount, rowAmount, columnAmount / 2, rowAmount / 2, getOrientation(columnAmount, rowAmount));
        this.setState({grid: newGrid});
    }

    // Allow user to clear the grid
    resetGrid() {
        startNodeRow = defaultStartNodeRow;
        startNodeColumn = defaultStartNodeColumn;
        endNodeRow = defaultEndNodeRow;
        endNodeColumn = defaultEndNodeColumn;
        const newGrid = [];
        for (let row = 0; row < rowAmount; row++) {
            const currentRow = [];
            for (let column = 0; column < columnAmount; column++) {
                currentRow.push(this.createNewNode(row, column, startNodeRow, startNodeColumn, endNodeRow, endNodeColumn));
            }
            newGrid.push(currentRow);
        }
        for (const row of newGrid) {
            for (const node of row) {
                if (node.startNode === false && node.endNode === false) {
                    node.startNode = false;
                    node.endNode = false;
                    node.distance = Infinity;
                    node.hasBeenVisited = false;
                    node.isAWall = false;
                    node.previousNode = null;
                    node.fValue = 0;
                    node.gValue = 0;
                    node.hValue = 0;
                    node.forwardNode = null;
                    node.backWardNode = null;
                    document.getElementById(`node-${node.row}-${node.column}`).className = 'node';
                }
                if (node.startNode) {
                    node.endNode = false;
                    node.distance = Infinity;
                    node.hasBeenVisited = false;
                    node.isAWall = false;
                    node.previousNode = null;
                    node.fValue = 0;
                    node.gValue = 0;
                    node.hValue = 0;
                    node.forwardNode = null;
                    node.backWardNode = null;
                    document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-start';
                }
                if (node.endNode) {
                    node.startNode = false;
                    node.distance = Infinity;
                    node.hasBeenVisited = false;
                    node.isAWall = false;
                    node.previousNode = null;
                    node.fValue = 0;
                    node.gValue = 0;
                    node.hValue = 0;
                    node.forwardNode = null;
                    node.backWardNode = null;
                    document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-end';
                }
            }
        }
        this.setState({grid: newGrid});
    }

    // Open my LinkedIn profile
    openLink() {
        const link = 'https://www.linkedin.com/in/ryan-vales-a53767112/';
        window.open(link);
    }

    handleMouseEnter(grid, row, column) {
        if (this.state.mouseMoveStartNode && !this.state.mouseMoveEndNode && !this.state.mouseIsPressed) {
            const newGrid = this.getNewStartNodeGrid(grid, row, column);
            this.setState({grid: newGrid});
        }
        if (!this.state.mouseMoveStartNode && this.state.mouseMoveEndNode && !this.state.mouseIsPressed) {
            const newGrid = this.getNewEndNodeGrid(grid, row, column);
            this.setState({grid: newGrid});
        }
        if (!this.state.mouseMoveStartNode && !this.state.mouseMoveEndNode && this.state.mouseIsPressed) {
            const newGrid = this.getNewGridWithWallsOn(this.state.grid, row, column);
            this.setState({grid: newGrid});
        }
    }

    // Handle when the user presses the mouse button
    handleMouseDown(grid, row, column) {
        // If the selected node is the start node
        if (grid[row][column] === grid[startNodeRow][startNodeColumn]) { 
            const newGrid = this.getNewStartNodeGrid(grid, row, column);
            this.setState({grid: newGrid, mouseMoveStartNode: true});
        }
        // If the selected node is the end node
        if (grid[row][column] === grid[endNodeRow][endNodeColumn]) { 
            const newGrid = this.getNewEndNodeGrid(grid, row, column);
            this.setState({grid: newGrid, mouseMoveEndNode: true});
        }
        // If the selected node is neither the start node nor the end node 
        if (grid[row][column] !== grid[startNodeRow][startNodeColumn] && grid[row][column] !== grid[endNodeRow][endNodeColumn]) {
            const newGrid = this.getNewGridWithWallsOn(this.state.grid, row, column);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    // Handle when the user releases the mouse button
    handleMouseUp() {
        this.setState({mouseIsPressed: false, mouseMoveStartNode: false, mouseMoveEndNode: false});
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate the shortest path for pathfinding algorithms
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-shortest-path';
            }, i * 10);
        }
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Dijkstra's Algorithm
    animateDijkstra(nodesVisitedInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= nodesVisitedInOrder.length; i++) {
            if (i === nodesVisitedInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, i * 10);
                return;
            }
            setTimeout(() => {
                const node = nodesVisitedInOrder[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        } 
    }

    // Visualize Dijkstra's Algorithm
    visualizeDijkstraAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const dijkstraVisitedNodes = Dijkstra(grid, startNode, endNode);
        const shortestDijkstraPath = getShortestDijkstraPath(endNode);
        this.animateDijkstra(dijkstraVisitedNodes, shortestDijkstraPath);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate A* Algorithm
    animateAStar(closedSet, openSetHistory, shortestAStarPath) {
        for (let i = 0; i <= openSetHistory.length; i++) {
            if (i === openSetHistory.length) {
                setTimeout(() => { // Animate shortest path
                    this.animateShortestPath(shortestAStarPath);
                }, i * 10);
                return;
            }
            setTimeout(() => { // Animate open set
                const openSetNode = openSetHistory[i];
                document.getElementById(`node-${openSetNode.row}-${openSetNode.column}`).className = 'node node-open-set';
            }, i * 10);
            if (i < closedSet.length) { // Animate closed set
                setTimeout(() => {
                    const closedSetNode = closedSet[i];
                    document.getElementById(`node-${closedSetNode.row}-${closedSetNode.column}`).className = 'node node-visited';
                }, i * 10.5);
            }
        }
    }

    // Visualize A* Algorithm
    visualizeAStarAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = AStar(grid, startNode, endNode);
        
        const closedSet = result.closedSet;
        const openSetHistory = result.openSetHistory;
        
        const shortestAStarPath = getShortestAStarPath(endNode);
        this.animateAStar(closedSet, openSetHistory, shortestAStarPath);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Weighted A* Algorithm
    animateWeightedAStar(closedSet, openSetHistory, shortestWeightedAStarPath) {
        for (let i = 0; i <= openSetHistory.length; i++) {
            if (i === openSetHistory.length) {
                setTimeout(() => { // Animate shortest path
                    this.animateShortestPath(shortestWeightedAStarPath);
                }, i * 10);
                return;
            }
            setTimeout(() => { // Animate open set
                const openSetNode = openSetHistory[i];
                document.getElementById(`node-${openSetNode.row}-${openSetNode.column}`).className = 'node node-open-set';
            }, i * 10);
            if (i < closedSet.length) { // Animate closed set
                setTimeout(() => {
                    const closedSetNode = closedSet[i];
                    document.getElementById(`node-${closedSetNode.row}-${closedSetNode.column}`).className = 'node node-visited';
                }, i * 10.5);
            }
        }
    }

    // Visualize Weighted A* Algorithm
    visualizeWeightedAStarAlgorithm() {
        
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = WeightedAStar(grid, startNode, endNode);
        const closedSet = result.closedSet;
        const openSetHistory = result.openSetHistory;
        const shortestWeightedAStarPath = getShortestWeightedAStarPath(endNode);
        this.animateWeightedAStar(closedSet, openSetHistory, shortestWeightedAStarPath);
    }

    // ------------------------------------------------------------------------------------------------------
    
    // Animate Forward Search of Bidirectional A* Algorithm
    animateBidirectionalAStarOne(closedSetOne, openSetOneHistory, shortestPathOne) {
        for (let i = 0; i <= openSetOneHistory.length; i++) {
            if (i === openSetOneHistory.length) {
                setTimeout(() => { // Animate shortest path
                    this.animateShortestPath(shortestPathOne);
                }, i * 10);
                return;
            }
            setTimeout(() => { // Animate open set
                const openSetNode = openSetOneHistory[i];
                document.getElementById(`node-${openSetNode.row}-${openSetNode.column}`).className = 'node node-open-set';
            }, i * 10);
            if (i < closedSetOne.length) { // Animate closed set
                setTimeout(() => {
                    const closedSetNode = closedSetOne[i];
                    document.getElementById(`node-${closedSetNode.row}-${closedSetNode.column}`).className = 'node node-visited';
                }, i * 10.5);
            }
        }
    }

    // Animate Backward Search of Bidirectional* Algorithm
    animateBidirectionalAStarTwo(closedSetTwo, openSetTwoHistory, shortestPathTwo) {
        for (let i = 0; i <= openSetTwoHistory.length; i++) {
            if (i === openSetTwoHistory.length) {
                setTimeout(() => { // Animate shortest path
                    this.animateShortestPath(shortestPathTwo);
                }, i * 10);
                return;
            }
            setTimeout(() => { // Animate open set
                const openSetNode = openSetTwoHistory[i];
                document.getElementById(`node-${openSetNode.row}-${openSetNode.column}`).className = 'node node-open-set';
            }, i * 10);
            if (i < closedSetTwo.length) { // Animate closed set
                setTimeout(() => {
                    const closedSetNode = closedSetTwo[i];
                    document.getElementById(`node-${closedSetNode.row}-${closedSetNode.column}`).className = 'node node-visited';
                }, i * 10.5);
            }
        }
    }

    // Visualize Bidirectional A* Algorithm
    visualizeBidirectionalAStarAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = BidirectionalAStar(grid, startNode, endNode);
        
        const closedSetOne = result.closedSetStart;
        const openSetOneHistory = result.openSetStartHistory;

        const closedSetTwo = result.closedSetEnd;
        const openSetTwoHistory = result.openSetEndHistory;

        const currentOne = result.currentOne;
        const currentTwo = result.currentTwo;
        const currentPath = result.currentPath;

        let shortestPathOne;
        let shortestPathTwo;

        if (currentPath === 'one') {
            shortestPathOne = getForwardBidrectionalAStarPath(currentOne);
            shortestPathTwo = getBackwardBidirectionalAStarPath(currentOne);
        }

        if (currentPath === 'two') {
            shortestPathOne = getForwardBidrectionalAStarPath(currentTwo);
            shortestPathTwo = getBackwardBidirectionalAStarPath(currentTwo);
        }

        if (currentPath === 'none') {
            shortestPathOne = getForwardBidrectionalAStarPath(currentOne);
            shortestPathTwo = getBackwardBidirectionalAStarPath(currentTwo);
        }
        
        this.animateBidirectionalAStarOne(closedSetOne, openSetOneHistory, shortestPathOne);
        this.animateBidirectionalAStarTwo(closedSetTwo, openSetTwoHistory, shortestPathTwo);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Iterative DFS Algorithm
    animateIterativeDFS(iterativeDFSStack, iterativeDFSStackHistory, shortestIterativeDFSPath) {
        for (let i = 0; i <= iterativeDFSStackHistory.length; i++) {
            if (i === iterativeDFSStackHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestIterativeDFSPath);
                }, i * 10);
                return;
            }
            //if (i < iterativeDFSStack.length) {
            //    setTimeout(() => {
            //        const node = iterativeDFSStack[i];
            //        document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-in-structure';
            //    }, i * 10);
            //}
            setTimeout(() => {
                const node = iterativeDFSStackHistory[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        }
    }

    // Visualize Iterative DFS Algorithm
    visualizeIterativeDFSAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = IterativeDFS(grid, startNode, endNode);

        const iterativeDFSStack = result.stack;
        const iterativeDFSStackHistory = result.stackHistory;

        const shortestIterativeDFSPath = getShortestIterativeDFSPath(endNode);
        this.animateIterativeDFS(iterativeDFSStack, iterativeDFSStackHistory, shortestIterativeDFSPath);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Recursive DFS Algorithm
    animateRecursiveDFS(recursiveDFSStack, recursiveDFSStackHistory, shortestRecursiveDFSPath) {
        for (let i = 0; i <= recursiveDFSStackHistory.length; i++) {
            if (i === recursiveDFSStackHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestRecursiveDFSPath);
                }, i * 10);
                return;
            }
            //if (i < recursiveDFSStack.length) {
            //    setTimeout(() => {
            //        const node = recursiveDFSStack[i];
            //        document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-in-structure';
            //    }, i * 10);
            //}
            setTimeout(() => {
                const node = recursiveDFSStackHistory[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        }
    }

    // Visualize Recursive DFS Algorithm
    visualizeRecursiveDFSAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = RecursiveDFS(grid, startNode, endNode);
        
        const recursiveDFSStack = result.stack;
        const recursiveDFSStackHistory = result.stackHistory;

        const shortestRecursiveDFSPath = getShortestRecursiveDFSPath(endNode);
        this.animateRecursiveDFS(recursiveDFSStack, recursiveDFSStackHistory, shortestRecursiveDFSPath);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Iterative BFS Algorithm
    animateIterativeBFS(iterativeBFSQueueHistory, shortestIterativeBFSPath) {
        for (let i = 0; i <= iterativeBFSQueueHistory.length; i++) {
            if (i === iterativeBFSQueueHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestIterativeBFSPath);
                }, i * 10);
                return;
            }
            setTimeout(() => {
                const node = iterativeBFSQueueHistory[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        }
    }

    // Visualize Iterative BFS Algorithm
    visualizeIterativeBFSAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const iterativeBFSQueueHistory = IterativeBFS(grid, startNode, endNode);
        const shortestIterativeBFSPath = getShortestBFSPath(endNode);
        this.animateIterativeBFS(iterativeBFSQueueHistory, shortestIterativeBFSPath);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Forward Search of Bidirectional BFS Algorithm
    animateBidirectionalBFSOne(queueOneHistory, shortestPathOne) {
        for (let i = 0; i <= queueOneHistory.length; i++) {
            if (i === queueOneHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestPathOne);
                }, i * 10);
                return;
            }
            setTimeout(() => {
                const node = queueOneHistory[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        }
    }

    // Animate Backward Search of Bidirectional BFS Algorithm
    animateBidirectionalBFSTwo(queueTwoHistory, shortestPathTwo) {
        for (let i = 0; i <= queueTwoHistory.length; i++) {
            if (i === queueTwoHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestPathTwo);
                }, i * 10);
                return;
            }
            setTimeout(() => {
                const node = queueTwoHistory[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
            }, i * 10);
        }
    }

    // Visualize Bidirectional BFS Algorithm
    visualizeBidirectionalBFSAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = BidirectionalBFS(grid, startNode, endNode);

        const queueOneHistory = result.queueOneHistory;
        const queueTwoHistory = result.queueTwoHistory;

        const currentOne = result.currentOne;
        const currentTwo = result.currentTwo;
        const currentPath = result.currentPath;

        let shortestPathOne;
        let shortestPathTwo;
        
        if (currentPath === 'one') {
            shortestPathOne = getForwardBidrectionalBFSPath(currentOne);
            shortestPathTwo = getBackwardBidirectionalBFSPath(currentOne);
        }

        if (currentPath === 'two') {
            shortestPathOne = getForwardBidrectionalBFSPath(currentTwo);
            shortestPathTwo = getBackwardBidirectionalBFSPath(currentTwo);
        }

        if (currentPath === 'none') {
            shortestPathOne = getForwardBidrectionalBFSPath(currentOne);
            shortestPathTwo = getBackwardBidirectionalBFSPath(currentTwo);
        }

        this.animateBidirectionalBFSOne(queueOneHistory, shortestPathOne);
        this.animateBidirectionalBFSTwo(queueTwoHistory, shortestPathTwo);
    }

    // ------------------------------------------------------------------------------------------------------

    // Animate Greedy BFS Algorithm
    animateGreedyBFS(greedyBFSClosedSet, greedyBFSOpenSetHistory, shortestGreedyBFSPath) {
        for (let i = 0; i <= greedyBFSOpenSetHistory.length; i++) {
            if (i === greedyBFSOpenSetHistory.length) {
                setTimeout(() => {
                    this.animateShortestPath(shortestGreedyBFSPath);
                }, i * 10);
                return;
            }
            setTimeout(() => { // Animate open set
                const openSetNode = greedyBFSOpenSetHistory[i];
                document.getElementById(`node-${openSetNode.row}-${openSetNode.column}`).className = 'node node-open-set';
            }, i * 10);
            if (i < greedyBFSClosedSet.length) { // Animate closed set
                setTimeout(() => {
                    const closedSetNode = greedyBFSClosedSet[i];
                    document.getElementById(`node-${closedSetNode.row}-${closedSetNode.column}`).className = 'node node-visited';
                }, i * 10.5);
            }
        }
    }

    // Visualize Greedy BFS Algorithm
    visualizeGreedyBFSAlgorithm() {
        const {grid} = this.state;
        const startNode = grid[startNodeRow][startNodeColumn];
        const endNode = grid[endNodeRow][endNodeColumn];
        const result = GreedyBFS(grid, startNode, endNode);

        const greedyBFSClosedSet = result.closedSet;
        const greedyBFSOpenSetHistory = result.openSetHistory;

        const shortestGreedyBFSPath = getShortestGreedyBFSPath(endNode);
        this.animateGreedyBFS(greedyBFSClosedSet, greedyBFSOpenSetHistory, shortestGreedyBFSPath);
    }

    // ------------------------------------------------------------------------------------------------------

    render() { 
        const {grid, mouseIsPressed} = this.state;
        return (
            <div>  
                <div className = 'visualizer-buttons'>
                    <button className = 'button' onClick = {() => this.visualizeDijkstraAlgorithm()}>Dijkstra's Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeAStarAlgorithm()}>A* Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeWeightedAStarAlgorithm()}>Weighted A* Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeBidirectionalAStarAlgorithm()}>Bidirectional A* Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeRecursiveDFSAlgorithm()}>Recursive DFS Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeIterativeDFSAlgorithm()}>Iterative DFS Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeIterativeBFSAlgorithm()}>Iterative BFS Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeBidirectionalBFSAlgorithm()}>Bidirectional BFS Algorithm</button>
                    <button className = 'button' onClick = {() => this.visualizeGreedyBFSAlgorithm()}>Greedy BFS Algorithm</button>
                    <button className = 'button' onClick = {() => this.recursiveDivisionMaze(grid)}>Generate Maze</button>
                    <button className = 'button' onClick = {() => this.addWalls(grid)}>Add Walls</button>
                    <button className = 'button' onClick = {() => this.resetGrid()}>Reset Grid</button>
                </div>
                <div className = 'grid'>
                    {grid.map((row, rowIndex) => {
                        return (
                            <div key = {rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    const {row, column, startNode, endNode, isAWall} = node;
                                    return(
                                        <Node 
                                            key = {nodeIndex}
                                            row = {row}
                                            startNode = {startNode} 
                                            endNode = {endNode}
                                            isAWall = {isAWall}
                                            mouseIsPressed = {mouseIsPressed}
                                            onMouseEnter = {(row, column) => this.handleMouseEnter(grid, row, column)}
                                            onMouseDown = {(row, column) => this.handleMouseDown(grid, row, column)}
                                            onMouseUp = {() => this.handleMouseUp()}
                                            column = {column}
                                        >
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className = 'link-buttons'>
                    <button className = 'button' onClick = {() => this.openLink()}>Ryan Vales </button>
                </div>
            </div>
        );
    }
}