import React, { Component } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import 'holderjs'

/* This is the component responsible for advertise features we provide to the users */
export class Advertisement extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            index: 0,
            direction: null,
        };
    }

    handleSelect(selectedIndex, e) {
    this.setState({
        index: selectedIndex,
        direction: e.direction,
    });
    }

    render() {
        const { index, direction } = this.state;

        return (
            <>
            <Carousel
            activeIndex={index}
            direction={direction}
            onSelect={this.handleSelect}
            >
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="holder.js/800x800?text=First slide&bg=373940"
                alt="First slide"
                />
                <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="holder.js/800x800?text=Second slide&bg=282c34"
                alt="Third slide"
                />

                <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="holder.js/800x800?text=Third slide&bg=20232a"
                alt="Third slide"
                />

                <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
                </Carousel.Caption>
            </Carousel.Item>
            </Carousel>
            </>
        );
    }
}

export default Advertisement
