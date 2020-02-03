import React from 'react';

interface State {
  activeColor: string;
}

const withSelectColor = (Component: any) => {
  return class WithSelectColor extends React.Component<any, State> {
    constructor(props: any) {
      super(props);

      this.state = {
        activeColor: '',
      };
    }

    _changeHandler = ({ hex }: any) => this.setState({ activeColor: hex });

    render() {
      const { activeColor } = this.state;

      return (
        <Component
          {...this.props}
          activeColor={activeColor}
          onChange={this._changeHandler}
        />
      );
    }
  };
};

export default withSelectColor;
