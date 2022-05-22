import React, {Component} from "react";

import './Node.css';

export default class Node extends Component {  
    render() {
        const {
            row,
            startNode,
            endNode,
            isAWall,
            onMouseEnter,
            onMouseDown,
            onMouseUp,
            column,
        } = this.props;
        const checkClassName = startNode // Stupid ternary operator to determine class name of node
            ? 'node-start' 
            : endNode 
            ? 'node-end' 
            : isAWall
            ? 'node-wall'
            : '';
    
        return(
            <div 
                id = {`node-${row}-${column}`}
                className = {`node ${checkClassName}`}
                onMouseEnter = {() => onMouseEnter(row, column)}
                onMouseDown = {() => onMouseDown(row, column)}
                onMouseUp = {() => onMouseUp()}
            >
            </div>
        );
    }
}