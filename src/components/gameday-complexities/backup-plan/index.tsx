import React from 'react';
import styles from './styles.module.scss';
import { SectionDropdown, Button } from 'components/common';
import CreateIcon from '@material-ui/icons/Create';
import { BindingCbWithOne } from 'common/models';

interface Props {
  name: string;
  eventName: string;
  type: string;
  expanded: boolean;
  index: number;
  onToggleOne: BindingCbWithOne<number>;
}

class BackupPlan extends React.Component<Props> {
  onSectionToggle = () => {
    this.props.onToggleOne(this.props.index);
  };
  render() {
    const { name, eventName, type } = this.props;
    return (
      <div className={styles.container}>
        <SectionDropdown
          isDefaultExpanded={true}
          expanded={this.props.expanded !== undefined && this.props.expanded}
          onToggle={this.onSectionToggle}
        >
          <div className={styles.sectionTitle}>{name || ''}</div>
          <div className={styles.sectionContent}>
            <div className={styles.info}>
              <div>
                <span className={styles.title}>Tournament:</span>{' '}
                {eventName || ''}
              </div>
              <div>
                <span className={styles.title}>Type:</span> {type || ''}
              </div>
            </div>
            <div className={styles.details}>
              <div>
                <span className={styles.title}>Games Selected to Change</span>
              </div>
              <div>Main Stadium / Field 1, Field 2 / 2:00 PM, 5:00 PM</div>
            </div>
            <div className={styles.buttonsContainer}>
              <Button
                label="Edit Backup"
                variant="text"
                color="secondary"
                icon={<CreateIcon />}
              />
              <Button
                label="Activate Backup Plan"
                variant="contained"
                color="primary"
              />
            </div>
          </div>
        </SectionDropdown>
      </div>
    );
  }
}

export default BackupPlan;
