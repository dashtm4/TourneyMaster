import React, { useState } from 'react';
import { Modal, Button, Radio } from 'components/common';
import styles from './styles.module.scss';
import { AdvancedWorkflowOptionTypes } from 'common/enums/table-schedule';
import TeamForTeamGameSwap from 'components/common/table-schedule/components/team-for-team-game-swap';
import UpdateTimeslots from 'components/common/table-schedule/components/update-timeslots';
import { IDivision, ISchedulesDetails } from 'common/models';
import { ITeam } from 'common/models/schedule/teams';

interface Props {
  buttonTitle: string;
  modalHeader: string;
  divisions: IDivision[];
  teams: ITeam[];
  schedulesDetails: ISchedulesDetails[] | undefined;
}

const PopupAdvanced = ({
  buttonTitle,
  modalHeader,
  divisions,
  teams,
  schedulesDetails,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    AdvancedWorkflowOptionTypes.TEAM_FOR_TEAM_GAME_SWAP
  );

  const renderSelectedOption = (option: string) => {
    switch (option) {
      case AdvancedWorkflowOptionTypes.TEAM_FOR_TEAM_GAME_SWAP:
        return (
          <TeamForTeamGameSwap
            divisions={divisions}
            teams={teams}
            schedulesDetails={schedulesDetails}
          />
        );
      case AdvancedWorkflowOptionTypes.UPDATE_TIMESLOTS:
        return <UpdateTimeslots schedulesDetails={schedulesDetails} />;
      default:
        return <></>;
    }
  };

  return (
    <div className={styles.container}>
      <Button
        btnStyles={{
          backgroundColor: '#1C315F',
          color: '#fff',
          marginLeft: '15px',
          marginBottom: '2px',
        }}
        label={buttonTitle}
        variant="text"
        color="default"
        onClick={() => setOpen(open => !open)}
      />
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className={styles.modalContainer}>
          <div>
            <h4 className={styles.title}>{modalHeader}</h4>
          </div>
          <div className={styles.workflowOptions}>
            <Radio
              options={Object.values(AdvancedWorkflowOptionTypes)}
              checked={selectedOption}
              onChange={(e: any) =>
                setSelectedOption(e.nativeEvent.target.value)
              }
              row={true}
            />
          </div>
          <div className={styles.selectedOptionComponent}>
            {renderSelectedOption(selectedOption)}
          </div>
          <div className={styles.btnsWrapper}>
            <Button
              label="Close"
              variant="contained"
              color="primary"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PopupAdvanced;
