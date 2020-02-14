import React from 'react';
import Input from 'components/common/input';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';

class AddPool extends React.Component<any> {
  state = { name: '', tag: '' };

  onNameChange = (e: any) => {
    this.setState({ name: e.target.value });
  };

  onTagChange = (e: any) => {
    this.setState({ tag: e.target.value });
  };

  onSave = () => {
    // TODO save pool
    this.props.onClose();
  };

  render() {
    const { division, teams } = this.props;
    const { name, tag } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.sectionTitle}>Add Pool</div>
        <div className={styles.sectionRow}>
          <Input
            width="221px"
            label="Name"
            value={name || ''}
            onChange={this.onNameChange}
          />
          <Input
            width="221px"
            label="Tag"
            startAdornment="@"
            value={tag || ''}
            onChange={this.onTagChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Division:</span> {division || '—'}
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Teams:</span> {teams || '—'}
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
