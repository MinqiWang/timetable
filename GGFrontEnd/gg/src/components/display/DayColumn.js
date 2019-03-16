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

        const minimum_size = 0;
        let original_height = 0;
        let original_mouse_y = 0;
        let original_y = 0;

        drager.addEventListener('mousedown', function(e) {
            e.preventDefault();
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_y = parseFloat(getComputedStyle(element, null).getPropertyValue('top').replace('px', ''));
            console.log("original_y:"+original_y);
            original_mouse_y = e.y;
            container.addEventListener('mousemove', adjust);
            container.addEventListener('mouseup', stopAdjust);
        })
          
        function adjust(e) {
            e.preventDefault();
            if ((e.y - original_mouse_y) >= 10) {
                original_mouse_y = e.y;
                if (original_y + 10 <= 960 - original_height) {
                    element.style.top = original_y + 10 + 'px';
                    original_y += 10;
                }
            } else if ((e.y - original_mouse_y) <= -10) {
                original_mouse_y = e.y;
                if (original_y - 10 >= minimum_size) {
                    element.style.top = original_y - 10 + 'px';
                    original_y -= 10;
                }
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

        const minimum_size = 9.5;
        let original_height = 0;
        let original_mouse_y = 0;

        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault()
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            
            console.log("e_y:"+e.y);

            original_mouse_y = e.y;
            container.addEventListener('mousemove', resize);
            container.addEventListener('mouseup', stopResize);
        })
          
          function resize(e) {
            if ((e.y - original_mouse_y) >= 10) {
                original_mouse_y = e.y;
                element.style.height = original_height + 10 + 'px';
                original_height += 10;
            } else if ((e.y - original_mouse_y) <= -10) {
                if (original_height - 10 > minimum_size) {
                    original_mouse_y = e.y;
                    element.style.height = original_height - 10 + 'px';
                    original_height -= 10;
                }
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
