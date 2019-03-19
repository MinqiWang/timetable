import React, { Component } from 'react';
import Event from './Event'

export class DayColumn extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         events: []
      }
    }

    componentDidMount() {
        const {col_id} = this.props;
        let events = [];
        for (let i = 0; i < 4; i++) {
            let event = {};
            event.time = i;
            event.id = "" + col_id + i;
            event.title = "title"+i;
            event.top = i*80;
            event.height = 40;
            events.push(event);
        }
        this.setState({events: events});  
    }

    render() {
        const {col_id} = this.props;
        const {events} = this.state;
        return (
        <div id={col_id} className="scroll-slots-col">
            {/* <div id={id+"0"} className="slot" ><div id={"event"+id} className="event" draggable="true" onDragEnd={this.dragend} onDragStart={this.dragstart}></div></div>
            <div id={id+"1"} className="slot" onDrop={this.drop} onDragOver={this.hello}></div>
            <div id={id+"2"} className="slot" onDrop={this.drop} onDragOver={this.hello}></div> */}
            {events.map((event) => 
            <Event key={event.id} col_id={col_id} event={event}></Event>)}
            {/* <div key={event.id} id={id + "/" + event.id} className="event" draggable>
                <div id={"draggable"+id} className="draggable">
                    <div id={"title" + id + "/" + event.id}>
                        {event.title}
                    </div>
                    <div id={"time" + id + "/" + event.id}>
                        {event.time}
                    </div>
                </div>
                <div id={"resizer"+id} className="resizer"></div>
            </div>)}
            
            <div id={"event"+id} className="event">
                <div id={"draggable"+id} className="draggable">
                </div>
                <div id={"resizer"+id} className="resizer"></div>
            </div> */}
        </div>
        )
    }
}

export default DayColumn
