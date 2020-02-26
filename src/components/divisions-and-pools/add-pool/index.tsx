import React from 'react';
import Input from 'components/common/input';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import { BindingCbWithOne, BindingAction, IDisision } from 'common/models';

interface IAddPoolState {
  divisions_id?: string;
  pool_name: string;
  pool_tag: string;
}

interface IAddPoolProps {
  division: IDisision;
  savePool: BindingCbWithOne<IAddPoolState>;
  onClose: BindingAction;
}

class AddPool extends React.Component<IAddPoolProps, IAddPoolState> {
  state = {
    division_id: this.props.division.division_id,
    pool_name: '',
    pool_tag: '',
  };

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pool_name: e.target.value });
  };

  onTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pool_tag: e.target.value });
  };

  onSave = () => {
    this.props.savePool(this.state);
    this.props.onClose();
  };

  render() {
    const { division } = this.props;
    const { pool_name, pool_tag } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.sectionTitle}>Add Pool</div>
        <div className={styles.sectionRow}>
          <Input
            width="221px"
            label="Name"
            value={pool_name || ''}
            onChange={this.onNameChange}
          />
          <Input
            width="221px"
            label="Tag"
            startAdornment="@"
            value={pool_tag || ''}
            onChange={this.onTagChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Division:</span>{' '}
          {division.long_name || '—'}
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Teams:</span>{' '}
          {division.teams_registered || '—'}
        </div>
        <div className={styles.buttonsGroup}>
          <div>
            <Button
              label="Cancel"
              variant="text"
              color="secondary"
              onClick={this.props.onClose}
            />
            <Button
              label="Save"
              variant="contained"
              color="primary"
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AddPool;
