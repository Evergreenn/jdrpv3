import { linkEvent, Component } from 'inferno';

function handleClick(instance, event) {
  console.log("toto");
}

class MyComponent extends Component {
  render () {
    return <div><input type="text" onClick={ linkEvent(this, handleClick) } /></div>;
  }
}