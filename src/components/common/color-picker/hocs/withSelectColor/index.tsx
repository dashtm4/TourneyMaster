import React from 'react';
import { Props } from '../../';

interface State {
  activeColor: string;
  displayColorPicker: boolean;
}

const withSelectColor = (Component: React.ComponentType<Props>) => {
  return class WithSelectColor extends React.Component<{}, State> {
    constructor(props: {}) {
      super(props);

      this.state = {
        activeColor: '#1C315F',
        displayColorPicker: false,
      };
    }

    onClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    _changeHandler = ({ hex }: { hex: string }) =>
      this.setState({
        activeColor: hex,
        displayColorPicker: !this.state.displayColorPicker,
      });

    render() {
      const { activeColor, displayColorPicker } = this.state;
      return (
        <Component
          {...this.props}
          activeColor={activeColor}
          displayColorPicker={displayColorPicker}
          onClick={this.onClick}
          onChange={this._changeHandler}
        />
      );
    }
  };
};

export default withSelectColor;
