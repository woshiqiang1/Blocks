/**
 * until 2017/10/5
 */
import React from './Luy'
import ReactDOM from './Luy'
import Component from './Luy'

let a = [1, 2, 3, 4, 5]

class C extends React.Component {
    render() {
        return (<div>asd</div>)

    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            counter: 2
        }
        // setInterval(() => {
        //   this.setState({ counter: this.state.counter + 1 })
        // }, 1500)
        //
    }

    render() {
        return (
            <div key={1} style={{background: `rgb(200,220,${this.state.counter + 1})`}}>
                <h1>hello world</h1>
                {[<p>1</p>,<p>2</p>,<p>3</p>]}
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);