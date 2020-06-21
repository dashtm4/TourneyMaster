import React from 'react';
import { Props } from '../../';

interface State {
  activeColor: string;
}

const withSelectColor = (Component: React.ComponentType<Props>) => {
  return class WithSelectColor extends React.Component<any, State> {
    constructor(props: {}) {
      super(props);

      this.state = {
        activeColor: '1C315F',
      };
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.value !== this.props.value)
        this.setState({ activeColor: this.props.value });
    }

    _changeHandler = (value: any) => {
      this.setState({
        activeColor: value,
      });
      this.props.onChange(value);
    };

    render() {
      const { activeColor } = this.state;
      return (
        <Component
          {...this.props}
          value={activeColor}
          onChange={this._changeHandler}
        />
      );
    }
  };
};

export default withSelectColor;
