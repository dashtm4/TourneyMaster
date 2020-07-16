import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { loadRegistrantData } from 'components/register-page/individuals/player-stats/logic/actions';
import {
  updateRequestedIds,
  updateOptions,
} from 'components/registration/registration-edit/logic/actions';

import DefaultGroup from './defaultGroup';
import RequestGroup from './requestGroup';
import { BindingCbWithOne } from 'common/models';
import styles from './styles.module.scss';

interface IDataRequest {
  requestedIds: any;
  options: any;
  registrantDataFields: any;
  loadRegistrantData: () => void;
  updateRequestedIds: BindingCbWithOne<any>;
  updateOptions: BindingCbWithOne<any>;
  onAddNewField: () => void;
}

const DataRequest = ({
  requestedIds,
  options,
  registrantDataFields,
  loadRegistrantData,
  updateRequestedIds,
  updateOptions,
  onAddNewField,
}: IDataRequest) => {
  useEffect(() => {
    loadRegistrantData();
  }, []);

  console.log('> rquestedIds', requestedIds, options);
  const getRequestFields = () =>
    registrantDataFields.filter((el: any) =>
      requestedIds.every((id: number | string) => id !== el.data_field_id)
    );

  const getDefaultFields = () =>
    registrantDataFields.filter((el: any) =>
      requestedIds.some((id: number | string) => id === el.data_field_id)
    );

  return (
    <div className={styles.fieldGroupContainer}>
      <DndProvider backend={HTML5Backend}>
        <DefaultGroup
          fields={getRequestFields()}
          updateRequestedIds={updateRequestedIds}
          onAddNewField={onAddNewField}
        />
        <RequestGroup
          fields={getDefaultFields()}
          options={options}
          updateRequestedIds={updateRequestedIds}
          updateOptions={updateOptions}
        />
      </DndProvider>
    </div>
  );
};

const mapStateToProps = (state: {
  registration: { requestedIds: any; options: any };
}) => ({
  requestedIds: state.registration.requestedIds,
  options: state.registration.options,
});

const mapDispatchToProps = {
  loadRegistrantData,
  updateRequestedIds,
  updateOptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataRequest);
