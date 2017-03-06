import React from 'react';

import { Slot, Fill } from '../../lib';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentItem: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(fill) {
    this.setState({ currentItem: fill.props.label });
    fill.props.onClick();
  }

  render() {
    return (
      <div>
        <h2>Toolbar</h2>
        <h3>Current Item: {this.state.currentItem}</h3>
        <Slot name="Toolbar.Item" exposedProps={{ onClick: this.handleClick }} />
      </div>
    );
  }
}

export default Toolbar;

  Toolbar.Item = ({ label, onClick }) =>
    <Fill name="Toolbar.Item" label={label} onClick={onClick}>
      <button>{label}</button>
    </Fill>