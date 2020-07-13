import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { loadRegistrantData } from 'components/register-page/individuals/player-stats/logic/actions';
import DefaultGroup from './defaultGroup';
import RequestGroup from './requestGroup';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
  BindingCbWithThree,
} from 'common/models';
import styles from './styles.module.scss';

interface IRegistrationDetails {
  eventId: string;
  registrantDataFields: any;
  loadRegistrantData: BindingCbWithOne<string>;
  updateRequestIds: BindingCbWithTwo<any, string>;
  updateOptions: BindingCbWithThree<number | string, number, boolean>;
  requestIds: any;
  onAddNewField: () => void;
}

const DataRequest = ({
  eventId,
  registrantDataFields,
  loadRegistrantData,
  updateRequestIds,
  updateOptions,
  requestIds,
  onAddNewField,
}: IRegistrationDetails) => {
  useEffect(() => {
    loadRegistrantData(eventId);
  }, []);
  const getRequestFields = () =>
    registrantDataFields.filter((el: any) =>
      requestIds.every((id: number | string) => id !== el.data_field_id)
    );

  const getDefaultFields = () =>
    registrantDataFields.filter((el: any) =>
      requestIds.some((id: number | string) => id === el.data_field_id)
    );

  return (
    <div className={styles.fieldGroupContainer}>
      <DndProvider backend={HTML5Backend}>
        <DefaultGroup
          fields={getRequestFields()}
          updateRequestIds={updateRequestIds}
          onAddNewField={onAddNewField}
        />
        <RequestGroup
          fields={getDefaultFields()}
          updateRequestIds={updateRequestIds}
          updateOptions={updateOptions}
        />
      </DndProvider>
    </div>
  );
};

const mapStateToProps = (state: {
  playerStatsReducer: { registrantDataFields: any };
}) => ({
  registrantDataFields: state.playerStatsReducer.registrantDataFields,
});

const mapDispatchToProps = {
  loadRegistrantData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataRequest);
