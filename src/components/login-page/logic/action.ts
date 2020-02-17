import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { EMPTY_MEMBER } from './constants';
import { MemberAction } from './action-types';
import Api from '../../../api/api';
import { getVarcharEight } from '../../../helpers';
import { IMember } from '../../../common/models/member';
import { Toasts } from '../../common';
import moment from 'moment';

const createMemeber: ActionCreator<ThunkAction<
  void,
  {},
  null,
  MemberAction
>> = (name: string, email: string) => async () => {
  try {
    const memberFullName = name.split(' ');
    const memberId = getVarcharEight();
    const members = await Api.get('/members');
    const isExistMember = members.some(
      (it: IMember) => it.email_address === email
    );

    if (!isExistMember) {
      await Api.post('/members', {
        ...EMPTY_MEMBER,
        member_id: memberId,
        created_by: memberId,
        first_name: memberFullName[0],
        last_name: memberFullName[1],
        email_address: email,
        created_datetime: moment
          .utc()
          .format('YYYY-MM-DD, hh:mm:ss')
          .replace(/,/, ''),
      });
    }
  } catch (err) {
    Toasts.errorToast(`${err}`);
  }
};

export { createMemeber };
