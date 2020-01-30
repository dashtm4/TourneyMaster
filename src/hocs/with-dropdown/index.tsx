import React from 'react';

interface State {
  isOpen: boolean;
}

const withDropdown = (Component: any) => {
  return class WithDropdown extends React.Component<any, State> {
    constructor(props: any) {
      super(props)
      
      this.state = {
        isOpen: false
      }
    }

    toggleOpenHandler = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }))
    

    render() {
      const { isOpen } = this.state

      return (
        <Component {...this.props} isOpen={isOpen} onDropdownToggle={this.toggleOpenHandler}/>
      )
    }
  }
}

export default withDropdown;
