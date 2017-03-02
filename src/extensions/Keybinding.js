import React from 'react';
import Mousetrap from 'mousetrap';
import { Slot, Fill } from '../slots';
import Settings from './Settings';

export default class Keybinding extends React.Component {
  constructor(props) {
    super(props);
    this.handleRegistered = this.handleRegistered.bind(this);
    this.handleUnregistered = this.handleUnregistered.bind(this);
    this.state = {};
  }

  handleRegistered(fill) {
    this.setState({
      [fill.props.hotkey]: {
        hotkey: fill.props.hotkey,
        groupName: fill.props.groupName,
        description: fill.props.description
      }
    });
  }

  handleUnregistered(fill) {
    this.setState({
      [fill.props.hotkey]: null
    });
  }

  render() {

    // Group by
    const groups = Object.keys(this.state).reduce((acc, key) => {
      const binding = this.state[key];

      const existingGroup = acc.find(group => group.name === binding.groupName);

      if (existingGroup) {
        existingGroup.bindings.push(binding);
      } else {
        acc.push({
          name: binding.groupName,
          bindings: [binding]
        })
      }

      return acc;
    }, []);

    return (
      <div>
        <Settings.Group label="Keybindings">
          <table className="collapse ba br2 b--black-10 pv2 ph3 mt4">
            <thead>
              <tr className="striped--light-gray ">
                <th className="pv2 ph3 tl f6 fw6 ttu">Group</th>
                <th className="tl f6 ttu fw6 pv2 ph3">Hotkey</th>
                <th className="tl f6 ttu fw6 pv2 ph3">Description</th>
              </tr>
            </thead>
            {groups.map((group, index) => {
              const numItems = group.bindings.length;
              return (
                <tbody key={index.toString()}>
                  {group.bindings.map((binding, index2) =>
                    <tr key={index.toString()+index2.toString()}>
                      {index2 == 0 &&
                        <td rowSpan={numItems} className="pv2 ph3">{group.name}</td>
                      }
                      <td className="pv2 ph3">{binding.hotkey}</td>
                      <td className="pv2 ph3">{binding.description}</td>
                    </tr>
                  )}
                </tbody>
              )
            })}
          </table>
        </Settings.Group>

        <Slot name="Keybinding.Hotkey"
          exposedProps={{ onRegistered: this.handleRegistered, onUnRegistered: this.handleUnregistered }} />
      </div>
    );
  }
}

class Keybind extends React.Component {
  constructor(props) {
    super(props);
    this.handleInvoke = this.handleInvoke.bind(this);
  }

  handleInvoke() {
    this.props.onInvoke();
    return false;
  }

  componentWillMount() {
    Mousetrap.bind(this.props.hotkey, this.handleInvoke);
    this.props.onRegistered();
  }

  componentWillUnmount() {
    this.props.onUnRegistered();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hotkey !== this.props.hotkey) {
      console.log('do something like re-register');
    }
  }

  render() {
    return null;
  }
}

Keybinding.Binding = class extends React.Component {
  render() {
    const { children, onInvoke, ...rest } = this.props;

    const child = React.Children.only(children);

    return React.cloneElement(
      child, {}, [
        ...child.props.children,
        <Fill key="hotkey" name="Keybinding.Hotkey" {...rest}>
          <Keybind hotkey={rest.hotkey} onInvoke={onInvoke} />
        </Fill>
      ]);
  }
}

Keybinding.Binding.defaultProps = {
  hotkey: '',
  groupName: '',
  description: '',
  onInvoke: () => { /*no-op*/ }
}