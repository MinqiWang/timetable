import React, { Component } from 'react'

export class DayColumn extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         events: []
      }
    }

    componentDidMount() {
        const {id} = this.props;
        let events = [];
        for (let i = 0; i < 4; i++) {
            let event = {};
            event.time = i;
            event.id = i;
            event.title = "title"+i;
            event.top = i*80;
            event.height = 40;
            events.push(event);
        }
        this.setState({events: events});
        this.makeResizableDiv(id);
        this.makeDraggableDiv(id);
    }

    makeDraggableDiv(id) {
        const element = document.querySelector('#event'+id);
        const drager = document.querySelector('#draggable'+id);
        const container = document.querySelector('#container'+id);

        const minimum_bound = 0;
        const maximum_bound = 960;

        let original_height = 0;
        let original_y = 0;
        let difference_y = 0;

        drager.addEventListener('mousedown', function(e) {
            e.preventDefault();
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
            difference_y = e.y - original_y;
            container.addEventListener('mousemove', adjust);
            container.addEventListener('mouseup', stopAdjust);
            container.addEventListener('mouseleave', stopAdjust);
        })
          
        function adjust(e) {
            e.preventDefault();
            let temp_top = (e.y - difference_y);
            let max_top = Math.ceil(temp_top/10)*10;
            let min_top = Math.floor(temp_top/10)*10;

            if ((temp_top % 10) > 5 
            && (original_y != max_top) 
            && (max_top + original_height) <= maximum_bound) {
                original_y = max_top;
                element.style.top = max_top + 'px';
            } else if ((temp_top % 10) <= 5 
            && (original_y != min_top) 
            && min_top >= minimum_bound 
            && (min_top + original_height) <= maximum_bound) {
                original_y = min_top;
                element.style.top = min_top + 'px';
            }
        }
        
        function stopAdjust() {
            container.removeEventListener('mousemove', adjust);
        // do save
        }
      }

    makeResizableDiv(id) {
        const element = document.querySelector('#event'+id);
        const resizer = document.querySelector('#resizer'+id);
        const container = document.querySelector('#container'+id);

        const minimum_bound = 10;
        const maximum_bound = 960;
        let original_y = 0;
        let original_height = 0;
        let original_mouse_y = 0;
        let height_in_progress = 0;

        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault()
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
            height_in_progress = original_height;
            original_mouse_y = e.y;
            container.addEventListener('mousemove', resize);
            container.addEventListener('mouseup', stopResize);
            container.addEventListener('mouseleave', stopResize);
        })
        function resize(e) {
            let add_height = e.y - original_mouse_y;
            let right_add_height = Math.ceil(add_height/10)*10;
            let temp_height = original_height + right_add_height;
            if ((temp_height != height_in_progress) 
            && (temp_height >= minimum_bound) 
            && ((original_y + temp_height) <= maximum_bound)) {
                height_in_progress = temp_height;
                element.style.height = temp_height + 'px';
            }
          }

          function stopResize() {
            container.removeEventListener('mousemove', resize);
            // do save
          }
      }

    render() {
        const {id} = this.props;
        const {events} = this.state;
        return (
        <div id={"container"+id} className="scroll-slots-col">
            {/* <div id={id+"0"} className="slot" ><div id={"event"+id} className="event" draggable="true" onDragEnd={this.dragend} onDragStart={this.dragstart}></div></div>
            <div id={id+"1"} className="slot" onDrop={this.drop} onDragOver={this.hello}></div>
            <div id={id+"2"} className="slot" onDrop={this.drop} onDragOver={this.hello}></div> */}
            {/* {events.map((event) => 
            <div key={event.id} id={id + "/" + event.id} className="event" draggable>
                <div id={"draggable"+id} className="draggable">
                    <div id={"title" + id + "/" + event.id}>
                        {event.title}
                    </div>
                    <div id={"time" + id + "/" + event.id}>
                        {event.time}
                    </div>
                </div>
                <div id={"resizer"+id} className="resizer"></div>
            </div>)} */}

            <div id={"event"+id} className="event">
                <div id={"draggable"+id} className="draggable">
                </div>
                <div id={"resizer"+id} className="resizer"></div>
            </div>
        </div>
        )
    }
}

export default DayColumn
