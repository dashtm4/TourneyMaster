import React from 'react';

interface State {
  name: string;
  email: string;
  password: string;
}

const withEditingForm = (Component: React.ComponentType<any>) =>
  class WithEditingForm extends React.Component<any, State> {
    constructor(props: any) {
      super(props);

      this.state = {
        name: '',
        email: '',
        password: '',
      };
    }

    onChangeField = ({ target: { name, value } }: any) =>
      this.setState({ [name]: value } as Pick<State, keyof State>);

    render() {
      const { name, email, password } = this.state;

      return (
        <Component
          {...this.props}
          name={name}
          email={email}
          password={password}
          onChange={this.onChangeField}
        />
      );
    }
  };

export default withEditingForm;
